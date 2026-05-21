<?php

use App\Models\Enums\UnitRoleType;
use App\Models\Unit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('unit_roles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('unit_id')->constrained('units')->cascadeOnDelete();
            $table->string('display_name', 64);
            $table->string('description', 255)->nullable();
            $table->bigInteger('permissions')->default(0);
            $table->string('type')->default(UnitRoleType::CUSTOM->value);
            $table->timestamps();
        });

        foreach (Unit::all() as $unit) {
            Log::info("Creating default roles for unit: {$unit->display_name} ({$unit->id})");
            $unit->createDefaultRoles();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_roles');
    }
};
