# 📘 Documentación del Proyecto

## 1. 📌 Visión General

### 1.1 Descripción

    Plataforma para buscar, localizar y entender documentación corporativa de forma rapida y eficiente.

### 1.2 Objetivos

- Importar y subir documentos en formatos docx, odt, md, txt o pdf
- Buscar la información usando keywords, etiquetas, categorías y coincidencias en el contenido
- Mostrar los metadatos relevantes de cada documento
- Navegar los resultados de forma clara aplicando filtros y opciones de ordenación

### 1.3 Arquitectura

**Tipo de arquitectura:** **Arquitectura en Capas (Layered Architecture) de 3 niveles**

El proyecto implementa una arquitectura en capas clásica con **separación clara de responsabilidades**. Las capas están organizadas de la siguiente manera:

<img src="./DiagramaMermaid1.svg" alt="Diagrama de relaciones" width="600">

**Patrones de diseño utilizados:**

1. **DAO (Data Access Object):** `DocumentCDAO` encapsula toda la logica de acceso a datos
2. **Service Layer Pattern:** Los servicios (`DocumentService`, `IndexerService`) contienen la lógica de negocio
3. **MVC (Model-View-Controller):** Model (DocumentsC) - View (Frontend React) - Controller (Routers + Services)

### 1.4 Tecnologías Utilizadas

- **Frontend:** React, Node.js y JavaScript
- **Backend:** Python, Python-dotenv, Lxml, Beautifulsoup4, Fastapi y Uvicorn
- **Base de Datos:** Alembic, SQLite 3, SQLAlchemy
- **Búsqueda:** Elasticsearch y Llama-cpp-python
- **Procesado:** PDFMiner y Pypandoc

## 2. Frontend

### 2.1 Componentes

### 2.2 Comunicación con el backend

## 3. Backend

### 3.1 Componentes

#### 3.1.1 Main (`src/backend/main.py`)

- Tras importar las librerías correspondientes (uvicorn, FastAPI, router, Base, engine) crea tablas en la base de datos y revisa los modelos que hereden de Base para saber cuando debe crearlas (si ya existen, no influye en nada). Acto seguido, crea la aplicación con FastAPI, y añade a la misma todas las routas. Finalmente, Uvicorn levanta dicho servidor y empieza a ser funcional, listo para recibir peticiones HTTP.

#### 3.1.2 DocumentCDAO (`src/backend/Daos/DocumentCDAO.py`)

Este es el DAO para el modelo DocumentsC, que realiza operaciones CRUD en la base de datos.

- Inicializamos la base de datos con init, creando una sesión nueva en cada instancia del DAO.
- El uso de las funciones de la libreria SQLAlchemy nos permite cumplir los principios ACID:
  - Atomicity: Todo o nada en cada transacción.
  - Consistency: La BD siempre queda en estado consistente.
  - Isolation: Las transacciones no se interfieren.
  - Durability: Los commits son permanentes.

Entre las operaciones que contiene, destacamos:
  
##### 3.1.2.1 ```Close```

- Operación CRUD empleada para cerrar sesión.

##### 3.1.2.1```get_by_id```

- Método de lectura para obtener el primer documento que coincida con una id determinada.

##### 3.1.2.1```get_by_path```

- Idem pero a través de un path.

##### 3.1.2.1```get_all```

- Idem, pero todos los documentos.

##### 3.1.2.1```create```

- Crea un documento y posteriormente lo guarda en la BD (inserta el registro, genera un ```document_id``` y guarda los cambios en la BD: si algo va mal, lanza una excepción). Por último, actualiza ese objeto en memoria con ```refresh()```.

##### 3.1.2.1```update```

- Si no encuentra un documento, devuelve None, de lo contrario realiza los comandos commit() y refresh().

##### 3.1.2.1```delete```

- Busca un elemento en la base de datos: si lo encuentra, devuelve un objeto de tipo DocumentsC, y de lo contrario uno de tipo None. Esta implementación evitamos borrar algo que no existe en la BD.

#### 3.1.3 Auxiliary (`src/backend/Auxiliary/auxiliary.py`)

- ```extract_text_from_html``` se encarga de extraer el texto plano de un HTML, eliminando las etiquetas y preservando solo el contenido textual
- Proceso:
  - Apertura del archivo: Lee el HTML completo en memoria
  - Parsing: BeautifulSoup analiza la estructura HTML
  - Extracción: get_text() elimina todas las etiquetas
  - Separador: Usa \n para mantener saltos de línea entre elementos

#### 3.1.4 Routers (`src/backend/routers/routers.py`)

- Para su correcto funcionamiento, importamos lo siguiente:
  - UploadFile: se usa para manejar los archivos subidos a la base de datos.
  - DocumentoService: la capa de lógica de negocio.
  - APIRouter: Separamos las routas en módulos.
  - AiAnalizer: Devolverá archivos json en base a queries relacionados con los documentos.

- Después, tras crear el contenedor de rutas, implementamos las siguientes opciones:

- POST /routers/documento.
  - El cliente hace un POST, FastAPI lo transforma en un objeto UploadFile, se crea un DocumentoService y se llama a la función de insertar dicho documento, devolviendo el JSON.
- POST /routers/documentos.
  - Realiza lo mismo que la ruta anterior, pero con diferentes documentos en vez de sólo uno.
- GET  /routers/analyze.
  - Tras llamar al AIAnalizer para que analice la query, devuelve la respuesta JSON correspondiente.

#### 3.1.5 DocumentService (`src/backend/services/DocumentService.py`)

- Se encarga de recibir archivos de tipo ```UploadFile```, y tras convertirlos a HTML los guarda en la base de datos para finalmente enviarlos al RAG.

#### 3.1.6 IndexerService (`src/backend/services/IndexerService.py`)

- Realiza los siguientes pasos:
  - Se conecta a ElasticSearch (un motor de búsqueda y analíticas distribuido open-source desarrollado para aplicaciones de velocidad, escalabilidad y AI), creando los índices necesarios en caso de que no existan.
  - Indexa dichos documentos manejando casos de error.
  - También contiene el método Search, que recibe un texto y lo busca en ElasticSearch mediante el identificador _id.

#### 3.1.7 AiAnalizer (`src/backend/services/AiAnalizer.py`)

### 3.2 Diagrama de relaciones

<img src="./DiagramaMermaid2.svg" alt="Diagrama de relaciones" width="600">

## 4. Base de Datos

### 4.1 Tecnología y Configuración

- **Motor:** SQLite 3
- 2**ORM:** SQLAlchemy

### 4.2 Componentes

#### 4.2.1 Models (DocumentsC) (`src/backend/models/DocumentsC.py`)

- **Document_id:** tipo integer, clave primaria autoincremental, es el identificador único del documento
- **Path_name:** tipo varchar, no puede ser NULL, es la ruta del archivo HTML procesado

**Ejemplo de registro:**

```
document_id: 1
path_name: "/ruta/output_html/documento_convertido.html"
```

#### 4.2.2 Connection.py (`src/backend/BD/connection.py`)

- **Engine:** motor de conexion a SQLite, se usa unicamente al inicio para establecer conexión
- **SessionLocal:** es el factory para crear sesiones BD, cada DAO crea su propia sesión (con el autoflush seteado en False evitamos que se envien los cambios en la base e datos y con el autocommit seteado en False evitamos que se confirmen los cambios en la base de datos de forma automática)
- **Base:** es la clase base para modelos ORM, todos los modelos heredan de esta (lo seteamos a declarative_base)
- **check_same_thread: False:** lo seteamos de esta forma para pooder usar la base de datos en multiples threads (nos lo requiere FastAPI(async))
