<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReportController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $reports = Report::query()
            ->with(['images', 'region', 'commune'])
            ->latest()
            ->paginate(20);

        return ReportResource::collection($reports);
    }

    public function show(Report $report): ReportResource
    {
        return new ReportResource($report->load(['images', 'region', 'commune']));
    }

    public function store(StoreReportRequest $request): ReportResource
    {
        $validated = $request->validated();

        $report = Report::create([
            ...$validated,
            'status' => $validated['status'] ?? 'pendiente',
        ]);

        return new ReportResource($report->load(['images', 'region', 'commune']));
    }
}
