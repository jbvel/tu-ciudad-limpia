<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSurveyResponseRequest;
use App\Http\Resources\SurveyResponseResource;
use App\Models\SurveyResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SurveyResponseController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SurveyResponseResource::collection(
            SurveyResponse::query()
                ->with(['region', 'commune'])
                ->latest()
                ->paginate(20)
        );
    }

    public function store(StoreSurveyResponseRequest $request): SurveyResponseResource
    {
        $surveyResponse = SurveyResponse::create($request->validated());

        return new SurveyResponseResource($surveyResponse->load(['region', 'commune']));
    }
}
