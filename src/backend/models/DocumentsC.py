from sqlalchemy import Column, Integer, String
from BD.connection import Base


class DocumentsC(Base):
    __tablename__ = "documents"

    # Campos de la tabla
    document_id = Column(Integer, primary_key=True, autoincrement=True)
    path_name = Column(String, nullable=False)

    def __init__(self, path_name: str, document_id: int = None):
        self.document_id = document_id
        self.path_name = path_name
