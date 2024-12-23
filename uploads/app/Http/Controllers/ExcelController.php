<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\File;

class ExcelController extends Controller
{
    public function getExcelData(Request $request)
    {
        $filePath = public_path('storage/uploads/data.xlsx');
        
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found. Public path is in '.$filePath], 404);
        }
        try {
            // Load the Excel file
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true); // Convert sheet to array

            return response()->json($rows, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error membaca excel.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteExcelFile(Request $request)
    {
        $filePath = public_path('storage/uploads/data.xlsx');

        if (!File::exists($filePath)) {
            return response()->json(['error' => 'File not found. Public path is in '.$filePath], 404);
        }

        try {
            File::delete($filePath);
            return response()->json(['success' => 'Pola kuman berhasil terhapus.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting the file.', 'details' => $e->getMessage()], 500);
        }
    }
}
