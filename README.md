# Hack-UDC-2026
Repositorio con el proyecto para el Hack UDC 2026 con el proyecto de Merlin Software.


## Levantar Elasticsearch 

Ejecuta este comando en tu terminal para levantar un nodo único de Elasticsearch:

```bash
docker run -d -p 9200:9200 -e "discovery.type=single-node=true" --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:8.12.1

Luego instala el cliente de Elasticsearch  con ip install.