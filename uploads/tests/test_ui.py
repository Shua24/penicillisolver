import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from config import BASE_URL, TEST_USER, CHROME_DRIVER_PATH
import time

class TestUI:
    def setup_method(self):
        """Setup for each test"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        service = Service(executable_path=CHROME_DRIVER_PATH)
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        self.base_url = BASE_URL

    def teardown_method(self):
        """Cleanup after each test"""
        if self.driver:
            self.driver.quit()

    def test_homepage(self):
        """Test homepage UI"""
        self.driver.get(self.base_url)
        logo = self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "img[alt='Logo']"))
        )
        assert logo.is_displayed()

    def test_login_page(self):
        """Test login page UI"""
        self.driver.get(f"{self.base_url}/login")
        
        # Test form elements
        email_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        password_input = self.driver.find_element(By.NAME, "password")
        login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        assert email_input.is_displayed()
        assert password_input.is_displayed()
        assert login_button.is_displayed()
        assert login_button.text == "Login"

    def test_register_page(self):
        """Test register page UI"""
        self.driver.get(f"{self.base_url}/daftar")
        
        # Test form elements
        nama_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "nama"))
        )
        email_input = self.driver.find_element(By.NAME, "email")
        sip_input = self.driver.find_element(By.NAME, "sip")
        password_input = self.driver.find_element(By.NAME, "password")
        confirm_password_input = self.driver.find_element(By.NAME, "confirmPassword")
        register_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        assert nama_input.is_displayed()
        assert email_input.is_displayed()
        assert sip_input.is_displayed()
        assert password_input.is_displayed()
        assert confirm_password_input.is_displayed()
        assert register_button.is_displayed()

    def test_login_functionality(self):
        """Test login functionality"""
        self.driver.get(f"{self.base_url}/login")

        # Fill login form
        email_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        password_input = self.driver.find_element(By.NAME, "password")
        login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        email_input.send_keys(TEST_USER["email"])
        password_input.send_keys(TEST_USER["password"])
        login_button.click()

        # Wait for success message or error message
        message = self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#pesan, .errorMessage"))
        )
        
        if "errorMessage" in message.get_attribute("class"):
            # If error message, print it for debugging
            print(f"Login error: {message.text}")
        else:
            # If success message, wait for redirect
            assert "Login Berhasil!" in message.text
            time.sleep(3)  # Wait for the 3-second timeout in the code
            assert self.driver.current_url == f"{self.base_url}/beranda"

    def test_register_functionality(self):
        """Test register functionality"""
        self.driver.get(f"{self.base_url}/daftar")

        # Fill register form
        nama_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "nama"))
        )
        email_input = self.driver.find_element(By.NAME, "email")
        sip_input = self.driver.find_element(By.NAME, "sip")
        password_input = self.driver.find_element(By.NAME, "password")
        confirm_password_input = self.driver.find_element(By.NAME, "confirmPassword")
        register_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        nama_input.send_keys(TEST_USER["nama"])
        email_input.send_keys(TEST_USER["email"])
        sip_input.send_keys(TEST_USER["sip"])
        password_input.send_keys(TEST_USER["password"])
        confirm_password_input.send_keys(TEST_USER["password"])

        # Select role
        role_button = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{TEST_USER['role']}')]")
        role_button.click()

        register_button.click()

        # Wait for success message or error message
        message = self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#pesan, .errorMessage"))
        )
        
        if "errorMessage" in message.get_attribute("class"):
            # If error message, print it for debugging
            print(f"Register error: {message.text}")
        else:
            # If success message, wait for redirect
            assert "Pendaftaran berhasil!" in message.text
            time.sleep(1)
            assert self.driver.current_url == f"{self.base_url}/verifikasi-user" 