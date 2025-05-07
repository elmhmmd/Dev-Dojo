<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;

class OptionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin'])->except(['index']);
    }

    public function index($roadmapId, $nodeId, $quizId, $questionId)
    {
        $user = auth()->user();

        $question = Question::with('quiz.node.roadmap')
                            ->findOrFail($questionId);

        if ($user->role_id !== 1 && ! $question->quiz->node->roadmap->published) {
            return response()->json([
                'error' => 'You do not have access to these options'
            ], 403);
        }

        return response()->json(
            $question->options,
            200
        );
    }

    public function bulkSync(Request $request, $roadmapId, $nodeId, $quizId, $questionId)
    {
        $question = Question::findOrFail($questionId);

        $validated = $request->validate([
            'options' => 'required|array|size:4',
            'options.*.id' => 'nullable|exists:options,id',
            'options.*.body' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        $incoming = collect($validated['options']);

        if ($incoming->where('is_correct', true)->count() !== 1) {
            return response()->json(['error' => 'Exactly one option must be marked correct'], 422);
        }

        $existingIds = $question->options()->pluck('id')->all();
        $incomingIds = $incoming->pluck('id')->filter()->all();

        $toDelete = array_diff($existingIds, $incomingIds);
        if (!empty($toDelete)) {
            Option::whereIn('id', $toDelete)->delete();
        }

        $question->options()->update(['is_correct' => false]);

        $synced = [];
        foreach ($incoming as $opt) {
            if (isset($opt['id'])) {
                $option = Option::findOrFail($opt['id']);
                $option->update([
                    'body' => $opt['body'],
                    'is_correct' => $opt['is_correct'],
                ]);
            } else {
                $option = Option::create([
                    'question_id' => $questionId,
                    'body' => $opt['body'],
                    'is_correct' => $opt['is_correct'],
                ]);
            }
            $synced[] = $option;
        }

        $fresh = $question->options()->get();
        return response()->json($fresh);
    }

    public function destroy($roadmapId, $nodeId, $quizId, $questionId, $optionId)
    {
        $option = Option::findOrFail($optionId);
        $option->delete();

        return response()->json(['message' => 'Option deleted']);
    }
}