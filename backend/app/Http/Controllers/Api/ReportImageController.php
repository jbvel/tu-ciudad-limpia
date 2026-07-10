<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportImageRequest;
use App\Http\Resources\ReportImageResource;
use App\Models\Report;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReportImageController extends Controller
{
    public function store(StoreReportImageRequest $request, Report $report): AnonymousResourceCollection
    {
        $images = collect($request->file('images'))
            ->map(function ($image) use ($report) {
                $storedPath = $image->store('reports', 'public');

                return $report->images()->create([
                    'path' => $storedPath,
                    'original_name' => $image->getClientOriginalName(),
                    'mime_type' => $image->getClientMimeType(),
                    'size' => $image->getSize(),
                ]);
            });

        return ReportImageResource::collection($images);
    }
}
