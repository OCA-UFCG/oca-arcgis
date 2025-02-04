from arcgis.gis import GIS
from pathlib import Path, PurePath
from zipfile import ZipFile

# https://developers.arcgis.com/python/latest/guide/tutorials/download-data/
# https://support.esri.com/en-us/knowledge-base/how-to-download-arcgis-online-hosted-feature-layers-as--000027904

# Conectar ao ArcGIS Online
gis = GIS("https://www.arcgis.com", "yyy", "xxxx")
print("Connected.")

def downloadSharedItem(item_id, downloadFormat):
    try:
        item = gis.content.get(item_id)
        result = item.export(item.title, downloadFormat)
        data_path = Path(r'<Download_Folder_Path>')
        result.download(save_path=data_path)
        
        zip_path = data_path.joinpath(result.title + '.zip')
        extract_path = data_path.joinpath(result.title)
        if not extract_path.exists():
            extract_path.mkdir()
        with ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
            
        result.delete()
    except Exception as e:
        print(e)

# Use: 
downloadSharedItem('zzzzzz', downloadFormat='Shapefile')
print("All items downloaded")
