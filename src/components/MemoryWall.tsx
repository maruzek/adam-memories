import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MemoryCard } from "@/components/MemoryCard";

export function MemoryWall() {
  const memories = useQuery(api.memories.list) || [];
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-8">Shared Memories</h2>
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
