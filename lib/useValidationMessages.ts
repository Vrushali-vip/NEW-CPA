
import { useState, useEffect, useCallback } from "react";
import enMessages from "@/messages/en.json";
import deMessages from "@/messages/de.json";

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

interface ValidationMessagesStructure {
  validation: {
    [key: string]: string | { [key: string]: string | { [key: string]: string } };
  };
  options: {
    [key: string]: { [key: string]: string } | { [key: string]: { [key: string]: string } };
  }
}

const messageStore: Record<string, DeepPartial<ValidationMessagesStructure>> = {
  en: enMessages as DeepPartial<ValidationMessagesStructure>,
  de: deMessages as DeepPartial<ValidationMessagesStructure>,
};

export type ValidationMessageGetter = (
  fullKey: string, 
  params?: Record<string, string | number>
) => string;

function getNestedValue(obj: DeepPartial<ValidationMessagesStructure>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function useValidationMessages() {
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && messageStore[storedLocale]) {
      setCurrentLocale(storedLocale);
    }

    const handleLocaleChange = () => {
        const newLocale = localStorage.getItem("locale") || "en";
        if (messageStore[newLocale]) {
            setCurrentLocale(newLocale);
        }
    };
    window.addEventListener('localeChanged', handleLocaleChange);
    return () => {
        window.removeEventListener('localeChanged', handleLocaleChange);
    };

  }, []);

  const getMessage: ValidationMessageGetter = useCallback(
    (fullKey, params) => {
      const messages = messageStore[currentLocale] || messageStore.en; 
      
      let messageTemplate = getNestedValue(messages, fullKey);

      if (messageTemplate === undefined) {
        console.warn(`Validation message not found for key: ${fullKey} in locale: ${currentLocale}. Falling back to English if possible.`);
        if (currentLocale !== 'en') {
            const englishMessages = messageStore.en;
            messageTemplate = getNestedValue(englishMessages, fullKey);
        }
        if (messageTemplate === undefined) {
            console.error(`CRITICAL: Validation message not found for key: ${fullKey} in any locale.`);
            return fullKey; 
        }
      }

      if (params) {
        Object.keys(params).forEach((key) => {
          const placeholder = new RegExp(`{{${key}}}|{{#${key}}}}`, "g"); 
          messageTemplate = (messageTemplate as string).replace(placeholder, String(params[key]));
        });
      }
      return messageTemplate as string;
    },
    [currentLocale]
  );

  return { getValidationMessage: getMessage, validationLocale: currentLocale };
}