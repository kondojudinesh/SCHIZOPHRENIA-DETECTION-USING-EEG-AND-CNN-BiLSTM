import os
import shutil
from fastapi import UploadFile

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    """
    Save an uploaded EEG file to the destination folder.
    Returns the saved file path.
    """
    os.makedirs(destination, exist_ok=True)
    file_path = os.path.join(destination, upload_file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return file_path
