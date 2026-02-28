from bs4 import BeautifulSoup


def extract_text_from_html(html_path: str) -> str:
    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text(separator="\n")
