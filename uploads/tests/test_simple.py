from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import os
import time

def test_simple():
    print("Memulai test sederhana...")
    try:
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        # Gunakan ChromeDriver lokal
        current_dir = os.path.dirname(os.path.abspath(__file__))
        chromedriver_path = os.path.join(current_dir, "chromedriver.exe")
        
        if not os.path.exists(chromedriver_path):
            print(f"ERROR: chromedriver.exe tidak ditemukan di: {chromedriver_path}")
            print("Silakan download ChromeDriver dan letakkan di folder yang sama dengan script ini")
            return
            
        print(f"Menggunakan ChromeDriver dari: {chromedriver_path}")
        service = Service(executable_path=chromedriver_path)
        
        print("Mencoba menginisialisasi Chrome driver...")
        driver = webdriver.Chrome(service=service, options=chrome_options)
        print("Chrome driver berhasil diinisialisasi")
        
        # Buka website
        print("Mencoba membuka website...")
        driver.get("http://localhost:3000")
        print("Website berhasil dibuka")
        
        # Tunggu beberapa detik
        time.sleep(3)
        
        # Ambil title website
        title = driver.title
        print(f"Title website: {title}")
        
        print("Test berhasil!")
        
    except Exception as e:
        print(f"Test gagal: {str(e)}")
        print("Detail error:")
        import traceback
        print(traceback.format_exc())
        
    finally:
        # Tutup browser
        if 'driver' in locals():
            driver.quit()

if __name__ == "__main__":

    chrome_paths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    ]
    
    chrome_installed = any(os.path.exists(path) for path in chrome_paths)
    
    if not chrome_installed:
        print("PERINGATAN: Chrome tidak ditemukan di lokasi default!")
        print("Pastikan Google Chrome terinstall di sistem Anda")
    else:
        print("Chrome ditemukan di sistem")
        test_simple()
