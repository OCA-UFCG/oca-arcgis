import React, { useEffect, useState } from 'react';

interface FeatureSelectorProps {
  baseUrl: string;
  onLayerSelect: (url: string) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ baseUrl, onLayerSelect }) => {
  const [layers, setLayers] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}?f=json`);
        const data = await response.json();
        
        if (data.services) {
          setLayers(data.services);
        } else {
          setError('Não foi possível encontrar as layers');
        }
      } catch (err) {
        setError('Erro ao carregar as layers');
      } finally {
        setLoading(false);
      }
    };

    fetchLayers();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <select 
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        onChange={(e) => onLayerSelect(`${baseUrl}/${e.target.value}/FeatureServer`)}
      >
        <option value="">Selecione uma layer</option>
        {layers.map((layer) => (
          <option key={layer.name} value={layer.name}>
            {layer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FeatureSelector;