import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({
  children,
}: StoreLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
}