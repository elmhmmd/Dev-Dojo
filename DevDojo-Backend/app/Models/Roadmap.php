<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roadmap extends Model
{
    protected $fillable = ['title', 'created_by', 'published'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function nodes()
    {
        return $this->hasMany(Node::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'roadmap_user');
    }
}