<?php

namespace App\Http\Controllers;

use App\Models\Node;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use App\Models\Project;
use App\Models\KeyLearningObjective;
use App\Models\Resource;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function store(Request $request, $roadmapId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'icon' => 'nullable|string',
            'quiz' => 'required|array',
            'quiz.time_limit' => 'nullable|integer',
            'quiz.questions' => 'required|array|min:1',
            'quiz.questions.*.body' => 'required|string',
            'quiz.questions.*.options' => 'required|array|min:1|max:4',
            'quiz.questions.*.options.*.body' => 'required|string',
            'quiz.questions.*.options.*.is_correct' => 'required|boolean',
            'project' => 'required|array',
            'project.title' => 'required|string|max:255',
            'project.description' => 'nullable|string',
            'key_learning_objectives' => 'required|array|min:1',
            'key_learning_objectives.*.body' => 'required|string',
            'resources' => 'required|array|min:1',
            'resources.*.link' => 'required|url',
        ]);

        $node = Node::create([
            'roadmap_id' => $roadmapId,
            'title' => $validated['title'],
            'short_description' => $validated['short_description'],
            'long_description' => $validated['long_description'],
            'icon' => $validated['icon'],
        ]);

        // Create Quiz
        $quiz = Quiz::create([
            'node_id' => $node->id,
            'time_limit' => $validated['quiz']['time_limit'],
        ]);

        // Create Questions and Options
        foreach ($validated['quiz']['questions'] as $questionData) {
            $question = Question::create([
                'quiz_id' => $quiz->id,
                'body' => $questionData['body'],
            ]);

            foreach ($questionData['options'] as $optionData) {
                Option::create([
                    'question_id' => $question->id,
                    'body' => $optionData['body'],
                    'is_correct' => $optionData['is_correct'],
                ]);
            }
        }

        // Create Project
        Project::create([
            'node_id' => $node->id,
            'title' => $validated['project']['title'],
            'description' => $validated['project']['description'],
        ]);

        // Create Key Learning Objectives
        foreach ($validated['key_learning_objectives'] as $objective) {
            KeyLearningObjective::create([
                'node_id' => $node->id,
                'body' => $objective['body'],
            ]);
        }

        // Create Resources
        foreach ($validated['resources'] as $resource) {
            Resource::create([
                'node_id' => $node->id,
                'link' => $resource['link'],
            ]);
        }

        return response()->json(Node::with(['quiz.questions.options', 'project', 'keyLearningObjectives', 'resources'])->find($node->id), 201);
    }

    public function update(Request $request, $roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'icon' => 'nullable|string',
            'quiz' => 'required|array',
            'quiz.time_limit' => 'nullable|integer',
            'quiz.questions' => 'required|array|min:1',
            'quiz.questions.*.body' => 'required|string',
            'quiz.questions.*.options' => 'required|array|min:1|max:4',
            'quiz.questions.*.options.*.body' => 'required|string',
            'quiz.questions.*.options.*.is_correct' => 'required|boolean',
            'project' => 'required|array',
            'project.title' => 'required|string|max:255',
            'project.description' => 'nullable|string',
            'key_learning_objectives' => 'required|array|min:1',
            'key_learning_objectives.*.body' => 'required|string',
            'resources' => 'required|array|min:1',
            'resources.*.link' => 'required|url',
        ]);

        $node->update([
            'title' => $validated['title'],
            'short_description' => $validated['short_description'],
            'long_description' => $validated['long_description'],
            'icon' => $validated['icon'],
        ]);

        // Update Quiz
        $quiz = $node->quiz;
        $quiz->update(['time_limit' => $validated['quiz']['time_limit']]);

        // Delete existing questions and options
        $quiz->questions()->delete();
        foreach ($validated['quiz']['questions'] as $questionData) {
            $question = Question::create([
                'quiz_id' => $quiz->id,
                'body' => $questionData['body'],
            ]);

            foreach ($questionData['options'] as $optionData) {
                Option::create([
                    'question_id' => $question->id,
                    'body' => $optionData['body'],
                    'is_correct' => $optionData['is_correct'],
                ]);
            }
        }

        // Update Project
        $node->project->update([
            'title' => $validated['project']['title'],
            'description' => $validated['project']['description'],
        ]);

        // Delete and recreate Key Learning Objectives
        $node->keyLearningObjectives()->delete();
        foreach ($validated['key_learning_objectives'] as $objective) {
            KeyLearningObjective::create([
                'node_id' => $node->id,
                'body' => $objective['body'],
            ]);
        }

        // Delete and recreate Resources
        $node->resources()->delete();
        foreach ($validated['resources'] as $resource) {
            Resource::create([
                'node_id' => $node->id,
                'link' => $resource['link'],
            ]);
        }

        return response()->json(Node::with(['quiz.questions.options', 'project', 'keyLearningObjectives', 'resources'])->find($node->id));
    }

    public function destroy($roadmapId, $nodeId)
    {
        $node = Node::findOrFail($nodeId);
        $node->delete();

        return response()->json(['message' => 'Node deleted']);
    }
}