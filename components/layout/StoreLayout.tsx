import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
        {children}
      </main>

      <Footer />
    </div>
  );
}