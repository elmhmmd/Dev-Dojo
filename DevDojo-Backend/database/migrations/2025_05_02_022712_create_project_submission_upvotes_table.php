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
        Schema::create('project_submission_upvotes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_submission_id');
            $table->unsignedBigInteger('student_id');
            $table->foreign('project_submission_id')->references('id')->on('project_submissions')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['project_submission_id', 'student_id'], "psu_submission_student_unique");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_submission_upvotes');
    }
};
