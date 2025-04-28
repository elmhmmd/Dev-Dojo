<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quiz extends Model
{

    use HasFactory;

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