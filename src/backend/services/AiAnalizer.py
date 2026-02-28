# services/AiAnalizer.py

import os
from bs4 import BeautifulSoup
from services.IndexerService import IndexerService
from openai import OpenAI

class AiAnalizer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = OpenAI(api_key=self.api_key)  

    def extract_text_from_html(self, html_path: str) -> str:
        """
        Extrae texto limpio de un archivo HTML
        """
        if not os.path.exists(html_path):
            return ""
        with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text(separator="\n")

    def realizarQuery(self, query):
        indexer = IndexerService()
        document_ids = indexer.search(query)

        from Daos.DocumentCDAO import DocumentCDAO
        dao = DocumentCDAO()

        combined_text = ""

        for doc_id in document_ids:
            document = dao.get_by_id(int(doc_id))
            if not document:
                continue

            html_path = document.path_name
            if not os.path.exists(html_path):
                continue

            combined_text += self.extract_text_from_html(html_path) + "\n\n"

        dao.close()

        if not combined_text.strip():
            return "No hay texto válido en los documentos", ""

        prompt = f"{query}\n\n{combined_text}"
        summary = self._call_chatgpt_api(prompt)

        interest_prompt = f"Busca información interesante relacionada con esta query:\n\n{combined_text}"
        interest_text = self._call_chatgpt_api(interest_prompt)

        return summary, interest_text

    def _call_chatgpt_api(self, prompt: str) -> str:
        """
        Llama a ChatGPT usando la nueva API de OpenAI (>=1.0.0)
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # o "gpt-4" si lo tienes habilitado
                messages=[
                    {"role": "system", "content": "Eres un asistente útil y preciso."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error en OpenAI API: {str(e)}")