#!/usr/bin/env node
'use strict';

const readline = require('readline');
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// contracts/ root — two levels up from scripts/admin/
const ROOT = path.resolve(__dirname, '..', '..');
const TMP_ENV = path.join(ROOT, '.env.deploy-token.tmp');
const DEPLOYMENTS_DIR = path.join(ROOT, 'docs', 'tokenDeployments');

const DEFAULTS = {
  EXCHANGE:               '0x89B2b2FE6fC68a865A258c2C99adaCF5aF4c5A35',
  TOKEN_NAME:             'Astera Real Estate I',
  TOKEN_SYMBOL:           'AREI',
  TOKEN_MAX_SUPPLY:       '100000000000',
  TOKEN_SOFT_CAP:         '25000000000',
  TOKEN_FUNDING_DEADLINE: '1784097725',
  FIDEICOMISO_WALLET:     '0xd22077414e8859BA08723fEC0ac54D0365346D1e',
  GENERIC_DOCUMENT_HASH:  '0x6997b5bd3d2c1b7e3812ca8741ad8183292eb39507b7433e622e2474c0fff23a',
  GENERIC_DOCUMENT_URI:   'https://ivory-accessible-owl-927.mypinata.cloud/ipfs/bafkreiaycpbk6u5a2j6o7j3pwmn7qakvmgix2kt2queuiw733gqvn27kl4',
};

// ---------------------------------------------------------------------------
// Env parsing
// ---------------------------------------------------------------------------

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const result = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isAddress(s) { return /^0x[0-9a-fA-F]{40}$/.test(s); }
function isBytes32(s)  { return /^0x[0-9a-fA-F]{64}$/.test(s); }

function validate(p) {
  const errs = [];

  if (!isAddress(p.EXCHANGE))
    errs.push('EXCHANGE: must be a valid address (0x + 40 hex chars)');
  if (!isAddress(p.FIDEICOMISO_WALLET))
    errs.push('FIDEICOMISO_WALLET: must be a valid address');
  if (!isBytes32(p.GENERIC_DOCUMENT_HASH))
    errs.push('GENERIC_DOCUMENT_HASH: must be bytes32 (0x + 64 hex chars)');
  if (!p.TOKEN_NAME.trim())
    errs.push('TOKEN_NAME: cannot be empty');
  if (!p.TOKEN_SYMBOL.trim())
    errs.push('TOKEN_SYMBOL: cannot be empty');
  if (!p.GENERIC_DOCUMENT_URI.trim())
    errs.push('GENERIC_DOCUMENT_URI: cannot be empty');

  let maxSupply, softCap;
  try { maxSupply = BigInt(p.TOKEN_MAX_SUPPLY); }
  catch { errs.push('TOKEN_MAX_SUPPLY: must be a valid integer'); return errs; }
  try { softCap = BigInt(p.TOKEN_SOFT_CAP); }
  catch { errs.push('TOKEN_SOFT_CAP: must be a valid integer'); return errs; }

  if (maxSupply <= 0n) errs.push('TOKEN_MAX_SUPPLY: must be > 0');
  if (softCap   <= 0n) errs.push('TOKEN_SOFT_CAP: must be > 0');
  if (softCap > maxSupply) errs.push('TOKEN_SOFT_CAP must be <= TOKEN_MAX_SUPPLY');

  const deadline = parseInt(p.TOKEN_FUNDING_DEADLINE, 10);
  if (isNaN(deadline) || deadline <= Math.floor(Date.now() / 1000))
    errs.push('TOKEN_FUNDING_DEADLINE: must be a unix timestamp in the future');

  return errs;
}

// ---------------------------------------------------------------------------
// Interactive prompts
// ---------------------------------------------------------------------------

function ask(rl, q) {
  return new Promise(resolve => rl.question(q, a => resolve(a.trim())));
}

