<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\ExcelController;

Route::get('/', function () {
    return view('file_upload');
});

Route::post('/upload', [FileUploadController::class, 'upload'])->name('file.upload');
