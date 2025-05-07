<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoadmapController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\OptionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\KeyLearningObjectiveController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('roadmaps', [RoadmapController::class, 'index']);
    Route::get('roadmaps/{roadmap}', [RoadmapController::class, 'show']);
    Route::get('roadmaps/{roadmap}/nodes', [NodeController::class, 'index']);
    Route::get('roadmaps/{roadmap}/nodes/{node}/quiz', [QuizController::class, 'index']);
    Route::get('roadmaps/{roadmap}/nodes/{node}/quiz/{quiz}/questions', [QuestionController::class, 'index']);
    Route::get('roadmaps/{roadmap}/nodes/{node}/quiz/{quiz}/questions/{question}/options', [OptionController::class, 'index']);
    Route::get('roadmaps/{roadmap}/nodes/{node}/project', [ProjectController::class, 'index']);
    Route::get('roadmaps/{roadmap}/nodes/{node}/key-learning-objectives', [KeyLearningObjectiveController::class, 'index']);
    Route::get('roadmaps/{roadmap}/nodes/{node}/resources', [ResourceController::class, 'index']);
    Route::post('roadmaps/{roadmap}/nodes/{node}/quiz/{quiz}/submit', [StudentController::class, 'takeQuiz']);
    Route::post('roadmaps/{roadmap}/nodes/{node}/project/{project}/submit', [StudentController::class, 'submitProject']);
    Route::post('roadmaps/{roadmap}/nodes/{node}/project/{project}/submissions/{submission}/upvote', [StudentController::class, 'upvoteSubmission']);
    Route::get('statistics', [StudentController::class, 'statistics']);
    Route::get('roadmaps/{roadmap}/progress', [StudentController::class, 'roadmapProgress']);

    Route::middleware('admin')->group(function () {
        Route::get('admin/statistics', [AdminController::class, 'statistics']);
        Route::post('roadmaps', [RoadmapController::class, 'store']);
        Route::put('roadmaps/{roadmap}', [RoadmapController::class, 'update']);
        Route::delete('roadmaps/{roadmap}', [RoadmapController::class, 'destroy']);
        Route::post('roadmaps/{roadmap}/publish', [RoadmapController::class, 'publish']);
        Route::post('roadmaps/{roadmap}/unpublish', [RoadmapController::class, 'unpublish']);
        Route::prefix('roadmaps/{roadmap}')->group(function () {
            Route::post('nodes', [NodeController::class, 'store']);
            Route::put('nodes/{node}', [NodeController::class, 'update']);
            Route::delete('nodes/{node}', [NodeController::class, 'destroy']);
            Route::prefix('nodes/{node}')->group(function () {
                Route::put('project', [ProjectController::class, 'bulkSync']);
                Route::delete('project/{project}', [ProjectController::class, 'destroy']);
                Route::put('quiz', [QuizController::class, 'bulkSync']);
                Route::delete('quiz/{quiz}', [QuizController::class, 'destroy']);
                Route::put('quiz/{quiz}/questions', [QuestionController::class, 'bulkSync']);
                Route::delete('quiz/{quiz}/questions/{question}', [QuestionController::class, 'destroy']);
                Route::put('quiz/{quiz}/questions/{question}/options', [OptionController::class, 'bulkSync']);
                Route::delete('quiz/{quiz}/questions/{question}/options/{option}', [OptionController::class, 'destroy']);
                Route::post('key-learning-objectives', [KeyLearningObjectiveController::class, 'store']);
                Route::put('key-learning-objectives/{objective}', [KeyLearningObjectiveController::class, 'update']);
                Route::delete('key-learning-objectives/{objective}', [KeyLearningObjectiveController::class, 'destroy']);
                Route::post('resources', [ResourceController::class, 'store']);
                Route::put('resources/{resource}', [ResourceController::class, 'update']);
                Route::delete('resources/{resource}', [ResourceController::class, 'destroy']);
            });
        });
    });
});