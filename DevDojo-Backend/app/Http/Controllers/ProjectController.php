<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Node;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin'])->except(['index']);
    }



    public function bulkSync(Request $request, $roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);

        $validated = $request->validate([
            'id' => 'sometimes|nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $id = $validated['id'] ?? null;

        if ($id) {
            $project = Project::findOrFail($validated['id']);
            $project->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
            ]);
        } else {
            if ($node->project) {
                $node->project->delete();
            }
            $project = Project::create([
                'node_id' => $nodeId,
                'title' => $validated['title'],
                'description' => $validated['description'],
            ]);
        }

        return response()->json($project, 200);
    }

    public function destroy($roadmapId, $nodeId, $projectId)
    {
        $project = Project::findOrFail($projectId);
        $project->delete();

        return response()->json(['message' => 'Project deleted'], 200);
    }
}