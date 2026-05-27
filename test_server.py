import unittest
import json
import tempfile
import os
import shutil
import server
from pathlib import Path
from http.server import HTTPServer
import threading
import urllib.request
import urllib.error

class TestServer(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory for data
        self.test_dir = tempfile.mkdtemp()
        self.old_data_dir = server.DATA_DIR
        self.old_jsonl_path = server.JSONL_PATH
        self.old_xlsx_path = server.XLSX_PATH

        server.DATA_DIR = Path(self.test_dir)
        server.JSONL_PATH = server.DATA_DIR / "responses.jsonl"
        server.XLSX_PATH = server.DATA_DIR / "responses.xlsx"

        # Start server in a background thread
        self.server_port = 8081
        self.httpd = HTTPServer(('127.0.0.1', self.server_port), server.SurveyHandler)
        self.server_thread = threading.Thread(target=self.httpd.serve_forever)
        self.server_thread.daemon = True
        self.server_thread.start()

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.server_thread.join()

        # Restore original paths
        server.DATA_DIR = self.old_data_dir
        server.JSONL_PATH = self.old_jsonl_path
        server.XLSX_PATH = self.old_xlsx_path

        shutil.rmtree(self.test_dir)

    def test_append_and_load_responses(self):
        # Initially empty
        self.assertEqual(server.load_responses(), [])

        # Append one response
        payload = {"fullName": "Test User", "department": "IT"}
        record = server.append_response(payload)
        self.assertIn("submitted_at", record)
        self.assertEqual(record["fullName"], "Test User")

        # Load and verify
        responses = server.load_responses()
        self.assertEqual(len(responses), 1)
        self.assertEqual(responses[0]["fullName"], "Test User")

        # Verify Excel file is created
        self.assertTrue(server.XLSX_PATH.exists())

    def test_api_submit(self):
        url = f"http://127.0.0.1:{self.server_port}/api/submit"
        data = json.dumps({"fullName": "API User", "department": "HR"}).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

        with urllib.request.urlopen(req) as response:
            self.assertEqual(response.status, 200)
            res_data = json.loads(response.read().decode())
            self.assertTrue(res_data["ok"])
            self.assertEqual(res_data["count"], 1)

    def test_api_submit_invalid(self):
        url = f"http://127.0.0.1:{self.server_port}/api/submit"
        data = json.dumps({"fullName": "API User"}).encode('utf-8') # missing department
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

        try:
            urllib.request.urlopen(req)
            self.fail("Expected HTTPError 422")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 422)

    def test_api_count(self):
        # Append some data
        server.append_response({"fullName": "User 1", "department": "A"})
        server.append_response({"fullName": "User 2", "department": "B"})

        url = f"http://127.0.0.1:{self.server_port}/api/count"
        with urllib.request.urlopen(url) as response:
            self.assertEqual(response.status, 200)
            res_data = json.loads(response.read().decode())
            self.assertEqual(res_data["count"], 2)

    def test_download(self):
        server.append_response({"fullName": "Download User", "department": "C"})
        url = f"http://127.0.0.1:{self.server_port}/download"
        with urllib.request.urlopen(url) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(response.headers.get('Content-Type'), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            data = response.read()
            self.assertTrue(len(data) > 0)

if __name__ == '__main__':
    unittest.main()
