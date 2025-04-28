<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['node_id', 'time_limit'];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function quizStatuses()
    {
        return $this->hasMany(QuizStatus::class);
    }
}