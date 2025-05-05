#!/bin/sh

cleanup() {
  echo "Interrupt received. Terminating all child processes..."
  kill 0  # Sends SIGINT to all processes in the current process group
  wait    # Wait for all child processes to exit
  exit 1
}

trap cleanup INT

# (php artisan serve --host=0.0.0.0) &
python tableQuery.py &
python date.py &
streamlit run upload.py &

wait
