<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;

class OptionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function store(Request $request, $roadmapId, $nodeId, $quizId, $questionId)
    {
        $question = Question::findOrFail($questionId);
        if ($question->options->count() >= 4) {
            return response()->json(['error' => 'Question already has 4 options'], 422);
        }

        $validated = $request->validate([
            'body' => 'required|string',
            'is_correct' => 'required|boolean',
        ]);

        if ($validated['is_correct']) {
            $question->options()->update(['is_correct' => false]);
        }

        $option = Option::create([
            'question_id' => $questionId,
            'body' => $validated['body'],
            'is_correct' => $validated['is_correct'],
        ]);

        return response()->json($option, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId, $quizId, $questionId, $optionId)
    {
        $option = Option::findOrFail($optionId);

        $validated = $request->validate([
            'body' => 'required|string',
            'is_correct' => 'required|boolean',
        ]);

        if ($validated['is_correct']) {
            $question = $option->question;
            $question->options()->where('id', '!=', $optionId)->update(['is_correct' => false]);
        }

        $option->update($validated);

        return response()->json($option, 200);
    }

    public function destroy($roadmapId, $nodeId, $quizId, $questionId, $optionId)
    {
        $option = Option::findOrFail($optionId);
        $option->delete();

        return response()->json(['message' => 'Option deleted'],200);
    }
}