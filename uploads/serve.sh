#!/bin/sh

cleanup() {
  echo "Interrupt received."
  kill 0
  wait
  exit 1
}

trap cleanup INT

python tableQuery.py &
python date.py &
streamlit run upload.py &

wait

