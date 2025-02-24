import { notFound } from "next/navigation";

export default function LayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV !== "development") return notFound();
  return children;
}
