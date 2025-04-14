from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import os
import time
import unittest

class TestPenicilliSolver(unittest.TestCase):
    def setUp(self):
        # Setup untuk setiap test
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        chromedriver_path = os.path.join(current_dir, "chromedriver.exe")
        
        if not os.path.exists(chromedriver_path):
            raise Exception(f"ChromeDriver tidak ditemukan di: {chromedriver_path}")
            
        self.driver = webdriver.Chrome(
            service=Service(executable_path=chromedriver_path),
            options=chrome_options
        )
        self.driver.implicitly_wait(10)
        self.base_url = "http://localhost:3000"
    
    def tearDown(self):
        # Cleanup setelah setiap test
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def test_01_landing_page(self):
        """Test halaman landing"""
        print("\nTest 1: Mengecek Landing Page")
        self.driver.get(f"{self.base_url}/landing")
        
        # Cek judul halaman
        self.assertIn("PenicilliSolver", self.driver.title)
        
        # Cek elemen-elemen penting
        self.assertTrue(self.is_element_present(By.ID, "hero-section"))
        self.assertTrue(self.is_element_present(By.ID, "features-section"))
        print("[OK] Landing page berhasil dimuat")
    
    def test_02_login(self):
        """Test login functionality"""
        print("\nTest 2: Mengecek Fungsi Login")
        self.driver.get(f"{self.base_url}/login")
        
        # Input kredensial
        email_field = self.driver.find_element(By.NAME, "email")
        password_field = self.driver.find_element(By.NAME, "password")
        
        email_field.send_keys("test@example.com")
        password_field.send_keys("password123")
        
        # Klik tombol login
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        # Verifikasi login berhasil
        try:
            WebDriverWait(self.driver, 10).until(
                EC.url_contains("/dashboard")
            )
            print("[OK] Login berhasil")
        except TimeoutException:
            self.fail("Login gagal - tidak redirect ke dashboard")
    
    def test_03_upload_file(self):
        """Test upload file"""
        print("\nTest 3: Mengecek Fungsi Upload File")
        # Login dulu
        self.test_02_login()
        
        # Pergi ke halaman upload
        self.driver.get(f"{self.base_url}/upload")
        
        # Upload file
        file_input = self.driver.find_element(By.NAME, "file")
        test_file_path = os.path.join(os.path.dirname(__file__), "test_data.xlsx")
        file_input.send_keys(test_file_path)
        
        # Klik tombol upload
        upload_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Upload')]")
        upload_button.click()
        
        # Verifikasi upload berhasil
        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        self.assertIn("berhasil", success_message.text.lower())
        print("[OK] Upload file berhasil")
    
    def test_04_view_results(self):
        """Test melihat hasil analisis"""
        print("\nTest 4: Mengecek Halaman Hasil Analisis")
        # Login dulu
        self.test_02_login()
        
        # Pergi ke halaman hasil
        self.driver.get(f"{self.base_url}/results")
        
        # Verifikasi tabel hasil ada
        table = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "results-table"))
        )
        self.assertTrue(table.is_displayed())
        print("[OK] Halaman hasil dapat diakses")
    
    def test_05_download_report(self):
        """Test download laporan"""
        print("\nTest 5: Mengecek Fungsi Download Laporan")
        # Login dulu
        self.test_02_login()
        
        # Pergi ke halaman hasil
        self.driver.get(f"{self.base_url}/results")
        
        # Klik tombol download
        download_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Download')]")
        download_button.click()
        
        # Tunggu beberapa saat untuk download
        time.sleep(3)
        
        # Verifikasi file terdownload (sesuaikan path)
        download_path = os.path.join(os.path.expanduser("~"), "Downloads", "report.pdf")
        self.assertTrue(os.path.exists(download_path))
        print("[OK] Download laporan berhasil")
    
    def test_06_logout(self):
        """Test logout"""
        print("\nTest 6: Mengecek Fungsi Logout")
        # Login dulu
        self.test_02_login()
        
        # Klik tombol logout
        logout_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        logout_button.click()
        
        # Verifikasi kembali ke halaman login
        WebDriverWait(self.driver, 10).until(
            EC.url_contains("/login")
        )
        print("[OK] Logout berhasil")
    
    def is_element_present(self, by, value):
        """Helper method untuk mengecek keberadaan elemen"""
        try:
            self.driver.find_element(by, value)
            return True
        except:
            return False

if __name__ == "__main__":
    # Cek Chrome terinstall
    chrome_paths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    ]
    
    if not any(os.path.exists(path) for path in chrome_paths):
        print("PERINGATAN: Chrome tidak ditemukan!")
        print("Pastikan Google Chrome terinstall di sistem Anda")
    else:
        print("Memulai test suite...")
        unittest.main(verbosity=2) 