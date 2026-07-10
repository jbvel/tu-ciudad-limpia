<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(Report::TYPES)],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'region_id' => ['required', 'integer', 'exists:regions,id'],
            'commune_id' => [
                'required',
                'integer',
                'exists:communes,id',
                \Illuminate\Validation\Rule::exists('communes', 'id')
                    ->where('region_id', $this->integer('region_id')),
            ],
            'sector' => ['required', 'string', 'max:255'],
            'address_reference' => ['nullable', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'status' => ['sometimes', 'string', Rule::in(Report::STATUSES)],
            'name_optional' => ['nullable', 'string', 'max:255'],
        ];
    }
}
