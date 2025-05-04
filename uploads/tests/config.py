import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base URL for testing
BASE_URL = "http://localhost:3000"

# Test user credentials
TEST_USER = {
    "email": "test.user@example.com",
    "password": "Test123",
    "nama": "Test User",
    "sip": "123456789",
    "role": "Dokter lain"
}

# File paths
TEST_DATA_FILE = "test_data.xlsx"
CHROME_DRIVER_PATH = os.path.join(os.path.dirname(__file__), "chromedriver.exe")

# Test timeouts
TIMEOUT = 10  # seconds

# Test directories
TEST_RESULTS_DIR = "test_results"
SCREENSHOTS_DIR = os.path.join(TEST_RESULTS_DIR, "screenshots")
REPORTS_DIR = os.path.join(TEST_RESULTS_DIR, "reports")

# Create directories if they don't exist
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True) 