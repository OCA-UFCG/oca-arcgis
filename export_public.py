from arcgis.gis import GIS
from pathlib import Path, PurePath
from zipfile import ZipFile

# https://developers.arcgis.com/python/latest/guide/tutorials/download-data/
# https://support.esri.com/en-us/knowledge-base/how-to-download-arcgis-online-hosted-feature-layers-as--000027904

# Conectar ao ArcGIS Online
gis = GIS()
print("Connected.")

def downloadItems(item_id):
    try:
        item = gis.content.get(item_id)
        
        data_path = Path('./public')
        if not data_path.exists():
            data_path.mkdir()

        zip_path = data_path.joinpath(item_id + '.zip')

        item.download(save_path=data_path, file_name=f'{item_id}.zip')

        zip_file = ZipFile(zip_path)
        zip_file.extractall(path=data_path)
        zip_file.close()
    except Exception as e:
        raise(e)

# Use: 
downloadItems('a04933c045714492bda6886f355416f2')
print("All items downloaded")
