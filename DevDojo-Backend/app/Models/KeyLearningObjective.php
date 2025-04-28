<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KeyLearningObjective extends Model
{
    protected $fillable = ['node_id', 'body'];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }
}