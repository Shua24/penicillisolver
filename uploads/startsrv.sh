#!/bin/sh

PIDFILE="/tmp/web_pids"

rm -f "$PIDFILE"

echo "currently working on $(pwd), starting web services."

source venv/bin/activate

# Start Next.js
npm start &
echo $! >> "$PIDFILE"

# Gunicorn services
gunicorn -w 4 -b 0.0.0.0:5000 tableQuery:app &
echo $! >> "$PIDFILE"

gunicorn -w 4 -b 0.0.0.0:5001 date:app &
echo $! >> "$PIDFILE"

# Streamlit
streamlit run upload.py &
echo $! >> "$PIDFILE"

echo "PenicilliSolver deployed."
