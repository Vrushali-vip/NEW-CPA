

// "use client";

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import * as React from "react";
// import { useTranslations } from "next-intl";

// type NavbarProps = {
//   scrollToArticles: () => void;
// };

// export default function Navbar({ scrollToArticles }: NavbarProps) {
//   const t = useTranslations("navbar");
//   const [currentLocale, setCurrentLocale] = React.useState("en");

//   React.useEffect(() => {
//     const storedLocale = localStorage.getItem("locale");
//     if (storedLocale) {
//       setCurrentLocale(storedLocale);
//     }
//   }, []);

//   const setLanguage = (locale: string) => {
//     localStorage.setItem("locale", locale);
//     window.location.reload();
//   };

//   return (
//     <header className="w-full shadow-sm bg-[#1A2C50]">
//       <div className="mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <div className="w-2/10 bg-white flex items-center justify-center">
//           <Image
//             src="/compass-point-assist-logo.png"
//             alt="Company Logo"
//             width={300}
//             height={300}
//             className="rounded-md py-2 px-2"
//           />
//         </div>

//         <div className="flex items-center w-9/10 justify-end mr-7 space-x-6">
//           <div>
//             <Button
//               variant="ghost"
//               className="text-xl font-semibold font-monteserrat text-[#ECCBAE] "
//               onClick={scrollToArticles}
//             >
//               {t("articles")}
//             </Button>
//           </div>

//           <div className="flex items-center text-md text-[#ECCBAE] space-x-1">
//             <button
//               onClick={() => setLanguage("en")}
//               className={`text-xl font-semibold font-monteserrat transition-all duration-200 ${
//                 currentLocale === "en" ? "opacity-50" : "opacity-100"
//               }`}
//             >
//               {t("language.en")}
//             </button>

//             <span className="text-[#ECCBAE]">|</span>

//             <button
//               onClick={() => setLanguage("de")}
//               className={`text-xl font-semibold font-monteserrat transition-all duration-200 ${
//                 currentLocale === "de" ? "opacity-50" : "opacity-100"
//               }`}
//             >
//               {t("language.de")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


// "use client";

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import * as React from "react";
// import { useTranslations } from "next-intl";

// type NavbarProps = {
//   scrollToArticles: () => void;
// };

// export default function Navbar({ scrollToArticles }: NavbarProps) {
//   const t = useTranslations("navbar");
//   const [currentLocale, setCurrentLocale] = React.useState("en");

//   React.useEffect(() => {
//     const storedLocale = localStorage.getItem("locale");
//     if (storedLocale) {
//       setCurrentLocale(storedLocale);
//     }
//   }, []);

//   const setLanguage = (locale: string) => {
//     localStorage.setItem("locale", locale);
//     window.location.reload();
//   };

//   return (
//     <header className="w-full shadow-sm bg-[#1A2C50]">
//       <div className="mx-auto flex items-center justify-between pr-7">
//         <div className="bg-white flex items-center justify-center">
//           <Image
//             src="/compass-point-assist-logo.png"
//             alt="Company Logo"
//             width={300}
//             height={300}
//             className="rounded-md py-2 px-2"
//           />
//         </div>

//         <div className="flex items-center justify-between flex-grow">
//           <div className="ml-6">
//             <Button
//               variant="ghost"
//               className="text-xl font-semibold font-monteserrat text-[#ECCBAE]"
//               onClick={scrollToArticles}
//             >
//               {t("articles")}
//             </Button>
//           </div>

//           <div className="flex items-center text-md text-[#ECCBAE] space-x-4 mr-5">
//             <button
//               onClick={() => setLanguage("en")}
//               className={`text-xl font-semibold font-monteserrat transition-all duration-200 ${
//                 currentLocale === "en" ? "opacity-50" : "opacity-100"
//               }`}
//             >
//               {t("language.en")}
//             </button>

//             <div className="w-[3px] h-4 bg-[#ECCBAE] mx-4" />


//             <button
//               onClick={() => setLanguage("de")}
//               className={`text-xl font-semibold font-monteserrat transition-all duration-200 ${
//                 currentLocale === "de" ? "opacity-50" : "opacity-100"
//               }`}
//             >
//               {t("language.de")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type NavbarProps = {
  scrollToArticles: () => void;
};

export default function Navbar({ scrollToArticles }: NavbarProps) {
  const t = useTranslations("navbar");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale") || "en";
    setLocale(stored);
  }, []);

  const changeLanguage = async (lang: string) => {
    localStorage.setItem("locale", lang);
    window.location.reload(); 
  };

  return (
    <header className="w-full shadow-sm bg-[#1A2C50]">
      <div className="mx-auto flex items-center justify-between pr-7">
        <div className="bg-white flex items-center justify-center">
          <Image
            src="/compass-point-assist-logo.png"
            alt="Company Logo"
            width={300}
            height={300}
            className="rounded-md py-2 px-2"
          />
        </div>

        <div className="flex items-center justify-between flex-grow">
          <div className="ml-8">
            <button
              
              className="text-xl font-semibold font-monteserrat text-[#ECCBAE]"
              onClick={scrollToArticles}
            >
              {t("articles")}
            </button>
          </div>

          <div className="flex items-center text-md text-[#ECCBAE] space-x-4 mr-5">
            <button
              onClick={() => changeLanguage("en")}
              className={`text-xl font-semibold font-monteserrat transition-all duration-200 ${
                locale === "en" ? "opacity-50" : "opacity-100"
              }`}
            >
              {t("language.en")}
            </button>

            <div className="w-[3px] h-4 bg-[#ECCBAE] mx-4" />

            <button
              onClick={() => changeLanguage("de")}
              className={`text-xl font-semibold font-monteserrat transition-all duration-200 ${
                locale === "de" ? "opacity-50" : "opacity-100"
              }`}
            >
              {t("language.de")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
