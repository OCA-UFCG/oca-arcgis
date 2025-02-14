"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FeatureTable from '@/src/components/FeatureTable';

// Separate component to handle the search params
function TableContent() {
  const searchParams = useSearchParams();
  const layerUrl = searchParams.get('url');

  if (!layerUrl) {
    return <div className="p-4 text-gray-600">Nenhuma layer selecionada</div>;
  }

  return <FeatureTable feature_url={layerUrl} />;
}

// Main page component with Suspense boundary
export default function TablePage() {
  return (
    <main className="container mx-auto p-4">
      <Suspense fallback={<div className="p-4 text-gray-600">Carregando...</div>}>
        <TableContent />
      </Suspense>
    </main>
  );
}