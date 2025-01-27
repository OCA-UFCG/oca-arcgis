"use client";

import { useSearchParams } from 'next/navigation';
import FeatureTable from '@/src/components/FeatureTable';

export default function TablePage() {
  const searchParams = useSearchParams();
  const layerUrl = searchParams.get('url');

  if (!layerUrl) {
    return <div className="p-4">Nenhuma layer selecionada</div>;
  }

  return (
    <main className="container mx-auto">
      <FeatureTable feature_url={layerUrl} />
    </main>
  );
}