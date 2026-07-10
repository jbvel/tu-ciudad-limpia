<?php

namespace App\Http\Requests;

use App\Models\SurveyResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSurveyResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_optional' => ['nullable', 'string', 'max:255'],
            'region_id' => ['required', 'integer', 'exists:regions,id'],
            'commune_id' => [
                'required',
                'integer',
                'exists:communes,id',
                \Illuminate\Validation\Rule::exists('communes', 'id')
                    ->where('region_id', $this->integer('region_id')),
            ],
            'sector' => ['required', 'string', 'max:255'],
            'problem_type' => ['required', 'string', Rule::in(SurveyResponse::PROBLEM_TYPES)],
            'description' => ['required', 'string', 'max:2000'],
            'address_reference' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'problem_frequency' => ['nullable', 'string', 'max:255'],
            'has_nearby_recycling_point' => ['nullable', 'boolean'],
            'additional_comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