async function collectParams() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n=== Astera Finance — Deploy Project Token ===\n');
  console.log('Press Enter to accept the default value shown in brackets.\n');

  const fields = [
    { key: 'EXCHANGE',               label: 'Exchange contract address' },
    { key: 'TOKEN_NAME',             label: 'Token name' },
    { key: 'TOKEN_SYMBOL',           label: 'Token symbol' },
    { key: 'TOKEN_MAX_SUPPLY',       label: 'Max supply (uint256, 6 decimals)' },
    { key: 'TOKEN_SOFT_CAP',         label: 'Soft cap  (uint256, 6 decimals)' },
    { key: 'TOKEN_FUNDING_DEADLINE', label: 'Funding deadline (unix timestamp)' },
    { key: 'FIDEICOMISO_WALLET',     label: 'Fideicomiso wallet address' },
    { key: 'GENERIC_DOCUMENT_HASH',  label: 'Document hash (bytes32)' },
    { key: 'GENERIC_DOCUMENT_URI',   label: 'Document URI' },
  ];

  const params = {};
  for (const f of fields) {
    const raw = await ask(rl, `  ${f.label} [${DEFAULTS[f.key]}]: `);
    params[f.key] = raw || DEFAULTS[f.key];
  }
  rl.close();
  return params;
}

// ---------------------------------------------------------------------------
// Temp env file
// ---------------------------------------------------------------------------

function writeTmpEnv(params) {
  const lines = Object.entries(params).map(([k, v]) => `${k}="${v}"`);
  fs.writeFileSync(TMP_ENV, lines.join('\n') + '\n', 'utf8');
}

// ---------------------------------------------------------------------------
// Forge execution
// ---------------------------------------------------------------------------

function runForge(env) {
  const rpcUrl = env.AVALANCHE_RPC_URL || env.RPC_URL;
  if (!rpcUrl) {
    console.error('\nError: AVALANCHE_RPC_URL not found in .env');
    process.exit(1);
  }
  return spawnSync(
    'forge',
    [
      'script',
      'script/deploy/DeployToken.s.sol:DeployToken',
      '--broadcast',
      '--rpc-url', rpcUrl,
    ],
    { cwd: ROOT, env, encoding: 'utf8' }
  );
}

// ---------------------------------------------------------------------------
// Output parsing
// ---------------------------------------------------------------------------

function extractAddresses(output) {
  const tMatch = output.match(/AsteraToken:\s*(0x[0-9a-fA-F]{40})/);
  const cMatch = output.match(/AsteraComplianceManager:\s*(0x[0-9a-fA-F]{40})/);
  return {
    tokenAddress:             tMatch?.[1] ?? null,
    complianceManagerAddress: cMatch?.[1] ?? null,
  };
}

// ---------------------------------------------------------------------------
// Broadcast file (optional enrichment)
// ---------------------------------------------------------------------------

function tryBroadcastData() {
  const base = path.join(ROOT, 'broadcast', 'DeployToken.s.sol');
  if (!fs.existsSync(base)) return {};

  let latestFile = null, latestMtime = 0;
  try {
    for (const dir of fs.readdirSync(base)) {
      const candidate = path.join(base, dir, 'run-latest.json');
      if (fs.existsSync(candidate)) {
        const mtime = fs.statSync(candidate).mtimeMs;
        if (mtime > latestMtime) { latestMtime = mtime; latestFile = candidate; }
      }
    }
  } catch { return {}; }

  if (!latestFile) return {};

  try {
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    const tx0  = (data.transactions || [])[0] || {};
    return {
      txHash:        tx0.hash                    ?? null,
      chainId:       data.chain                  ?? null,
      deployer:      tx0.transaction?.from        ?? null,
      broadcastPath: path.relative(ROOT, latestFile),
    };
  } catch { return {}; }
}

// ---------------------------------------------------------------------------
// Deployment record
// ---------------------------------------------------------------------------

function dateTag() {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getFullYear()).slice(2),
  ].join('_');
}

