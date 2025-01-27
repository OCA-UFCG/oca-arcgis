// app/page.tsx
"use client";

import dynamic from 'next/dynamic';

// Importação dinâmica do componente do mapa
const DynamicMap = dynamic(
  () => import('@/src/components/FeatureLayer'),
  {
    ssr: false,
    loading: () => <div>Carregando mapa...</div>
  }
);

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <DynamicMap />
    </main>
  );
}