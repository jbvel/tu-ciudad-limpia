<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'region_id' => $this->region_id,
            'commune_id' => $this->commune_id,
            'region' => new RegionResource($this->whenLoaded('region')),
            'commune' => new CommuneResource($this->whenLoaded('commune')),
            'sector' => $this->sector,
            'address_reference' => $this->address_reference,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'status' => $this->status,
            'name_optional' => $this->name_optional,
            'images' => ReportImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
