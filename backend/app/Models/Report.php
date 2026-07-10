<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Report extends Model
{
    use HasFactory;

    public const TYPES = SurveyResponse::PROBLEM_TYPES;

    public const STATUSES = [
        'pendiente',
        'en_revision',
        'resuelto',
        'rechazado',
    ];

    protected $fillable = [
        'type',
        'title',
        'description',
        'region_id',
        'commune_id',
        'sector',
        'address_reference',
        'latitude',
        'longitude',
        'status',
        'name_optional',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ReportImage::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }
}
