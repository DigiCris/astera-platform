"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { isAddress, isHex } from "viem";
import { hardhat } from "viem/chains";
import { usePublicClient } from "wagmi";
import { Button } from "~~/components/ui/shadcn/button";
import { Input } from "~~/components/ui/shadcn/input";

export const SearchBar = () => {
  const router = useRouter();
  const client = usePublicClient({ chainId: hardhat.id });

  //states
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isHex(searchInput)) {
      try {
        const tx = await client?.getTransaction({ hash: searchInput });
        if (tx) {
          router.push(`/blockexplorer/transaction/${searchInput}`);
          return;
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      }
    }

    if (isAddress(searchInput)) {
      router.push(`/blockexplorer/address/${searchInput}`);
      return;
    }
  };

  return (
    <div className="w-full flex items-center justify-end mb-5 space-x-3 mx-5">
      <form onSubmit={handleSearch} className="w-full sm:w-4/12 flex gap-2">
        <Button type="submit" size="icon">
          <Search />
        </Button>

        <Input
          type="search"
          placeholder="Search by hash or address"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </form>
    </div>
  );
};
