import { Button } from "@/components/ui/button";

export function Header({
  isLoading,
  isAuthenticated,
  onLogout,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
}) {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Včelí vzpomínky pro Adama 🐝</h1>
      {!isLoading && isAuthenticated && (
        <Button onClick={onLogout} className="cursor-pointer">
          Odhlásit se
        </Button>
      )}
    </header>
  );
}
