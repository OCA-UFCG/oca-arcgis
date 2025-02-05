import os
import json
import geopandas as gpd

from pathlib import Path
from arcgis.gis import GIS
from zipfile import ZipFile
from dotenv import load_dotenv
from arcgis.features import FeatureLayer

# https://developers.arcgis.com/python/latest/guide/tutorials/download-data/
# https://support.esri.com/en-us/knowledge-base/how-to-download-arcgis-online-hosted-feature-layers-as--000027904

def process_webmap_layers(webmap_data, webmap_dir):
    results = []
    
    for j, layer in enumerate(webmap_data.get('operationalLayers', [])):
        try:
            url = layer.get('url')            
            if url:
                print(f"Processando layer: {layer.get('title')}")

                feature_layer = FeatureLayer(url)
                features = feature_layer.query(where="1=1", out_fields="*", return_geometry=True)
                
                if features:
                    geojson_data = features.to_geojson
                    geojson_dict = json.loads(str(geojson_data))
                    gdf = gpd.GeoDataFrame.from_features(geojson_dict)

                    output_name = f"{j}_{layer.get('title', 'layer').replace(' ', '_')}"
                    output_shp = webmap_dir.joinpath(f"{output_name}.shp")
                    gdf.to_file(output_shp)
                    print(f"Exportado como Shapefile: {output_shp}") 
            else:
                print(f"Layer não tem URL: {layer.get('title')}")
                
        except Exception as layer_error:
            print(f"Erro ao processar layer {j}: {str(layer_error)}")
            continue
    
    return results

def downloadItems(items):
    try:
        for i, item in enumerate(items):
            print(f"{i}. {item}")

            if item.type == 'Web Map':
                webmap_data = item.get_data()
                print(f"\nProcessando Web Map: {item.title}")

                webmap_dir = OUTPUT.joinpath(f'{i}_{item.title}')
                webmap_dir.mkdir(exist_ok=True)
        
                process_webmap_layers(webmap_data, webmap_dir)
                  
            # else:
            #     zip_path = OUTPUT.joinpath(f'{i}.zip')
            #     item.download(save_path=OUTPUT, file_name=f'{i}.zip')

            #     zip_file = ZipFile(zip_path)
            #     zip_file.extractall(path=OUTPUT)
            #     zip_file.close()
                break

    except Exception as e:
        raise(e)

def describeItems(items):
    items_types = set([item.type for item in items])

    print(gis.properties.user.username)
    print(f"Quantidade de items: {len(items)}")
    print(f"Tipos de items: {items_types}")    

# MACROS: 
load_dotenv('./.env')
OWNER = os.getenv('ITEMS_OWNER')
USER = os.getenv('ARC_USER')
PASSWORD = os.getenv('ARC_PASSWORD')

OUTPUT = Path('./private')
if not OUTPUT.exists(): OUTPUT.mkdir()

# RUN
gis = GIS("https://www.arcgis.com", USER, PASSWORD)
items = gis.content.search(query=f'owner:{OWNER}', max_items=10000)
describeItems(items) 
downloadItems(items)
print("Process completed.")
