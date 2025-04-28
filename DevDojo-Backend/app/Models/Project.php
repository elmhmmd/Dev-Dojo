<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['node_id', 'title', 'description'];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }

    public function submissions()
    {
        return $this->hasMany(ProjectSubmission::class);
    }
}