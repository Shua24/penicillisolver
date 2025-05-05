#!/bin/sh

# Function to handle SIGINT (Ctrl+C)
cleanup() {
  echo "Interrupt received. Terminating all child processes..."
  kill 0  # Sends SIGINT to all processes in the current process group
  wait    # Wait for all child processes to exit
  exit 1
}

# Trap SIGINT and call the cleanup function
trap cleanup INT

# Start Python scripts in the background
python tableQuery.py &
python date.py &
streamlit run upload.py &

# Wait for all background processes to complete
wait

