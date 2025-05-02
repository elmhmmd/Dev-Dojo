<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use App\Models\Node;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use App\Models\ProjectSubmission;
use App\Models\QuizStatus;
use App\Models\ProjectSubmissionUpvote;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('student');
    }

    public function joinRoadmap(Request $request, $roadmapId)
    {
        $user = auth()->user();
        $roadmap = Roadmap::where('published', true)->findOrFail($roadmapId);

        if ($user->roadmaps()->where('roadmap_id', $roadmapId)->exists()) {
            return response()->json(['error' => 'Already joined this roadmap'], 422);
        }

        $user->roadmaps()->attach($roadmapId);

        return response()->json(['message' => 'Joined roadmap successfully']);
    }

    public function viewUnlockedNodes($roadmapId)
    {
        $user = auth()->user();
        $roadmap = Roadmap::where('published', true)->findOrFail($roadmapId);

        if (!$user->roadmaps()->where('roadmap_id', $roadmapId)->exists()) {
            return response()->json(['error' => 'You must join the roadmap first'], 403);
        }

        $nodes = $roadmap->nodes()->orderBy('id')->get();
        $unlockedNodes = [];

        foreach ($nodes as $index => $node) {
            if ($index === 0) {
                // First node is always unlocked
                $unlockedNodes[] = $node;
            } else {
                // Check if previous node is completed
                $previousNode = $nodes[$index - 1];
                $quizPassed = QuizStatus::where('student_id', $user->id)
                    ->where('quiz_id', $previousNode->quiz->id)
                    ->where('passed', true)
                    ->exists();

                $projectSubmission = ProjectSubmission::where('student_id', $user->id)
                    ->where('project_id', $previousNode->project->id)
                    ->first();

                $projectApproved = $projectSubmission && $projectSubmission->score >= 5;

                if ($quizPassed && $projectApproved) {
                    $unlockedNodes[] = $node;
                }
            }
        }

        return response()->json($unlockedNodes);
    }

    public function takeQuiz(Request $request, $roadmapId, $nodeId, $quizId)
    {
        $user = auth()->user();
        $quiz = Quiz::findOrFail($quizId);
        $node = Node::findOrFail($nodeId);
        $roadmap = Roadmap::where('published', true)->findOrFail($roadmapId);

        // Verify node is unlocked
        $unlockedNodes = $this->viewUnlockedNodes($roadmapId)->getData();
        if (!collect($unlockedNodes)->pluck('id')->contains($nodeId)) {
            return response()->json(['error' => 'Node is not unlocked'], 403);
        }

        // Validate answers
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.option_id' => 'required|exists:options,id',
        ]);

        $correctAnswers = 0;
        foreach ($validated['answers'] as $answer) {
            $option = Option::find($answer['option_id']);
            if ($option && $option->question_id == $answer['question_id'] && $option->is_correct) {
                $correctAnswers++;
            }
        }

        $passed = $correctAnswers >= 7; // 70% passing threshold

        QuizStatus::updateOrCreate(
            ['student_id' => $user->id, 'quiz_id' => $quizId],
            ['passed' => $passed]
        );

        return response()->json([
            'message' => $passed ? 'Quiz passed' : 'Quiz failed',
            'score' => $correctAnswers,
            'passed' => $passed,
        ]);
    }

    public function submitProject(Request $request, $roadmapId, $nodeId, $projectId)
    {
        $user = auth()->user();
        $project = Project::findOrFail($projectId);
        $node = Node::findOrFail($nodeId);
        $roadmap = Roadmap::where('published', true)->findOrFail($roadmapId);

        // Verify node is unlocked
        $unlockedNodes = $this->viewUnlockedNodes($roadmapId)->getData();
        if (!collect($unlockedNodes)->pluck('id')->contains($nodeId)) {
            return response()->json(['error' => 'Node is not unlocked'], 403);
        }

        $validated = $request->validate([
            'link' => 'required|url',
        ]);

        $submission = ProjectSubmission::updateOrCreate(
            ['student_id' => $user->id, 'project_id' => $projectId],
            ['link' => $validated['link'], 'score' => 0]
        );

        return response()->json($submission, 201);
    }

    public function upvoteSubmission(Request $request, $roadmapId, $nodeId, $projectId, $submissionId)
    {
        $user = auth()->user();
        $submission = ProjectSubmission::findOrFail($submissionId);
        $project = Project::findOrFail($projectId);
        $node = Node::findOrFail($nodeId);
        $roadmap = Roadmap::where('published', true)->findOrFail($roadmapId);

        // Prevent self-upvoting
        if ($submission->student_id === $user->id) {
            return response()->json(['error' => 'Cannot upvote your own submission'], 422);
        }

        // Check if already upvoted
        if (ProjectSubmissionUpvote::where('project_submission_id', $submissionId)
            ->where('student_id', $user->id)
            ->exists()) {
            return response()->json(['error' => 'Already upvoted this submission'], 422);
        }

        // Create upvote
        ProjectSubmissionUpvote::create([
            'project_submission_id' => $submissionId,
            'student_id' => $user->id,
        ]);

        // Update score
        $submission->score = $submission->upvotes()->count();
        $submission->save();

        return response()->json(['message' => 'Upvote recorded', 'new_score' => $submission->score]);
    }
}