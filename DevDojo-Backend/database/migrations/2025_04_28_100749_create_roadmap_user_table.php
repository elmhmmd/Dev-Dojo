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
        use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoadmapUserTable extends Migration
{
    public function up()
    {
        Schema::create('roadmap_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('roadmap_id')
                  ->constrained('roadmaps')
                  ->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'roadmap_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('roadmap_user');
    }
}

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmap_user');
    }
};
