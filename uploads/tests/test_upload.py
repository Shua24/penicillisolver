from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

def test_file_upload():
    # Setup Chrome driver
    driver = webdriver.Chrome()
    
    try:
        # Buka website
        driver.get("http://localhost:8000")  # Sesuaikan dengan URL website Anda
        
        # Tunggu form upload muncul
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "file"))
        )
        
        # Upload file xlsx yang valid
        test_file_path = os.path.abspath("test_data.xlsx")  # Buat file test terlebih dahulu
        file_input.send_keys(test_file_path)
        
        # Klik tombol upload
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Tunggu pesan sukses
        success_message = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert"))
        )
        
        # Verifikasi pesan sukses
        assert "Pola kuman ter-update!" in success_message.text
        
        # Verifikasi file tersimpan
        assert os.path.exists(os.path.join("uploads", "data.xlsx"))
        
        print("Test berhasil!")
        
    except Exception as e:
        print(f"Test gagal: {str(e)}")
    
    finally:
        driver.quit()

if __name__ == "__main__":
    test_file_upload() 