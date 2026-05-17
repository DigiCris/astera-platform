import { ASTERA_PRIMARY_EXCHANGE_ABI } from "./abis/asteraPrimaryExchangeABI";
import { COMPLIANCE_ABI } from "./abis/complianceABI";
import { IDENTITY_REGISTRY_ABI } from "./abis/identityRegistryABI";
import { USDC_ABI } from "./abis/usdcABI";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  43_114: {
    AsteraIdentityRegistry: {
      address: "0x0B66baEF242C8aB2bFe387DC9a5412c7f903Eca1",
      abi: IDENTITY_REGISTRY_ABI,
    },
    AsteraComplianceManager: {
      address: "0xFA129CC39d49942b1D0C4fb5587DB605B98E1Dd9",
      abi: COMPLIANCE_ABI,
    },
    USDC: {
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      abi: USDC_ABI,
    },
    AsteraPrimaryExchange: {
      address: "0x89B2b2FE6fC68a865A258c2C99adaCF5aF4c5A35",
      abi: ASTERA_PRIMARY_EXCHANGE_ABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
