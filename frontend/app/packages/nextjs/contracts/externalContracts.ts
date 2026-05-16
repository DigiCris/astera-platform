import { IdentityRegistryABI } from "./identityRegistryABI";
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
    IdentityRegistry: {
      address: "0x0B66baEF242C8aB2bFe387DC9a5412c7f903Eca1",
      abi: IdentityRegistryABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
