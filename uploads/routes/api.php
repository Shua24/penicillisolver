<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExcelController;

Route::get('/excel-data', [ExcelController::class, 'getExcelData']);
Route::delete('/delete-excel', [ExcelController::class, 'deleteExcelFile']);