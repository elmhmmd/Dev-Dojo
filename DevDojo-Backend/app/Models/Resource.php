<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = ['node_id', 'link'];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }
}
