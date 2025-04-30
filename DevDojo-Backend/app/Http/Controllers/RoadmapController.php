<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use Illuminate\Http\Request;

class RoadmapController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function index()
    {

    $roadmaps = Roadmap::select('id', 'title')->get();

    return response()->json($roadmaps);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $roadmap = Roadmap::create([
            'title' => $validated['title'],
            'created_by' => auth()->id(),
        ]);

        return response()->json($roadmap, 201);
    }

    public function show($id)
    {
        $roadmap = Roadmap::with('nodes')->findOrFail($id);
        return response()->json($roadmap);
    }

    public function update(Request $request, $id)
    {
        $roadmap = Roadmap::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $roadmap->update($validated);

        return response()->json($roadmap);
    }

    public function destroy($id)
    {
        $roadmap = Roadmap::findOrFail($id);
        $roadmap->delete();

        return response()->json(['message' => 'Roadmap deleted']);
    }
}