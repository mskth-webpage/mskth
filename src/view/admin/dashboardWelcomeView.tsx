import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  hint: string;
  logoutLabel: string;
  logout: () => Promise<void>;
};

export default function DashboardWelcomeView({
  title,
  description,
  hint,
  logoutLabel,
  logout,
}: Props) {
  return (
    <section className="flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl border-border/80 py-0 shadow-lg">
        <CardHeader className="px-6 pt-6">
          <CardAction>
            <form action={logout}>
              <Button type="submit" variant="outline" className="rounded-full">
                {logoutLabel}
              </Button>
            </form>
          </CardAction>
          <CardTitle className="font-serif text-3xl tracking-tight sm:text-4xl">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-7">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            {hint}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
