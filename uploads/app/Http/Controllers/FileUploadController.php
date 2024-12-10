<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|mimes:xlsx|max:5120',  // Add more file types or restrictions as needed
        ]);

        $fileName = 'data.xlsx';

        // Store the file in the 'uploads' directory
        $path = $request->file('file')->storeAs('uploads', $fileName, 'public');

        // Return a response or redirect back with a success message
        return back()->with('success', 'File uploaded successfully')->with('path', $path);
    }
}
