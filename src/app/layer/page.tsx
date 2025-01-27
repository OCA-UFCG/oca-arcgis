"use client";

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('@/src/components/FeatureLayer'),
  {
    ssr: false,
    loading: () => <div>Carregando mapa...</div>
  }
);

export default function LayerPage() {
  const searchParams = useSearchParams();
  const layerUrl = searchParams.get('url');

  if (!layerUrl) {
    return <div className="p-4">Nenhuma layer selecionada</div>;
  }

  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <DynamicMap feature_url={layerUrl} />
    </main>
  );
}
