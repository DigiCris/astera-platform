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
      address: "0x0aaDc9C0f266b76BB280A2a9dA5bC0039e486f4e",
      abi: IdentityRegistryABI,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
