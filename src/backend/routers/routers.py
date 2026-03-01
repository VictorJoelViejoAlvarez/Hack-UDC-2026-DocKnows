from fastapi import UploadFile, File
from services.DocumentService import DocumentoService
from fastapi import APIRouter
from services.AiAnalizer import AiAnalizer
from services.IndexerService import IndexerService

router = APIRouter()


# Subir un solo archivo
@router.post("/documento")
async def añadir_documento(file: UploadFile = File(...)):

    service = DocumentoService()
    indexer = IndexerService()

    try:

        html_path = service.convertir_a_html(file)

        document = service.dao.create(html_path)

        success = indexer.index_document(document)

        index_status = indexer.get_index_status()

        return {
            "status": "ok" if success else "failed",
            "document_id": document.document_id,
            "path": document.path_name,
            "indexed": success,
            "index_status": index_status,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.post("/documentos")
async def añadir_documentos(files: list[UploadFile] = File(...)):

    service = DocumentoService()
    indexer = IndexerService()
    results = []

    for file in files:
        try:
            html_path = service.convertir_a_html(file)
            document = service.dao.create(html_path)
            success = indexer.index_document(document)

            results.append(
                {
                    "filename": file.filename,
                    "document_id": document.document_id,
                    "indexed": success,
                }
            )

        except Exception as e:
            results.append({"filename": file.filename, "error": str(e)})

    return {"status": "ok", "results": results}


@router.get("/analyze")
def analyze_documents(query: str):

    try:
        analizer = AiAnalizer()
        summary, interest, sources = analizer.realizarQuery(query)

        return {
            "status": "ok",
            "answer": summary,
            "interest": interest,
            "bibliography": sources
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
