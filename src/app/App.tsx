import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QuotationProvider } from './QuotationContext';
import { QuotationPanel } from './components/QuotationPanel';
import BlobCursor from './components/BlobCursor';

export default function App() {
  return (
    <QuotationProvider>
      <BlobCursor
        blobType="circle"
        fillColor="#d4af37"
        trailCount={3}
        sizes={[40, 80, 50]}
        innerSizes={[12, 22, 15]}
        innerColor="rgba(255,255,255,0.85)"
        opacities={[0.35, 0.25, 0.3]}
        shadowColor="rgba(212,175,55,0.3)"
        shadowBlur={8}
        shadowOffsetX={0}
        shadowOffsetY={0}
        filterStdDeviation={25}
        useFilter={true}
        fastDuration={0.08}
        slowDuration={0.4}
        zIndex={9999}
      />
      <QuotationPanel />
      <RouterProvider router={router} />
    </QuotationProvider>
  );
}