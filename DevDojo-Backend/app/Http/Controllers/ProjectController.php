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



    public function destroy($roadmapId, $nodeId, $projectId)
    {
        $project = Project::findOrFail($projectId);
        $project->delete();

        return response()->json(['message' => 'Project deleted'], 200);
    }
}