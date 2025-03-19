import subprocess
import sys
import time
from datetime import datetime

def run_test(test_file):
    print(f"\n{'='*50}")
    print(f"Menjalankan {test_file}...")
    print(f"{'='*50}\n")
    
    try:
        result = subprocess.run([sys.executable, test_file], capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("Error:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Error menjalankan {test_file}: {str(e)}")
        return False

def main():
    print(f"Memulai test suite pada {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Install dependencies
    print("\nMenginstall dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Daftar test yang akan dijalankan
    tests = [
        "test_upload.py",
        "test_security.py",
        "test_performance.py",
        "test_error_handling.py"
    ]
    
    # Jalankan semua test
    success_count = 0
    for test in tests:
        if run_test(test):
            success_count += 1
        time.sleep(2)  # Tunggu sebentar antara test
    
    # Tampilkan hasil
    print(f"\n{'='*50}")
    print(f"Hasil Test Suite:")
    print(f"Total test: {len(tests)}")
    print(f"Test berhasil: {success_count}")
    print(f"Test gagal: {len(tests) - success_count}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main() 