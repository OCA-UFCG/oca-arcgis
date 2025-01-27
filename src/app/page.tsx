"use client";

import { useState } from 'react';
import FeatureSelector from '@/src/components/FeatureSelector';
import Papa from 'papaparse';

export default function Home() {
  const [selectedLayer, setSelectedLayer] = useState('');
  const baseUrl = "https://services6.arcgis.com/uaRkpyZiQH3wzm7O/ArcGIS/rest/services";

  const exportToCSV = async () => {
    try {
      const { default: FeatureLayer } = await import("@arcgis/core/layers/FeatureLayer");

      const layer = new FeatureLayer({
        url: selectedLayer
      });

      const response = await layer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: false
      });

      const features = response.features.map(f => f.attributes);
      const csv = Papa.unparse(features);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'municipios_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      alert("Erro ao exportar dados. Por favor, tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Visualizador de Features
          </h1>

          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <FeatureSelector
              baseUrl={baseUrl}
              onLayerSelect={setSelectedLayer}
            />
          </div>

          <ul className="w-full max-w-md list-none space-y-4">
            <li>
              <a
                href={`/layer?url=${encodeURIComponent(selectedLayer)}`}
                className={`block w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center ${!selectedLayer && 'opacity-50 cursor-not-allowed'}`}
                onClick={(e) => {
                  if (!selectedLayer) e.preventDefault();
                }}
              >
                Visualizar no Mapa
              </a>
            </li>
            <li>
              <a
                href={`/table?url=${encodeURIComponent(selectedLayer)}`}
                className={`block w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center ${!selectedLayer && 'opacity-50 cursor-not-allowed'}`}
                onClick={(e) => {
                  if (!selectedLayer) e.preventDefault();
                }}
              >
                Visualizar em Tabela
              </a>
            </li>
            <li>
              <button
                onClick={exportToCSV}
                disabled={!selectedLayer}
                className={`block w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center ${!selectedLayer && 'opacity-50 cursor-not-allowed'}`}
              >
                Exportar Feature
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}