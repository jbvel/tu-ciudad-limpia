<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReportImageController;
use App\Http\Controllers\Api\SurveyResponseController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{region}/communes', [RegionController::class, 'communes']);

Route::get('/survey-responses', [SurveyResponseController::class, 'index']);
Route::post('/survey-responses', [SurveyResponseController::class, 'store']);

Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/{report}', [ReportController::class, 'show']);
Route::post('/reports', [ReportController::class, 'store']);
Route::post('/reports/{report}/images', [ReportImageController::class, 'store']);

// TODO: proteger endpoints administrativos futuros con autenticacion y autorizacion.
