<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('slots', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('section_id')->constrained('sections', 'id')->cascadeOnDelete();
            $table->text('display_name');
            $table->boolean('is_leader')->default(false);
            $table->text('callsign')->nullable();
            $table->bigInteger('ord')->default(0);
            $table->foreignUlid('unit_member_id')
                  ->nullable()
                  ->constrained('unit_members', 'id')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
