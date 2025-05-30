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
        Schema::dropIfExists('roadmap_user');
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::create('roadmap_user', function ($table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('roadmap_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'roadmap_id']);
        });
    }
};
