<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Node;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function store(Request $request, $roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);
        if ($node->quiz) {
            return response()->json(['error' => 'Node already has a quiz'], 422);
        }

        $validated = $request->validate([
            'time_limit' => 'nullable|integer',
        ]);

        $quiz = Quiz::create([
            'node_id' => $nodeId,
            'time_limit' => $validated['time_limit'] ?? null,
        ]);

        return response()->json($quiz, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);

        $validated = $request->validate([
            'time_limit' => 'nullable|integer',
        ]);

        $quiz->update($validated);

        return response()->json($quiz);
    }

    public function destroy($roadmapId, $nodeId, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);
        $quiz->delete();

        return response()->json(['message' => 'Quiz deleted']);
    }
}