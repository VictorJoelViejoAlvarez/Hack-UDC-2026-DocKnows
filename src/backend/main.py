import uvicorn
from fastapi import FastAPI
from routers.routers import router
from BD.connection import Base, engine
from services.Docker import levantar_elasticsearch

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recuperacion de informacion con RAG")

app.include_router(router, prefix="")
levantar_elasticsearch()

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
