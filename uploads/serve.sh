#!/bin/sh

# (php artisan serve --host=0.0.0.0) &
(python tableQuery.py) &
(python date.py) &
(streamlit run upload.py) &

wait
