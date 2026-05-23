<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_invites', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('unit_id')
                ->constrained('units')
                ->cascadeOnDelete();

            $table->string('token', 40)->unique();

            $table->foreignUlid('created_by_member_id')
                ->nullable()
                ->constrained('unit_members')
                ->nullOnDelete();

            $table->foreignUlid('default_rank_id')
                ->nullable()
                ->constrained('ranks')
                ->nullOnDelete();

            $table->timestamp('expires_at')->nullable();
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('uses')->default(0);
            $table->unsignedInteger('views')->default(0);
            $table->timestamp('revoked_at')->nullable();
            $table->string('notes', 255)->nullable();

            $table->timestamps();
        });

        Schema::create('unit_invite_default_roles', function (Blueprint $table) {
            $table->foreignUlid('unit_invite_id')
                ->constrained('unit_invites')
                ->cascadeOnDelete();
            $table->foreignUlid('unit_role_id')
                ->constrained('unit_roles')
                ->cascadeOnDelete();
            $table->primary(['unit_invite_id', 'unit_role_id']);
            $table->timestamps();
        });

        Schema::create('unit_invite_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('unit_invite_id')
                ->constrained('unit_invites')
                ->cascadeOnDelete();

            $table->string('event_type');

            $table->foreignUlid('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->string('referer', 512)->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index(['unit_invite_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_invite_events');
        Schema::dropIfExists('unit_invite_default_roles');
        Schema::dropIfExists('unit_invites');
    }
};
