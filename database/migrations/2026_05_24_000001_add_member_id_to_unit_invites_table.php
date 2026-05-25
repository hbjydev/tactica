<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('unit_invites', function (Blueprint $table) {
            $table->ulid('member_id')->nullable()->after('created_by_member_id');
            $table->foreign('member_id')
                ->references('id')
                ->on('unit_members')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('unit_invites', function (Blueprint $table) {
            $table->dropForeign(['member_id']);
            $table->dropColumn('member_id');
        });
    }
};
