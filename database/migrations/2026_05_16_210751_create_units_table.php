<?php

use App\Models\Enums\ServiceRecordEntryType;
use App\Models\Enums\UnitMemberStatus;
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
            $table->string('slug', 16)->unique();
            $table->string('display_name', 64);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('discord_guild_id')->nullable();
            $table->timestamps();
        });

        Schema::create('ranks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('unit_id')->constrained('units')->cascadeOnDelete();
            $table->string('display_name', 64);
            $table->string('abbreviation', 6);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('unit_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('unit_id')->constrained('units')->cascadeOnDelete();
            $table->ulid('user_id')->nullable()->constrained('users')->setNullOnDelete();

            $table->string('display_name');

            $table->enum('status', UnitMemberStatus::cases());
            $table->timestamp('status_changed_at')->nullable();

            $table->ulid('rank_id')->constrained('ranks')->cascadeOnDelete();
            $table->timestamp('rank_changed_at')->nullable();

            $table->string('timezone')->nullable();
            $table->string('referred_by')->nullable();

            $table->timestamps();

            // Users can only have one membership per unit
            $table->unique(['unit_id', 'user_id']);
        });

        Schema::create('service_record', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('unit_member_id')->constrained('unit_members')->cascadeOnDelete();
            $table->ulid('performed_by')->constrained('unit_members')->cascadeOnDelete();

            $table->enum('type', ServiceRecordEntryType::cases());
            $table->jsonb('data');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('service_record');
        Schema::drop('unit_members');
        Schema::drop('ranks');
        Schema::drop('units');
    }
};
