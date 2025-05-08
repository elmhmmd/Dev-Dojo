<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Node;
use Illuminate\Http\Request;

class ResourceController extends Controller
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
                'error' => 'You do not have access to these resources'
            ], 403);
        }

        $resources = Resource::where('node_id', $nodeId)->get();

        return response()->json($resources, 200);
    }

    public function store(Request $request, $roadmapId, $nodeId)
    {
        $validated = $request->validate([
            'link' => 'required|url',
        ]);

        $resource = Resource::create([
            'node_id' => $nodeId,
            'link' => $validated['link'],
        ]);

        return response()->json($resource, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId, $resourceId)
    {
        $resource = Resource::findOrFail($resourceId);

        $validated = $request->validate([
            'link' => 'required|url',
        ]);

        $resource->update($validated);

        return response()->json($resource, 200);
    }

    public function destroy($roadmapId, $nodeId, $resourceId)
    {
        $resource = Resource::findOrFail($resourceId);
        $resource->delete();

        return response()->json(['message' => 'Resource deleted'], 200);
    }
}