<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Node;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function store(Request $request, $roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);
        if ($node->project) {
            return response()->json(['error' => 'Node already has a project'], 422);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = Project::create([
            'node_id' => $nodeId,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($project, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json($project, 200);
    }

    public function destroy($roadmapId, $nodeId, $projectId)
    {
        $project = Project::findOrFail($projectId);
        $project->delete();

        return response()->json(['message' => 'Project deleted'], 200);
    }
}