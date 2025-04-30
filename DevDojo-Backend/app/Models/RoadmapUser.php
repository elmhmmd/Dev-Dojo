<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoadmapUser extends Model
{
    protected $table = 'roadmap_user';

    protected $fillable = ['user_id', 'roadmap_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }
}