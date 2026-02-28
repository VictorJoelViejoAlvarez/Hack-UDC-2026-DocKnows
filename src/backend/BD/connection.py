from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base  # sqlite
import os

# Ruta de la base de datos
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Motor de conexión a la BD
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # Necesario para SQLite
)

# Fábrica de sesiones
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)  # Transacciones manuales sin flush automático

# Clase base para todos los modelos
Base = declarative_base()
