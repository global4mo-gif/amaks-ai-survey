#!/usr/bin/env python3
import json
import os
import sys
import zipfile
import threading
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
JSONL_PATH = DATA_DIR / "responses.jsonl"
XLSX_PATH = DATA_DIR / "responses.xlsx"

file_lock = threading.Lock()

HEADERS = [
    ("submitted_at", "Дата заполнения"),
    ("fullName", "ФИО"),
    ("department", "Отдел"),
    ("departmentOther", "Отдел: другое"),
    ("role", "Роль"),
    ("aiExperience", "Опыт с ИИ"),
    ("aiServices", "ИИ-сервисы"),
    ("aiServicesOther", "ИИ-сервисы: другое"),
    ("priorityDirections", "Приоритетные направления"),
    ("emailCases", "Почта"),
    ("meetingCases", "Встречи"),
    ("presentationCases", "Презентации"),
    ("knowledgeCases", "База знаний"),
    ("hermesCases", "ИИ-сотрудник Hermes"),
    ("webCases", "Веб-инструменты"),
    ("tenderCases", "Тендеры и пресейл"),
    ("engineeringCases", "Инженерные задачи"),
    ("productionCases", "Производство и аналитика"),
    ("marketingCases", "Маркетинг"),
    ("hrCases", "HR"),
    ("financeCases", "Финансы"),
    ("documentCases", "Документооборот"),
    ("agentCases", "Агентные системы"),
    ("taskToAutomate", "Задача для автоматизации"),
    ("weeklyRoutine", "Главная еженедельная рутина"),
    ("delegateToAi", "Что делегировать ИИ-сотруднику"),
    ("hardRecurringTask", "Тяжёлая повторяющаяся задача"),
    ("seminarExpectations", "Ожидания от семинара"),
    ("mainImportance", "Что важнее всего"),
    ("aiConcerns", "Опасения"),
    ("aiConcernsOther", "Опасения: другое"),
    ("hasLaptop", "Ноутбук на семинаре"),
    ("wantsPractice", "Практический блок"),
]


def ensure_data_dir():
    DATA_DIR.mkdir(exist_ok=True)


def load_responses():
    ensure_data_dir()
    if not JSONL_PATH.exists():
        return []

    rows = []
    with JSONL_PATH.open("r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return rows


def normalize_value(value):
    if value is None:
        return ""
    if isinstance(value, list):
        return "\n".join(str(item) for item in value)
    if isinstance(value, bool):
        return "Да" if value else "Нет"
    return str(value)


def column_name(index):
    name = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        name = chr(65 + remainder) + name
    return name


def cell_xml(row_index, column_index, value, style=None):
    ref = f"{column_name(column_index)}{row_index}"
    attrs = f' r="{ref}" t="inlineStr"'
    if style:
        attrs += f' s="{style}"'
    text = escape(normalize_value(value), {'"': "&quot;"})
    preserve = ' xml:space="preserve"' if text.strip() != text or "\n" in text else ""
    return f'<c{attrs}><is><t{preserve}>{text}</t></is></c>'


def worksheet_xml(responses):
    rows = []
    header_cells = [
        cell_xml(1, index + 1, label, style=1)
        for index, (_, label) in enumerate(HEADERS)
    ]
    rows.append(f'<row r="1" ht="28" customHeight="1">{"".join(header_cells)}</row>')

    for row_number, response in enumerate(responses, start=2):
        cells = []
        for column_index, (key, _) in enumerate(HEADERS, start=1):
            cells.append(cell_xml(row_number, column_index, response.get(key, "")))
        rows.append(f'<row r="{row_number}" ht="54" customHeight="1">{"".join(cells)}</row>')

    column_widths = "".join(
        f'<col min="{index}" max="{index}" width="28" customWidth="1"/>'
        for index in range(1, len(HEADERS) + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <cols>{column_widths}</cols>
  <sheetData>{"".join(rows)}</sheetData>
  <autoFilter ref="A1:{column_name(len(HEADERS))}{max(1, len(responses) + 1)}"/>
</worksheet>'''


def write_xlsx(responses):
    ensure_data_dir()
    files = {
        "[Content_Types].xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>''',
        "_rels/.rels": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>''',
        "docProps/app.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>AMAKS Survey</Application>
</Properties>''',
        "docProps/core.xml": f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Анкеты AMAKS AI-семинар</dc:title>
  <dc:creator>AMAKS Survey</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">{datetime.utcnow().isoformat(timespec="seconds")}Z</dcterms:created>
</cp:coreProperties>''',
        "xl/workbook.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Анкеты" sheetId="1" r:id="rId1"/></sheets>
</workbook>''',
        "xl/_rels/workbook.xml.rels": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>''',
        "xl/styles.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFA31924"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf></cellXfs>
</styleSheet>''',
        "xl/worksheets/sheet1.xml": worksheet_xml(responses),
    }

    with file_lock:
        with zipfile.ZipFile(XLSX_PATH, "w", compression=zipfile.ZIP_DEFLATED) as xlsx:
            for path, content in files.items():
                xlsx.writestr(path, content)


def append_response(payload):
    ensure_data_dir()
    record = {
        "submitted_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        **payload,
    }
    with file_lock:
        with JSONL_PATH.open("a", encoding="utf-8") as file:
            file.write(json.dumps(record, ensure_ascii=False) + "\n")
    write_xlsx(load_responses())
    return record


class SurveyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/count":
            self.end_json(200, {"count": len(load_responses()), "xlsx": str(XLSX_PATH)})
            return
        if path == "/download":
            write_xlsx(load_responses())
            data = XLSX_PATH.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            self.send_header("Content-Disposition", 'attachment; filename="amaks-ai-survey-responses.xlsx"')
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/submit":
            self.end_json(404, {"ok": False, "error": "Not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, json.JSONDecodeError):
            self.end_json(400, {"ok": False, "error": "Некорректный JSON"})
            return

        if not payload.get("fullName") or not payload.get("department"):
            self.end_json(422, {"ok": False, "error": "Заполните ФИО и отдел"})
            return

        append_response(payload)
        self.end_json(200, {"ok": True, "count": len(load_responses())})


def main():
    ensure_data_dir()
    write_xlsx(load_responses())
    port = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 8000))
    server = ThreadingHTTPServer(("127.0.0.1", port), SurveyHandler)
    print(f"AMAKS survey is running: http://127.0.0.1:{port}")
    print(f"Excel file: {XLSX_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
