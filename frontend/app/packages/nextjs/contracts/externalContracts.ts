import { ComplianceABI } from "./abis/complianceABI";
import { IdentityRegistryABI } from "./abis/identityRegistryABI";
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
      abi: IdentityRegistryABI,
    },
    AsteraComplianceManager: {
      address: "0xFA129CC39d49942b1D0C4fb5587DB605B98E1Dd9",
      abi: ComplianceABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
