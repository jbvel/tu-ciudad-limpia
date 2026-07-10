<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SurveyResponseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_optional' => $this->name_optional,
            'region_id' => $this->region_id,
            'commune_id' => $this->commune_id,
            'region' => new RegionResource($this->whenLoaded('region')),
            'commune' => new CommuneResource($this->whenLoaded('commune')),
            'sector' => $this->sector,
            'problem_type' => $this->problem_type,
            'description' => $this->description,
            'address_reference' => $this->address_reference,
            'latitude' => $this->latitude !== null ? (float) $this->latitude : null,
            'longitude' => $this->longitude !== null ? (float) $this->longitude : null,
            'problem_frequency' => $this->problem_frequency,
            'has_nearby_recycling_point' => $this->has_nearby_recycling_point,
            'additional_comment' => $this->additional_comment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
