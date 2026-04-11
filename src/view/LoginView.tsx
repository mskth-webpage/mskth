"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginViewProps = {
  email: string;
  password: string;
  error: string;
  success: string;
  isSubmitting: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function LoginView({
  email,
  password,
  error,
  success,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginViewProps) {
  const t = useTranslations("LoginPage");

  return (
    <section className="flex min-h-full w-full items-center align-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[960px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div className="mx-auto flex max-w-[420px] flex-col justify-center space-y-4 lg:mx-0">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-color-mskth-blue">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </div>

        <Card className="mx-auto w-full max-w-[420px] border-border/80 py-0 shadow-lg">
          <CardHeader className="px-6 pt-6">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="email"
                >
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  {t("passwordLabel")}
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="text-sm text-emerald-600" role="status">
                  {success}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
