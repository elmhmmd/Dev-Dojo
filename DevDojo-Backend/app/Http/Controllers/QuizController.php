<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Node;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin'])->except(['index']);
    }

    public function index($roadmapId, $nodeId)
    {
        $user = auth()->user();

        
        $node = Node::with('roadmap')->findOrFail($nodeId);

        
        if ($user->role_id !== 1 && ! $node->roadmap->published) {
            return response()->json([
                'error' => 'You do not have access to this quiz'
            ], 403);
        }

        $quiz = $node->quiz;

        return response()->json(
            $quiz ?: [],
            200
        );
    }

    public function bulkSync(Request $request, $roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);

        $validated = $request->validate([
            'id' => 'nullable|exists:quizzes,id',
            'time_limit' => 'nullable|integer',
        ]);

        $id = $validated['id'] ?? null;

        if ($id) {
            $quiz = Quiz::findOrFail($id);
            $quiz->update([
                'time_limit' => $validated['time_limit'],
            ]);
        } else {
            if ($node->quiz) {
                $node->quiz->delete();
            }
            $quiz = Quiz::create([
                'node_id' => $nodeId,
                'time_limit' => $validated['time_limit'],
            ]);
        }

        return response()->json($quiz, 200);
    }

    public function destroy($roadmapId, $nodeId, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);
        $quiz->delete();

        return response()->json(['message' => 'Quiz deleted']);
    }
}