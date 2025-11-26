import os
from fastapi import UploadFile

async def save_upload_file(upload_file: UploadFile, dest_folder: str) -> str:
    """Save an UploadFile to disk and return path."""
    os.makedirs(dest_folder, exist_ok=True)
    dest_path = os.path.join(dest_folder, upload_file.filename)

    base, ext = os.path.splitext(dest_path)
    counter = 1
    while os.path.exists(dest_path):
        dest_path = f"{base}_{counter}{ext}"
        counter += 1

    with open(dest_path, "wb") as buffer:
        buffer.write(await upload_file.read())

    return dest_path
