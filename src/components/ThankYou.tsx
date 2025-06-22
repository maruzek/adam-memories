import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";

type ThankYouProps = {
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ThankYou({ setSubmitted }: ThankYouProps) {
  return (
    <Card className="w-full max-w-lg mx-auto text-center p-8">
      <CardHeader>
        <CardTitle>Poděkování</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Děkujeme za sdílení vaší vzpomínky! Moc si toho vážíme.</p>

        <Button onClick={() => setSubmitted?.(false)}>Přidat další</Button>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
