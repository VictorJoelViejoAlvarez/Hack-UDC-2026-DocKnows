import docker
import time
from elasticsearch import Elasticsearch

def levantar_elasticsearch():
    client = docker.from_env()
    try:
        # Verificar si ya existe el contenedor
        container = client.containers.get("elasticsearch")
        if container.status != "running":
            container.start()
            print("Elasticsearch levantado.")
    except docker.errors.NotFound:
        # Crear y levantar el contenedor si no existe
        print("Creando y levantando Elasticsearch...")
        client.containers.run(
            "docker.elastic.co/elasticsearch/elasticsearch:8.12.0",
            name="elasticsearch",
            ports={'9200/tcp': 9200, '9300/tcp': 9300},
            environment={"discovery.type": "single-node"},
            detach=True
        )
        time.sleep(10)  # espera a que el nodo esté listo

    # Verificar conexión
    es = Elasticsearch("http://localhost:9200")
    if es.ping():
        print("Conexión a Elasticsearch OK")
    else:
        raise RuntimeError("No se pudo conectar a Elasticsearch")

