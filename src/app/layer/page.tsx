"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('@/src/components/FeatureLayer'),
  {
    ssr: false,
    loading: () => <div className="p-4 text-gray-600">Carregando mapa...</div>
  }
);

// Separate component to handle the search params
function LayerContent() {
  const searchParams = useSearchParams();
  const layerUrl = searchParams.get('url');

  if (!layerUrl) {
    return <div className="p-4 text-gray-600">Nenhuma layer selecionada</div>;
  }

  return <DynamicMap feature_url={layerUrl} />;
}

// Main page component with Suspense boundary
export default function LayerPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-between">
      <Suspense fallback={<div className="p-4 text-gray-600">Carregando...</div>}>
        <LayerContent />
      </Suspense>
    </main>
  );
}