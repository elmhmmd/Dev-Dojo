<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizStatus extends Model
{
    protected $fillable = ['student_id', 'quiz_id', 'passed'];

    protected $primaryKey = ['student_id', 'quiz_id'];

    public $incrementing = false;

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}