// components/FeatureTable.tsx
"use client";

import { useEffect, useState } from "react";
import Papa from 'papaparse';

export default function FeatureTable({ feature_url }: { feature_url: string }) {
  const [features, setFeatures] = useState<any[]>([]);
  const [fields, setFields] = useState<{ name: string; alias: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        // Carregamento dinâmico do módulo FeatureLayer
        const { default: FeatureLayer } = await import("@arcgis/core/layers/FeatureLayer");

        const layer = new FeatureLayer({
          url: feature_url
        });

        // Consulta os dados
        const response = await layer.queryFeatures({
          where: "1=1",
          outFields: ["*"],
          returnGeometry: false
        });

        setFields(response.fields.map(f => ({
          name: f.name,
          alias: f.alias || f.name
        })));
        setFeatures(response.features.map(f => f.attributes));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const exportToCSV = () => {
    const csv = Papa.unparse(features);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'municipios_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Paginação
  const totalPages = Math.ceil(features.length / rowsPerPage);
  const paginatedFeatures = features.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoading) {
    return <div className="p-4">Carregando dados...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Dados dos Municípios</h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {fields.map((field) => (
                <th key={field.name} className="border border-gray-300 p-2 text-left">
                  {field.alias}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedFeatures.map((feature, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {fields.map((field) => (
                  <td key={field.name} className="border border-gray-300 p-2">
                    {feature[field.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Mostrando {((page - 1) * rowsPerPage) + 1} a {Math.min(page * rowsPerPage, features.length)} de {features.length} registros
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}