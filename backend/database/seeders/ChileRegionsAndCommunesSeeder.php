<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ChileRegionsAndCommunesSeeder extends Seeder
{
    public function run(): void
    {
        $items = json_decode(
            file_get_contents(database_path('seeders/data/chile-regions-communes.json')),
            true,
            flags: JSON_THROW_ON_ERROR
        );

        foreach ($items as $item) {
            $region = Region::updateOrCreate(
                ['slug' => Str::slug($item['name'])],
                [
                    'code' => $item['code'] ?? null,
                    'name' => $item['name'],
                ]
            );

            foreach ($item['communes'] as $commune) {
                $region->communes()->updateOrCreate(
                    ['slug' => Str::slug($commune['name'])],
                    [
                        'code' => $commune['code'] ?? null,
                        'name' => $commune['name'],
                    ]
                );
            }
        }
    }
}
