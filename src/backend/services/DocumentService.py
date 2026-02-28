import pypandoc
import os
from pdfminer.high_level import extract_text
from Daos.DocumentCDAO import DocumentCDAO
from models.DocumentsC import DocumentsC
from services.IndexerService import IndexerService

from fastapi import UploadFile
import shutil


class DocumentoService:

    def __init__(self):
        self.dao = DocumentCDAO()

    def convertir_a_html(self, file: UploadFile) -> str:
            
            BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            TEMP_DIR = os.path.join(BASE_DIR, "temp_files")
            OUTPUT_DIR = os.path.join(BASE_DIR, "output_html")
            os.makedirs(TEMP_DIR, exist_ok=True)
            os.makedirs(OUTPUT_DIR, exist_ok=True)

            temp_path = os.path.join(TEMP_DIR, file.filename)
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            extension = file.filename.lower().split(".")[-1]
            html_filename = os.path.splitext(file.filename)[0] + ".html"
            html_path = os.path.join(OUTPUT_DIR, html_filename)

            try:
                if extension == "pdf":
                    # Procesar PDF con pdfminer
                    text = extract_text(temp_path)
                    with open(html_path, "w", encoding="utf-8") as f:
                        f.write(f"<pre>{text}</pre>")
                elif extension in ["docx", "odt", "md", "txt"]:
                    # Comprobar si Pandoc está disponible
                    try:
                        pypandoc.get_pandoc_version()
                    except OSError:
                        # Descargar Pandoc si no está
                        pypandoc.download_pandoc()
                    # Convertir archivo a HTML
                    pypandoc.convert_file(temp_path, 'html', outputfile=html_path)
                else:
                    raise ValueError(f"Extensión no soportada: {extension}")
            except Exception as e:
                raise ValueError(f"Error al convertir a HTML: {e}")
            finally:
                file.file.close()
                os.remove(temp_path)

            return html_path

    def insertar_documento(self, file: UploadFile):
        documento_html = self.convertir_a_html(file)
        documento = self.dao.create(documento_html)
        indexer = IndexerService()
        indexer.index_document(documento)

    def insertar_documentos(self, files: list[UploadFile]):
        for file in files:
            self.insertar_documento(file)
