#!/bin/sh

PIDFILE="/tmp/web_pids"

if [ ! -f "$PIDFILE" ]; then
  echo "No PID file found. Services may not be running."
  exit 1
fi

echo "Stopping services..."

while read -r pid; do
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid"
    echo "Stopped PID $pid"
  else
    echo "PID $pid not running"
  fi
done < "$PIDFILE"

rm -f "$PIDFILE"
echo "All tracked services stopped."

