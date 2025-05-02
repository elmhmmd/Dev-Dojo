<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectSubmissionUpvote extends Model
{
    protected $fillable = ['project_submission_id', 'student_id'];

    public function projectSubmission()
    {
        return $this->belongsTo(ProjectSubmission::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}