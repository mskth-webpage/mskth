"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import LoginView from "@/view/LoginView";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPresenter() {
  const t = useTranslations("LoginPage");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const payload =
        response.headers.get("content-type")?.includes("application/json")
          ? ((await response.json()) as { error?: string })
          : {};

      if (!response.ok) {
        const message = payload.error?.toLowerCase() ?? "";

        setError(
          message.includes("invalid login credentials")
            ? t("invalidCredentials")
            : t("genericError"),
        );
        setIsSubmitting(false);
        return;
      }

      setSuccess(t("success"));
      router.refresh();
      router.replace({ pathname: "/admin/dashboard" }, { locale });
    } catch {
      setError(t("genericError"));
      setIsSubmitting(false);
    }
  };

  return (
    <LoginView
      email={form.email}
      password={form.password}
      error={error}
      success={success}
      isSubmitting={isSubmitting}
      onEmailChange={(email) =>
        setForm((current) => ({ ...current, email }))
      }
      onPasswordChange={(password) =>
        setForm((current) => ({ ...current, password }))
      }
      onSubmit={handleSubmit}
    />
  );
}
