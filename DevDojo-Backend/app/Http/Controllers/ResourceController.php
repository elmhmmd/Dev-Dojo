<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function index($roadmapId, $nodeId)
    {
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