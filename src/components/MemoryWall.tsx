import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MemoryCard } from "@/components/MemoryCard";
import { Navigate } from "react-router";
import { Skeleton } from "./ui/skeleton";
import type { Memory } from "@/types/Memory";
import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";
import type { User } from "@/types/User";

export function MemoryWall() {
  const [userFilter, setUserFilter] = useState<string>("");
  const users: User[] = useQuery(api.users.getAllUsers, {}) || [];
  const memories: Memory[] = useQuery(api.memories.list, { user: userFilter }) || [];
  const isAdmin = useQuery(api.users.isAdmin);

  if (isAdmin === false) {
    console.log("not admin user for memory wall");
    return <Navigate to="/" replace state={{ error: "Unauthorized" }} />;
  }

  if (isAdmin === undefined) {
    return (
      <div className="mt-12 animate-pulse">
        <Skeleton className="h-8 w-1/3 mx-auto mb-8" />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="break-inside-avoid mb-6 h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if ((memories.length <= 0 || !memories) && userFilter) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Sdílené vzpomínky {userFilter ? `od ${userFilter}` : ""}
        </h2>
        <div className="mb-6">
          <Combobox data={users} value={userFilter} onChange={setUserFilter} />
        </div>
        <p className="text-center text-gray-500">
          Žádné vzpomínky od <strong>{userFilter}</strong> nebyly nalezeny.
        </p>
      </div>
    );
  }

  if (!memories || memories.length <= 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Sdílené vzpomínky
        </h2>
        <div className="mb-6">
          <Combobox data={users} value={userFilter} onChange={setUserFilter} />
        </div>
        <p className="text-center text-gray-500">
          Zatím žádné vzpomínky nebyly sdíleny.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-8">Sdílené vzpomínky</h2>
      <div className="mb-6">
        <Combobox data={users} value={userFilter} onChange={setUserFilter} />
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {memories.map((memory) => (
          <div key={memory._id} className="break-inside-avoid mb-6 w-full">
            <MemoryCard memory={memory} />
          </div>
        ))}
      </div>
    </div>
  );
}
