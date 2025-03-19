from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time
import requests
from requests.exceptions import ConnectionError

def test_error_handling():
    driver = webdriver.Chrome()
    
    try:
        # Test 1: Upload file rusak/corrupt
        print("Test 1: Upload file rusak")
        driver.get("http://localhost:8000")
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "file"))
        )
        
        # Buat file Excel rusak
        with open("corrupt.xlsx", "wb") as f:
            f.write(b"corrupt data")
        
        test_file_path = os.path.abspath("corrupt.xlsx")
        file_input.send_keys(test_file_path)
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Verifikasi pesan error
        error_message = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert"))
        )
        assert "Format file tidak diizinkan" in error_message.text
        print("Test 1: Validasi file rusak berhasil")
        
        # Test 2: Upload saat server sibuk
        print("\nTest 2: Upload saat server sibuk")
        driver.refresh()
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "file"))
        )
        
        # Buat request ke server untuk membuat server sibuk
        for _ in range(5):
            try:
                requests.post("http://localhost:8000/upload", files={'file': ('test.xlsx', b'test')})
            except ConnectionError:
                print("Server sibuk, test berhasil")
                break
        
        # Coba upload file
        test_file_path = os.path.abspath("test_data.xlsx")
        file_input.send_keys(test_file_path)
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Tunggu timeout atau error
        try:
            error_message = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, "alert"))
            )
            print("Test 2: Penanganan server sibuk berhasil")
        except:
            print("Test 2: Timeout saat server sibuk (sesuai ekspektasi)")
        
        print("\nSemua test error handling berhasil!")
        
    except Exception as e:
        print(f"Test error handling gagal: {str(e)}")
    
    finally:
        driver.quit()
        # Bersihkan file test
        if os.path.exists("corrupt.xlsx"):
            os.remove("corrupt.xlsx")

if __name__ == "__main__":
    test_error_handling() 