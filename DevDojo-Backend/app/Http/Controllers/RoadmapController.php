<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use App\Models\Node;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use Illuminate\Http\Request;

class RoadmapController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');

        $this->middleware('admin')
             ->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        if (auth()->user()->role_id === 1) {
            $roadmaps = Roadmap::select('id', 'title', 'published')->get();
        } else {
            $roadmaps = Roadmap::select('id', 'title')->where('published', true)->get();
        }

        return response()->json($roadmaps, 200);
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

    public function index(Request $request)
    {
        if (auth()->user()->role_id === 1) {
            $roadmaps = Roadmap::select('id', 'title', 'published')->get();
        } else {
            $roadmaps = Roadmap::select('id', 'title')->where('published', true)->get();
        }

        return response()->json($roadmaps, 200);
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
    if (auth()->user()->role_id === 1) {
        $roadmap = Roadmap::with('nodes')->findOrFail($id);
    } else {
        $roadmap = Roadmap::with('nodes')
            ->where('published', true)
            ->findOrFail($id);
    }

    return response()->json($roadmap, 200);
}

    public function update(Request $request, $id)
    {
        $roadmap = Roadmap::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'published' => 'required|boolean',
        ]);

        $roadmap->update($validated);

        return response()->json($roadmap, 200);
    }

    public function destroy($id)
    {
        $roadmap = Roadmap::findOrFail($id);
        $roadmap->delete();

        return response()->json(['message' => 'Roadmap deleted'], 200);
    }

    public function publish($id)
    {
        $roadmap = Roadmap::findOrFail($id);

        
        foreach ($roadmap->nodes as $node) {
            
            if (!$node->quiz) {
                return response()->json(['error' => "Node {$node->id} is missing a quiz"], 422);
            }

            $questions = $node->quiz->questions;
            if ($questions->count() !== 10) {
                return response()->json(['error' => "Node {$node->id} quiz must have exactly 10 questions"], 422);
            }

            foreach ($questions as $question) {
                $options = $question->options;
                if ($options->count() !== 4) {
                    return response()->json(['error' => "Question {$question->id} in node {$node->id} must have exactly 4 options"], 422);
                }

                $correctOptions = $options->where('is_correct', true)->count();
                if ($correctOptions !== 1) {
                    return response()->json(['error' => "Question {$question->id} in node {$node->id} must have exactly one correct option"], 422);
                }
            }

            if (!$node->project) {
                return response()->json(['error' => "Node {$node->id} is missing a project"], 422);
            }

            if ($node->keyLearningObjectives->isEmpty()) {
                return response()->json(['error' => "Node {$node->id} must have at least one key learning objective"], 422);
            }

            if ($node->resources->isEmpty()) {
                return response()->json(['error' => "Node {$node->id} must have at least one resource"], 422);
            }
        }

        $roadmap->update(['published' => true]);

        return response()->json(['message' => 'Roadmap published successfully'], 200);
    }

    public function unpublish($id)
    {
        $roadmap = Roadmap::findOrFail($id);
        $roadmap->update(['published' => false]);

        return response()->json(['message' => 'Roadmap unpublished successfully']);
    }
}