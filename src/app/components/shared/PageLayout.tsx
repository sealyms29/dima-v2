import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}