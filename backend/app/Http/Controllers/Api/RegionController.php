<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommuneResource;
use App\Http\Resources\RegionResource;
use App\Models\Region;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RegionController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return RegionResource::collection(
            Region::query()->orderBy('name')->get()
        );
    }

    public function communes(Region $region): AnonymousResourceCollection
    {
        return CommuneResource::collection(
            $region->communes()->orderBy('name')->get()
        );
    }
}
