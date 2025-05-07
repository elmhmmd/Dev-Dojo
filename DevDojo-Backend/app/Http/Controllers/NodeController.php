<?php

namespace App\Http\Controllers;

use App\Models\Node;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin'])->except(['index']);
    }

    public function index($roadmapId)
    {

    if (auth()->user()->role_id === 1) {
        
        $nodes = Node::where('roadmap_id', $roadmapId)->get();
    } else {
        
        $roadmap = Roadmap::where('published', true)->findOrFail($roadmapId);
        $nodes = $roadmap->nodes;
    }

    return response()->json($nodes, 200);
    
    }

    public function store(Request $request, $roadmapId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
        ]);

        $node = Node::create([
            'roadmap_id' => $roadmapId,
            'title' => $validated['title'],
            'short_description' => $validated['short_description'] ?? null,
            'long_description' => $validated['long_description'] ?? null,
            'completion' => 0,
        ]);

        return response()->json($node, 201);
    }

    public function update(Request $request, $roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
        ]);

        $node->update($validated);

        return response()->json($node, 200);
    }

    public function destroy($roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);
        $node->delete();

        return response()->json(['message' => 'Node deleted']);
    }
}