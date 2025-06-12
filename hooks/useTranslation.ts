// import en from "@/messages/en.json";
// import de from "@/messages/de.json";

// const translations = { en, de };

// export function useTranslation(lang: "en" | "de" = "en") {
//   function t(path: string) {
//     const keys = path.split(".");
//     let result: any = translations[lang];
//     for (const key of keys) {
//       result = result?.[key];
//       if (result === undefined) break;
//     }
//     return result || path;
//   }
//   return { t };
// }


// hooks/useTranslation.tsx
import { useLocale } from "next-intl";
import en from "@/messages/en.json";
import de from "@/messages/de.json";

const translations = { en, de };

export function useTranslation() {
  const locale = useLocale() as "en" | "de";
  
  function t(path: string, p0?: { returnObjects: boolean; }) {
    const keys = path.split(".");
    let result: any = translations[locale];
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) break;
    }
    return result || path;
  }

  return { t };
}
