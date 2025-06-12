

"use client";

import { NextIntlClientProvider, Messages } from "next-intl";
import { ReactNode, useEffect, useState } from "react";

export default function IntlProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    const initialLocale = stored || "en";
    setLocale(initialLocale);

    import(`../../messages/${initialLocale}.json`).then((mod) =>
      setMessages(mod.default)
    );
  }, []);

  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
