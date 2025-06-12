// import type { Metadata } from "next";
// import { Montserrat } from "next/font/google";
// import "./globals.css";
// import { cn } from "@/lib/utils";
// import ClientLayout from "./ClientLayout";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Compass Point Assist",
//   description: "Insurance safety for conflict and risk zones",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={cn(
//           "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
//           montserrat.variable
//         )}
//       >
//         <ClientLayout>{children}</ClientLayout>
//       </body>
//     </html>
//   );
// }



// import type { Metadata } from "next";
// import { Montserrat } from "next/font/google";
// import "./globals.css";
// import { cn } from "@/lib/utils";
// import ClientLayout from "./ClientLayout";
// import IntlProvider from "./providers/intl-provider";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Compass Point Assist",
//   description: "Insurance safety for conflict and risk zones",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={cn(
//           "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
//           montserrat.variable
//         )}
//       >
//         <IntlProvider>
//           <ClientLayout>{children}</ClientLayout>
//         </IntlProvider>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import "./globals.css";
import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import IntlProviderWrapper from "./providers/intl-provider";
import ClientLayout from "./ClientLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Compass Point Assist",
  description: "Insurance safety for conflict and risk zones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} min-h-screen font-sans antialiased`}>
        <IntlProviderWrapper>
          <ClientLayout>{children}</ClientLayout>
        </IntlProviderWrapper>
      </body>
    </html>
  );
}
