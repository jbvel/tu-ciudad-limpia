<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyResponse extends Model
{
    use HasFactory;

    public const PROBLEM_TYPES = [
        'microbasural',
        'basura_domiciliaria',
        'falta_punto_limpio',
        'reciclaje',
        'retiro_voluminosos',
        'escombros',
        'otro',
    ];

    protected $fillable = [
        'name_optional',
        'region_id',
        'commune_id',
        'sector',
        'problem_type',
        'description',
        'address_reference',
        'latitude',
        'longitude',
        'problem_frequency',
        'has_nearby_recycling_point',
        'additional_comment',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'has_nearby_recycling_point' => 'boolean',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }
}
