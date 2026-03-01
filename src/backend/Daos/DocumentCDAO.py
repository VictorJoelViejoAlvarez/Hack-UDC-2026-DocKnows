from sqlalchemy.orm import Session
from models.DocumentsC import DocumentsC
from BD.connection import SessionLocal


class DocumentCDAO:
    def __init__(self):
        self.db: Session = SessionLocal()

    def close(self):
        self.db.close()

    def get_by_id(self, document_id: int):
        return (
            self.db.query(DocumentsC)
            .filter(DocumentsC.document_id == document_id)
            .first()
        )

    def get_by_path(self, path_name: str):
        return (
            self.db.query(DocumentsC).filter(DocumentsC.path_name == path_name).first()
        )

    def get_all(self):
        return self.db.query(DocumentsC).all()

    def create(self, path_name: str):
        document = DocumentsC(path_name=path_name)
        try:
            self.db.add(document)
            self.db.commit()
            self.db.refresh(document)
            return document
        except Exception as e:
            self.db.rollback()
            raise e

    def update(self, document_id: int, path_name: str):
        document = self.get_by_id(document_id)
        if not document:
            return None
        document.path_name = path_name
        try:
            self.db.commit()
            self.db.refresh(document)
            return document
        except Exception as e:
            self.db.rollback()
            raise e

    def delete(self, document_id: int):
        document = self.get_by_id(document_id)
        if not document:
            return None
        try:
            self.db.delete(document)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e
