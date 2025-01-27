"use client";

import { useEffect, useState } from "react";

interface Field {
  name: string;
  alias: string;
}

export default function FeatureTable({ feature_url }: { feature_url: string }) {
  const [features, setFeatures] = useState<any[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setIsLoading(true);
        const { default: FeatureLayer } = await import("@arcgis/core/layers/FeatureLayer");

        const layer = new FeatureLayer({
          url: feature_url
        });

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
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, [feature_url]);

  const totalPages = Math.ceil(features.length / rowsPerPage);
  const paginatedFeatures = features.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Dados dos Municípios</h2>
        </div>

        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {fields.map((field) => (
                    <th
                      key={field.name}
                      scope="col"
                      className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]"
                    >
                      {field.alias}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedFeatures.map((feature, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {fields.map((field) => (
                      <td
                        key={field.name}
                        className="px-8 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[200px]"
                      >
                        {feature[field.name] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Mostrando {((page - 1) * rowsPerPage) + 1} a {Math.min(page * rowsPerPage, features.length)} de {features.length} registros
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}