"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/client";
import LoginView from "@/view/LoginView";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPresenter() {
  const t = useTranslations("LoginPage");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (signInError) {
      setError(
        signInError.message.toLowerCase().includes("invalid login credentials")
          ? t("invalidCredentials")
          : t("genericError"),
      );
      setIsSubmitting(false);
      return;
    }

    setSuccess(t("success"));
    router.refresh();
    router.replace({ pathname: "/admin/dashboard" }, { locale });
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
