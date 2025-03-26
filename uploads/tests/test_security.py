from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

def test_security():
    driver = webdriver.Chrome()
    
    try:
        # Test 1: Upload file dengan ekstensi berbahaya
        driver.get("http://localhost:8000")
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "file"))
        )
        
        # Coba upload file .php
        test_file_path = os.path.abspath("test.php")
        file_input.send_keys(test_file_path)
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Verifikasi file tidak diterima
        error_message = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert"))
        )
        assert "Format file tidak diizinkan" in error_message.text
        print("Test 1: Validasi ekstensi file berhasil")
        
        # Test 2: Upload file dengan nama mengandung karakter khusus
        driver.refresh()
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "file"))
        )
        
        # Coba upload file dengan nama mengandung karakter khusus
        test_file_path = os.path.abspath("test@#$%.xlsx")
        file_input.send_keys(test_file_path)
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Verifikasi file tidak diterima
        error_message = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert"))
        )
        assert "Format file tidak diizinkan" in error_message.text
        print("Test 2: Validasi nama file berhasil")
        
        print("Semua test keamanan berhasil!")
        
    except Exception as e:
        print(f"Test keamanan gagal: {str(e)}")
    
    finally:
        driver.quit()

if __name__ == "__main__":
    test_security() 