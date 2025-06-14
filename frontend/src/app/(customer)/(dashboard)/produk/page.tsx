import { Suspense } from 'react';
import ProdukClientPage from './ProdukClientPage';

export default function ProdukPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProdukClientPage />
    </Suspense>
  );
}
