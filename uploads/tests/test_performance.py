from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time
import psutil
import sys

def get_memory_usage():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # dalam MB

def test_performance():
    driver = webdriver.Chrome()
    
    try:
        # Test 1: Upload file besar
        print("Memulai test performa...")
        initial_memory = get_memory_usage()
        print(f"Memory awal: {initial_memory:.2f} MB")
        
        driver.get("http://localhost:8000")
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "file"))
        )
        
        # Upload file besar (4MB)
        test_file_path = os.path.abspath("large_file.xlsx")
        start_time = time.time()
        file_input.send_keys(test_file_path)
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Tunggu upload selesai
        success_message = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert"))
        )
        end_time = time.time()
        
        upload_time = end_time - start_time
        final_memory = get_memory_usage()
        memory_diff = final_memory - initial_memory
        
        print(f"Waktu upload: {upload_time:.2f} detik")
        print(f"Perbedaan memory: {memory_diff:.2f} MB")
        
        # Test 2: Upload multiple file secara berurutan
        print("\nMemulai test multiple upload...")
        for i in range(3):
            driver.refresh()
            file_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.NAME, "file"))
            )
            
            test_file_path = os.path.abspath(f"test_file_{i}.xlsx")
            start_time = time.time()
            file_input.send_keys(test_file_path)
            submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
            submit_button.click()
            
            success_message = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "alert"))
            )
            end_time = time.time()
            
            print(f"Upload file {i+1}: {end_time - start_time:.2f} detik")
        
        print("\nSemua test performa berhasil!")
        
    except Exception as e:
        print(f"Test performa gagal: {str(e)}")
    
    finally:
        driver.quit()

if __name__ == "__main__":
    test_performance() 