function saveJSON(params, addresses, broadcastData) {
  fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  const filename = `${dateTag()}_${params.TOKEN_SYMBOL}.json`;
  const filePath = path.join(DEPLOYMENTS_DIR, filename);

  const record = {
    tokenName:                params.TOKEN_NAME,
    tokenSymbol:              params.TOKEN_SYMBOL,
    tokenAddress:             addresses.tokenAddress,
    complianceManagerAddress: addresses.complianceManagerAddress,
    exchange:                 params.EXCHANGE,
    maxSupply:                params.TOKEN_MAX_SUPPLY,
    softCap:                  params.TOKEN_SOFT_CAP,
    fundingDeadline:          parseInt(params.TOKEN_FUNDING_DEADLINE, 10),
    fideicomisoWallet:        params.FIDEICOMISO_WALLET,
    genericDocumentHash:      params.GENERIC_DOCUMENT_HASH,
    genericDocumentURI:       params.GENERIC_DOCUMENT_URI,
    deployedAt:               new Date().toISOString(),
    ...broadcastData,
  };

  fs.writeFileSync(filePath, JSON.stringify(record, null, 2) + '\n', 'utf8');
  return { filePath, filename };
}

// ---------------------------------------------------------------------------
// Git
// ---------------------------------------------------------------------------

function gitCommitAndPush(filePath, symbol) {
  const rel = path.relative(ROOT, filePath);
  execSync(`git add "${rel}"`, { cwd: ROOT, stdio: 'inherit' });
  execSync(`git commit -m "${symbol} deployed"`, { cwd: ROOT, stdio: 'inherit' });
  execSync('git push', { cwd: ROOT, stdio: 'inherit' });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let tmpWritten = false;

  try {
    const params = await collectParams();

    const errors = validate(params);
    if (errors.length > 0) {
      console.error('\nValidation failed:');
      errors.forEach(e => console.error(`  • ${e}`));
      process.exit(1);
    }

    console.log('\nParameters confirmed:');
    Object.entries(params).forEach(([k, v]) => console.log(`  ${k}=${v}`));

    writeTmpEnv(params);
    tmpWritten = true;

    const baseEnv   = parseEnvFile(path.join(ROOT, '.env'));
    const tokenEnv  = parseEnvFile(TMP_ENV);
    const mergedEnv = { ...process.env, ...baseEnv, ...tokenEnv };

    console.log('\nRunning forge deploy (broadcasting to Avalanche mainnet)...\n');
    const result = runForge(mergedEnv);

    const output = (result.stdout || '') + (result.stderr || '');
    if (output) process.stdout.write(output);

    if (result.error) {
      console.error('\nFailed to invoke forge:', result.error.message);
      process.exit(1);
    }
    if (result.status !== 0) {
      console.error(`\nDeploy failed (exit ${result.status}).`);
      process.exit(1);
    }

    const addresses = extractAddresses(output);
    if (!addresses.tokenAddress) {
      console.error('\nDeploy succeeded but could not find AsteraToken address in forge output.');
      process.exit(1);
    }

    console.log(`\nAsteraToken deployed:             ${addresses.tokenAddress}`);
    console.log(`AsteraComplianceManager deployed:  ${addresses.complianceManagerAddress}`);

    const broadcastData = tryBroadcastData();
    const { filePath, filename } = saveJSON(params, addresses, broadcastData);
    console.log(`\nDeployment record saved: docs/tokenDeployments/${filename}`);

    try {
      gitCommitAndPush(filePath, params.TOKEN_SYMBOL);
      console.log('\nCommitted and pushed to GitHub.');
    } catch (gitErr) {
      console.error('\nWarning: deploy succeeded and JSON was saved, but git failed:');
      console.error(gitErr.message);
      console.error(
        `\nCommit manually:\n  git add docs/tokenDeployments/${filename} && ` +
        `git commit -m "${params.TOKEN_SYMBOL} deployed" && git push`
      );
    }

  } finally {
    if (tmpWritten && fs.existsSync(TMP_ENV)) {
      fs.unlinkSync(TMP_ENV);
    }
  }
}

main().catch(err => {
  console.error('\nUnexpected error:', err.message);
  process.exit(1);
});
