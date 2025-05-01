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
        $resource = Resource::findOrFail($resourceId, 200);
        $resource->delete();

        return response()->json(['message' => 'Resource deleted']);
    }
}