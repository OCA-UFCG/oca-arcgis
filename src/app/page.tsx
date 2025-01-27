"use client";

import { useState } from 'react';
import FeatureSelector from '@/src/components/FeatureSelector';

export default function Home() {
  const [selectedLayer, setSelectedLayer] = useState('');
  const baseUrl = "https://services6.arcgis.com/uaRkpyZiQH3wzm7O/ArcGIS/rest/services";

  return (
    <main className="container mx-auto py-8">
      <FeatureSelector 
        baseUrl={baseUrl}
        onLayerSelect={setSelectedLayer}
      />
      
      <ul className="flex justify-center flex-col items-center mt-8">
        <li className="m-4">
          <a 
            href={`/layer?url=${encodeURIComponent(selectedLayer)}`} 
            className={`p-4 bg-blue-500 text-white rounded ${!selectedLayer && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => {
              if (!selectedLayer) e.preventDefault();
            }}
          >
            Mapa
          </a>
        </li>
        <li className="m-4">
          <a 
            href={`/table?url=${encodeURIComponent(selectedLayer)}`} 
            className={`p-4 bg-blue-500 text-white rounded ${!selectedLayer && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => {
              if (!selectedLayer) e.preventDefault();
            }}
          >
            Tabela
          </a>
        </li>
      </ul>
    </main>
  );
}