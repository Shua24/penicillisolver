import requests
import pytest
from config import BASE_URL, TEST_USER, TEST_DATA_FILE

class TestAPI:
    def setup_method(self):
        """Setup for each test"""
        self.session = requests.Session()
        self.base_url = BASE_URL

    def test_homepage(self):
        """Test homepage endpoint"""
        response = self.session.get(self.base_url)
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_login_page(self):
        """Test login page endpoint"""
        response = self.session.get(f"{self.base_url}/login")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_register_page(self):
        """Test register page endpoint"""
        response = self.session.get(f"{self.base_url}/daftar")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_beranda_page(self):
        """Test beranda page endpoint"""
        response = self.session.get(f"{self.base_url}/beranda")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_verifikasi_page(self):
        """Test verification page endpoint"""
        response = self.session.get(f"{self.base_url}/verifikasi-user")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_upload_page(self):
        """Test upload page endpoint"""
        response = self.session.get(f"{self.base_url}/beranda/upload")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_results_page(self):
        """Test results page endpoint"""
        response = self.session.get(f"{self.base_url}/beranda/results")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_login_api(self):
        """Test login API endpoint"""
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json=TEST_USER
        )
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

    def test_upload_file(self):
        """Test file upload endpoint"""
        # Login first
        self.test_login_api()
        
        with open(TEST_DATA_FILE, "rb") as f:
            files = {"file": f}
            response = self.session.post(
                f"{self.base_url}/api/upload",
                files=files
            )
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

    def test_get_results(self):
        """Test get results endpoint"""
        # Login first
        self.test_login_api()
        
        response = self.session.get(f"{self.base_url}/api/results")
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

    def test_download_report(self):
        """Test download report endpoint"""
        # Login first
        self.test_login_api()
        
        response = self.session.get(f"{self.base_url}/api/report")
        assert response.status_code == 200
        assert "application/pdf" in response.headers["content-type"]

    def test_analyze_data(self):
        """Test analyze data endpoint"""
        # Login first
        self.test_login_api()
        
        data = {"data": "test data"}
        response = self.session.post(
            f"{self.base_url}/api/analyze",
            json=data
        )
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"] 