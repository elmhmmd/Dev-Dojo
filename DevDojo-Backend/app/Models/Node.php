<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    protected $fillable = ['roadmap_id', 'title', 'short_description', 'long_description', 'icon'];

    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }

    public function project()
    {
        return $this->hasOne(Project::class);
    }

    public function keyLearningObjectives()
    {
        return $this->hasMany(KeyLearningObjective::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }
}