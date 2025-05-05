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

    
    $existing = $question->options()->count();
    $toAdd    = $request->input('options', []);
    if ($existing + count($toAdd) > 4) {
        return response()->json(
            ['error' => 'Total options cannot exceed 4'],
            422
        );
    }

    
    $validated = $request->validate([
        'options'               => 'required|array|min:1|max:4',
        'options.*.body'        => 'required|string',
        'options.*.is_correct'  => 'required|boolean',
    ]);

    
    if (collect($validated['options'])->pluck('is_correct')->contains(true)) {
        $question->options()->update(['is_correct' => false]);
    }

    
    $created = [];
    foreach ($validated['options'] as $opt) {
        $created[] = Option::create([
            'question_id' => $questionId,
            'body'        => $opt['body'],
            'is_correct'  => $opt['is_correct'],
        ]);
    }

    return response()->json($created, 201);
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