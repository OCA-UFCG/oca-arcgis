"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef } from "react";

// Componente que será carregado apenas no cliente
const MapComponent = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    // Importação dinâmica dos módulos ArcGIS
    const loadMap = async () => {
      try {
        const [
          { default: Map },
          { default: MapView },
          { default: FeatureLayer }
        ] = await Promise.all([
          import("@arcgis/core/Map"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/layers/FeatureLayer")
        ]);

        // Criar um novo mapa base
        const map = new Map({
          basemap: "streets-vector"
        });

        // Configurar a visualização do mapa
        const view = new MapView({
          container: mapDiv.current || undefined,
          map: map,
          zoom: 4,
          center: [-51.9253, -14.2350]
        });

        // Criar a feature layer
        const municipiosLayer = new FeatureLayer({
          url: "https://services6.arcgis.com/uaRkpyZiQH3wzm7O/arcgis/rest/services/LIM_PerfilMunicipal_AAS_IBGE2022/FeatureServer",
          outFields: ["*"],
          popupTemplate: {
            title: "{NM_MUN}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "CD_MUN",
                    label: "Código do Município"
                  }
                ]
              }
            ]
          }
        });

        // Adicionar a layer ao mapa
        map.add(municipiosLayer);

        // Consultar os atributos da feature layer
        municipiosLayer.queryFeatures({
          where: "1=1",  // Retorna todas as features
          outFields: ["*"],  // Retorna todos os campos
          returnGeometry: false,  // Não retorna a geometria para economizar dados
          num: 10  // Limita a 10 registros para teste. Remova ou ajuste conforme necessário
        }).then(response => {
          console.log("Campos disponíveis:", response.fields.map(f => f.name));
          console.log("Exemplo de registros:", response.features.map(f => f.attributes));
        }).catch(error => {
          console.error("Erro ao consultar features:", error);
        });

        // Limpeza ao desmontar o componente
        return () => {
          if (view) {
            view.destroy();
          }
        };
      } catch (error) {
        console.error("Erro ao carregar o mapa:", error);
      }
    };

    loadMap();
  }, []);

  return (
    <div ref={mapDiv} style={{ width: "100%", height: "100vh" }} />
  );
};

// Criando uma versão do componente que só carrega no cliente
const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => <div>Carregando mapa...</div>
});

// Componente principal
export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <DynamicMap />
    </main>
  );
}