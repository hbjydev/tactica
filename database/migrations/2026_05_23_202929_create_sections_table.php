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
        Schema::create('sections', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('unit_id')->constrained('units', 'id')->cascadeOnDelete();
            $table->text('display_name');
            $table->text('description')->nullable();
            $table->text('callsign')->nullable();
            $table->bigInteger('ord')->default(0);
            // parent_id added as plain column here; FK added below after PK exists
            $table->char('parent_id', 26)->nullable();

            $table->timestamps();
        });

        // Self-referential FK must be added after the table (and its PK) is created
        Schema::table('sections', function (Blueprint $table) {
            $table->foreign('parent_id')
                ->references('id')
                ->on('sections')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });
        Schema::dropIfExists('sections');
    }
};
