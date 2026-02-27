import { createContext, useContext, useState, ReactNode } from 'react';

interface QuotationContextType {
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const QuotationContext = createContext<QuotationContextType>({
  isOpen: false,
  openPanel: () => {},
  closePanel: () => {},
  togglePanel: () => {},
});

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen((prev) => !prev);

  return (
    <QuotationContext.Provider value={{ isOpen, openPanel, closePanel, togglePanel }}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  return useContext(QuotationContext);
}
