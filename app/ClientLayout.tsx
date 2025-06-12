"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  const scrollToArticles = () => {
    articleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar scrollToArticles={scrollToArticles} />
      <main className="flex-grow">
        {children}
        <div ref={articleRef} id="articles-anchor" />
      </main>
    </>
  );
}
