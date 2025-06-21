import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function ThankYou() {
  return (
    <Card className="w-full max-w-lg mx-auto text-center p-8">
      <CardHeader>
        <CardTitle>Poděkování</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Děkujeme za sdílení vaší vzpomínky! Moc si toho vážíme.</p>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
