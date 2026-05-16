import { TransactionHash } from "./TransactionHash";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { Badge } from "~~/components/ui/shadcn/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~~/components/ui/shadcn/table";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { TransactionWithFunction } from "~~/utils/scaffold-eth";
import { TransactionsTableProps } from "~~/utils/scaffold-eth/";

export const TransactionsTable = ({ blocks, transactionReceipts }: TransactionsTableProps) => {
  const { targetNetwork } = useTargetNetwork();

  return (
    <Table className="border rounded-lg">
      <TableCaption>Transactions</TableCaption>
      <TableHeader className="bg-secondary">
        <TableRow>
          <TableHead className="w-[100px]">Transaction Hash</TableHead>
          <TableHead className="w-[100px]">Function Called</TableHead>
          <TableHead className="w-[100px]">Block Number</TableHead>
          <TableHead className="w-[100px]">Time Mined</TableHead>
          <TableHead className="w-[100px]">From</TableHead>
          <TableHead className="w-[100px]">To</TableHead>
          <TableHead className="w-[100px]">Value ({targetNetwork.nativeCurrency.symbol})</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocks.map(block =>
          (block.transactions as TransactionWithFunction[]).map(tx => {
            const receipt = transactionReceipts[tx.hash];
            const timeMined = new Date(Number(block.timestamp) * 1000).toLocaleString();
            const functionCalled = tx.input.substring(0, 10);

            return (
              <TableRow key={tx.hash} className={"hover h-12 "}>
                <TableCell>
                  <TransactionHash hash={tx.hash} />
                </TableCell>
                <TableCell>
                  {tx.functionName === "0x" ? "" : <span className="mr-1">{tx.functionName}</span>}
                  {functionCalled !== "0x" && <Badge>{functionCalled}</Badge>}
                </TableCell>
                <TableCell>{block.number?.toString()}</TableCell>
                <TableCell>{timeMined}</TableCell>
                <TableCell>
                  <Address address={tx.from} size="sm" onlyEnsOrAddress />
                </TableCell>
                <TableCell>
                  {!receipt?.contractAddress ? (
                    tx.to && <Address address={tx.to} size="sm" onlyEnsOrAddress />
                  ) : (
                    <div className="relative">
                      <Address address={receipt.contractAddress} size="sm" onlyEnsOrAddress />
                      <small className="absolute top-4 left-4">(Contract Creation)</small>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatEther(tx.value)} {targetNetwork.nativeCurrency.symbol}
                </TableCell>
              </TableRow>
            );
          }),
        )}
      </TableBody>
    </Table>
  );
};
