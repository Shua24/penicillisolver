#!/bin/bash

(php artisan serve --host=0.0.0.0) &
(python tableQuery.py) &
(node date.js) &

wait
