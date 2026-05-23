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
        Schema::create('unit_role_bindings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('unit_role_id')
                ->constrained('unit_roles')
                ->cascadeOnDelete();
            $table->foreignUlid('unit_member_id')
                ->constrained('unit_members')
                ->cascadeOnDelete();
            $table->unique(['unit_role_id', 'unit_member_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_role_bindings');
    }
};
