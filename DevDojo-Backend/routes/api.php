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
    Route::post('roadmaps/{roadmap}/join', [StudentController::class, 'joinRoadmap']);
    Route::get('roadmaps/{roadmap}/unlocked-nodes', [StudentController::class, 'viewUnlockedNodes']);
    Route::post('roadmaps/{roadmap}/nodes/{node}/quiz/{quiz}/submit', [StudentController::class, 'takeQuiz']);
    Route::post('roadmaps/{roadmap}/nodes/{node}/project/{project}/submit', [StudentController::class, 'submitProject']);
    Route::post('roadmaps/{roadmap}/nodes/{node}/project/{project}/submissions/{submission}/upvote', [StudentController::class, 'upvoteSubmission']);

    Route::middleware('admin')->group(function () {
        Route::apiResource('roadmaps', RoadmapController::class)->except(['index']);
        Route::post('roadmaps/{roadmap}/publish', [RoadmapController::class, 'publish']);
        Route::prefix('roadmaps/{roadmap}')->group(function () {
            Route::post('nodes', [NodeController::class, 'store']);
            Route::put('nodes/{node}', [NodeController::class, 'update']);
            Route::delete('nodes/{node}', [NodeController::class, 'destroy']);
            Route::prefix('nodes/{node}')->group(function () {
                Route::post('quiz', [QuizController::class, 'store']);
                Route::put('quiz/{quiz}', [QuizController::class, 'update']);
                Route::delete('quiz/{quiz}', [QuizController::class, 'destroy']);
                Route::post('quiz/{quiz}/questions', [QuestionController::class, 'store']);
                Route::put('quiz/{quiz}/questions/{question}', [QuestionController::class, 'update']);
                Route::delete('quiz/{quiz}/questions/{question}', [QuestionController::class, 'destroy']);
                Route::post('quiz/{quiz}/questions/{question}/options', [OptionController::class, 'store']);
                Route::put('quiz/{quiz}/questions/{question}/options/{option}', [OptionController::class, 'update']);
                Route::delete('quiz/{quiz}/questions/{question}/options/{option}', [OptionController::class, 'destroy']);
                Route::post('project', [ProjectController::class, 'store']);
                Route::put('project/{project}', [ProjectController::class, 'update']);
                Route::delete('project/{project}', [ProjectController::class, 'destroy']);
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