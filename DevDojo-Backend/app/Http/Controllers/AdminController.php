<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Roadmap;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin']);
    }

    public function statistics()
    {
        
        $totalStudents = User::where('role_id', 2)->count();

        
        $totalRoadmaps = Roadmap::count();

        
        $publishedRoadmaps = Roadmap::where('published', true)->count();
        $unpublishedRoadmaps = Roadmap::where('published', false)->count();

        return response()->json([
            'total_students' => $totalStudents,
            'total_roadmaps' => $totalRoadmaps,
            'published_roadmaps' => $publishedRoadmaps,
            'unpublished_roadmaps' => $unpublishedRoadmaps,
        ], 200);
    }
}