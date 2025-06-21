import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { useState } from "react";

export function NamePrompt() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.me); // Write a query to get current user
  const setName = useMutation(api.users.setName);
  const [name, setNameInput] = useState("");

  if (!isAuthenticated) return null;
  if (!user) return null; // loading
  if (user.name) return null; // name already set

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setName({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Zadejte své jméno:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setNameInput(e.target.value)}
        required
      />
      <button type="submit">Uložit</button>
    </form>
  );
}
