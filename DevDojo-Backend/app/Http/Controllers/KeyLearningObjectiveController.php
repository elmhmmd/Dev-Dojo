<?php

namespace App\Http\Controllers;

use App\Models\KeyLearningObjective;
use Illuminate\Http\Request;

class KeyLearningObjectiveController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function store(Request $request, $roadmapId, $nodeId)
    {
        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $objective = KeyLearningObjective::create([
            'node_id' => $nodeId,
            'body' => $validated['body'],
        ]);

        return response()->json($objective, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId, $objectiveId)
    {
        $objective = KeyLearningObjective::findOrFail($objectiveId);

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $objective->update($validated);

        return response()->json($objective, 200);
    }

    public function destroy($roadmapId, $nodeId, $objectiveId)
    {
        $objective = KeyLearningObjective::findOrFail($objectiveId);
        $objective->delete();

        return response()->json(['message' => 'Key learning objective deleted'], 200);
    }
}