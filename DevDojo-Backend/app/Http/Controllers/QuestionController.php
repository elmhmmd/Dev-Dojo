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

    public function index($roadmapId, $nodeId, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);
        $questions = $quiz->questions;
        return response()->json($questions);
    }

    public function bulkSync(Request $request, $roadmapId, $nodeId, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);

        $validated = $request->validate([
            'questions' => 'required|array|size:10',
            'questions.*.id' => 'nullable|exists:questions,id',
            'questions.*.body' => 'required|string',
        ]);

        $incoming = collect($validated['questions']);
        $existingIds = $quiz->questions()->pluck('id')->all();
        $incomingIds = $incoming->pluck('id')->filter()->all();

        $toDelete = array_diff($existingIds, $incomingIds);
        if (!empty($toDelete)) {
            Question::whereIn('id', $toDelete)->delete();
        }

        $synced = [];
        foreach ($incoming as $question) {
            if (isset($question['id'])) {
                $q = Question::findOrFail($question['id']);
                $q->update(['body' => $question['body']]);
            } else {
                $q = Question::create([
                    'quiz_id' => $quizId,
                    'body' => $question['body'],
                ]);
            }
            $synced[] = $q;
        }

        $fresh = $quiz->questions()->get();
        return response()->json($fresh);
    }

    public function destroy($roadmapId, $nodeId, $quizId, $questionId)
    {
        $question = Question::findOrFail($questionId);
        $question->delete();

        return response()->json(['message' => 'Question deleted'], 200);
    }
}