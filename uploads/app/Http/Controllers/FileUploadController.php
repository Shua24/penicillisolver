<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        // Validasi
        $request->validate([
            'file' => 'required|mimes:xlsx|max:5120',
        ]);

        $fileName = 'data.xlsx';
        $path = $request->file('file')->storeAs('uploads', $fileName, 'public');

        return back()->with('success', 'Pola kuman ter-update!')->with('path', $path);
    }
}
