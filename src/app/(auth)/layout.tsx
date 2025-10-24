import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre com sua conta",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-backgroundSecondary">{children}</div>;
}
