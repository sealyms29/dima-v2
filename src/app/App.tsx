import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QuotationProvider } from './QuotationContext';
import { QuotationPanel } from './components/QuotationPanel';

export default function App() {
  return (
    <QuotationProvider>
      <QuotationPanel />
      <RouterProvider router={router} />
    </QuotationProvider>
  );
}