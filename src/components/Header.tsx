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
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 py-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-2 sm:mb-0 break-words">
        Včelí vzpomínky pro Adama 🐝
      </h1>
      <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
        {!isLoading && isAuthenticated && isAdmin && (
          <Button className="w-full sm:w-auto">
            <Link className="cursor-pointer w-full block text-center" to="/memories">
              Správa vzpomínek
            </Link>
          </Button>
        )}
        {!isLoading && isAuthenticated && (
          <Button onClick={onLogout} className="cursor-pointer w-full sm:w-auto">
            Odhlásit se
          </Button>
        )}
      </nav>
    </header>
  );
}
