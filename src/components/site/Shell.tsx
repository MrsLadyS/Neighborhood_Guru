import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}
