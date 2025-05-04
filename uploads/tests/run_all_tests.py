import pytest
import os
from datetime import datetime
from config import REPORTS_DIR

def run_tests():
    """Menjalankan semua test dan menghasilkan laporan HTML"""
    # Buat nama file laporan dengan timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = os.path.join(REPORTS_DIR, f"test_report_{timestamp}.html")
    
    # Jalankan test dengan pytest
    pytest.main([
        "test_api.py",
        "test_ui.py",
        "--html=" + report_file,
        "--self-contained-html",
        "-v"
    ])
    
    print(f"\nTest selesai! Laporan tersimpan di: {report_file}")

if __name__ == "__main__":
    run_tests() 