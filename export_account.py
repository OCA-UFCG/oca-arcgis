from arcgis.gis import GIS
from pathlib import Path, PurePath
from zipfile import ZipFile

# https://developers.arcgis.com/python/latest/guide/tutorials/download-data/
# https://support.esri.com/en-us/knowledge-base/how-to-download-arcgis-online-hosted-feature-layers-as--000027904

# Conectar ao ArcGIS Online
gis = GIS("https://www.arcgis.com", "yyy", "xxxx")
print("Connected.")

def downloadUserItems(owner, downloadFormat):
    try:
        # Search items by username
        items = gis.content.search(query='owner:xxx', item_type='Feature Service')
        print(items)
        # Loop through each item and if equal to Feature Service then download it
        for item in items:
            if item.type == 'Feature Service': #Feature Service is selected, since the source for Feature Layer (Hosted) type item is Feature Service
                result = item.export(item.title, downloadFormat)
                #Set the download path for the ZIP files
                data_path = Path(r'<Download_Folder_Path')
                result.download(save_path=data_path)
                #Create a new ZIP file path, new folder with the same name, and extract the ZIP files items into respective folders
                zip_path = data_path.joinpath(result.title + '.zip')
                extract_path = data_path.joinpath(result.title)
                if not extract_path.exists():
                    extract_path.mkdir()
                with ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_path)
                # Delete the item after it downloads to save on space - Optional
                result.delete()
    except Exception as e:
        print(e)

downloadUserItems('sudene_mapas', downloadFormat='Shapefile') 
print("All items downloaded")
