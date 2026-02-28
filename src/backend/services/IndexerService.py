from elasticsearch import Elasticsearch, exceptions
from models.DocumentsC import DocumentsC
from Auxiliary.auxiliary import extract_text_from_html
import os


class IndexerService:

    def __init__(self, es_host="http://localhost:9200", index_name="documentos"):
        self.es = Elasticsearch(es_host)
        self.index_name = index_name
        # Crear el índice si no existe
        if not self.es.indices.exists(index=self.index_name):
            self.es.indices.create(index=self.index_name)



    def index_document(self, document: DocumentsC):

        if not document.path_name or not os.path.exists(document.path_name):
            print(f"Documento {document.document_id} no tiene ruta válida.")
            return False

        body = {
            "document_id": document.document_id,
            "content": extract_text_from_html(document.path_name)
        }

        try:
            response = self.es.index(
                index=self.index_name,
                id=document.document_id,
                document=body
            )

            return response.get("result") in ("created", "updated")

        except exceptions.ElasticsearchException as e:
            raise RuntimeError(f"Error al indexar documento: {e}")

    def search(self, query: str, size: int = 1):
        try:
            response = self.es.search(
                index=self.index_name, size=size, query={"match": {"content": query}}
            )
            document_ids = [hit["_id"] for hit in response["hits"]["hits"]]
            return document_ids

        except exceptions.ElasticsearchException as e:
            raise RuntimeError(f"Error en la búsqueda: {e}")
        


    def get_index_status(self):
        try:
            # Obtener estado del cluster y del índice
            health = self.es.cluster.health(index=self.index_name)
            count = self.es.count(index=self.index_name)

            return {
                "status": health.get("status"),                 # verde, amarillo, rojo
                "number_of_nodes": health.get("number_of_nodes"),
                "active_primary_shards": health.get("active_primary_shards"),
                "active_shards": health.get("active_shards"),
                "number_of_documents": count.get("count")
            }

        except exceptions.ElasticsearchException as e:
            raise RuntimeError(f"Error al obtener el estado del índice: {e}")