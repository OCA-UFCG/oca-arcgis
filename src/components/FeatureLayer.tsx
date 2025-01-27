// components/FeatureLayer.tsx
"use client";

import { useEffect, useRef } from "react";

const FeatureLayer = ({ feature_url }: { feature_url: string }) => {
  const mapDiv = useRef(null);

  useEffect(() => {
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

        const map = new Map({
          basemap: "streets-vector"
        });

        const view = new MapView({
          container: mapDiv.current || undefined,
          map: map,
          zoom: 4,
          center: [-51.9253, -14.2350]
        });

        const municipiosLayer = new FeatureLayer({
          url: feature_url,
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

        map.add(municipiosLayer);

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
    <div className="relative">
      <div ref={mapDiv} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default FeatureLayer;