<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function store(Request $request, $roadmapId, $nodeId, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);
        if ($quiz->questions->count() >= 10) {
            return response()->json(['error' => 'Quiz already has 10 questions'], 422);
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $question = Question::create([
            'quiz_id' => $quizId,
            'body' => $validated['body'],
        ]);

        return response()->json($question, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId, $quizId, $questionId)
    {
        $question = Question::findOrFail($questionId);

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $question->update($validated);

        return response()->json($question);
    }

    public function destroy($roadmapId, $nodeId, $quizId, $questionId)
    {
        $question = Question::findOrFail($questionId);
        $question->delete();

        return response()->json(['message' => 'Question deleted']);
    }
}