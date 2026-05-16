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
        Schema::create('units', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('slug', 16);
            $table->string('display_name', 64);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('ranks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('unit_id')->constrained('units')->cascadeOnDelete();
            $table->string('display_name', 64);
            $table->string('abbreviation', 6);
            $table->timestamps();
        });

        Schema::create('unit_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('unit_id')->constrained('units')->cascadeOnDelete();
            $table->ulid('user_id')->constrained('users')->cascadeOnDelete();
            $table->ulid('rank_id')->constrained('ranks')->cascadeOnDelete();
            $table->string('display_name', 64);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('units');
        Schema::drop('ranks');
        Schema::drop('unit_members');
    }
};
