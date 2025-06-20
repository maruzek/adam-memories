import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sendMagicLink = "auth:sendMagicLink";

export function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const sendLink = useMutation(sendMagicLink);

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    sendLink({ email });
    setSent(true);
  };

  if (sent) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center p-8">
        <CardHeader>
          <CardTitle>Zkontrolujte svou schránku</CardTitle>
          <CardDescription>
            Odeslali jsme odkaz pro přihlášení na {email}. Prosím, klikněte na
            něj pro přihlášení.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto text-center p-8">
      <CardHeader>
        <CardTitle>Přihlášení</CardTitle>
        <CardDescription className="mt-2">
          Zadejte svůj e-mail a obdržíte bezpečný odkaz pro přihlášení. Žádné
          heslo není potřeba.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Odeslat odkaz pro přihlášení</Button>
        </form>
      </CardContent>
    </Card>
  );
}
