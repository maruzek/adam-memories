import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "react-router";

export function Header({
  isLoading,
  isAuthenticated,
  onLogout,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
}) {
  const isAdmin = useQuery(api.users.isAdmin);
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Včelí vzpomínky pro Adama 🐝</h1>
      <nav className="flex space-x-4">
        {!isLoading && isAuthenticated && isAdmin && (
          <Button>
            <Link className="cursor-pointer" to="/memories">
              Správa vzpomínek
            </Link>
          </Button>
        )}
        {!isLoading && isAuthenticated && (
          <Button onClick={onLogout} className="cursor-pointer">
            Odhlásit se
          </Button>
        )}
      </nav>
    </header>
  );
}
