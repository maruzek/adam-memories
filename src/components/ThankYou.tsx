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
        <CardTitle>Thank you for sharing a memory! 🐝</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Your memory has been received. Adam and his family appreciate your
          contribution.
        </p>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
