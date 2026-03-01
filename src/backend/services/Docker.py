import docker
import time
from elasticsearch import Elasticsearch


def levantar_elasticsearch():
    client = docker.from_env()

    try:
        container = client.containers.get("elasticsearch")

        if container.status != "running":
            print("Iniciando contenedor existente...")
            container.start()
        else:
            print("Elasticsearch ya está corriendo.")

    except docker.errors.NotFound:
        print("Creando y levantando Elasticsearch...")

        client.containers.run(
            "docker.elastic.co/elasticsearch/elasticsearch:8.12.0",
            name="elasticsearch",
            ports={"9200/tcp": 9200, "9300/tcp": 9300},
            environment={
                "discovery.type": "single-node",
                "xpack.security.enabled": "false",
                "xpack.security.http.ssl.enabled": "false",
                "ES_JAVA_OPTS": "-Xms512m -Xmx512m"
            },
            mem_limit="1g",
            detach=True,
        )

    # Esperar a que Elasticsearch esté realmente listo
    print("Esperando a que Elasticsearch esté disponible...")

    es = Elasticsearch("http://localhost:9200")

    for i in range(30):  # hasta 30 intentos (~30 segundos)
        if es.ping():
            print("Conexión a Elasticsearch OK")
            return es
        time.sleep(1)

    raise RuntimeError("No se pudo conectar a Elasticsearch después de varios intentos")
