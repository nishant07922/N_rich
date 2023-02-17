<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsersPermission extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'roles';

    public function scopeTablefilter($query,$filters)
    {
        $name_search = json_decode($filters)->name_search;
        return $query->where('name', 'LIKE', '%'.$name_search.'%');
    }
    public function scopeRolePermission($query,$role_id)
    {
        return $query;
    }
}
