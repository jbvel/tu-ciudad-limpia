<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id();
            $table->string('name_optional')->nullable();
            $table->string('region');
            $table->string('commune');
            $table->string('sector');
            $table->string('problem_type');
            $table->text('description');
            $table->string('address_reference')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('problem_frequency')->nullable();
            $table->boolean('has_nearby_recycling_point')->nullable();
            $table->text('additional_comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
    }
};
