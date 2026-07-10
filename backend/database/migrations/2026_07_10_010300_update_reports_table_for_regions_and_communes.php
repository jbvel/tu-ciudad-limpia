<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('region_id')->nullable()->after('description')->constrained('regions');
            $table->foreignId('commune_id')->nullable()->after('region_id')->constrained('communes');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['region', 'commune']);
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->string('region')->nullable();
            $table->string('commune')->nullable();
            $table->dropConstrainedForeignId('commune_id');
            $table->dropConstrainedForeignId('region_id');
        });
    }
};
