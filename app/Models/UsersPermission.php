<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsersPermission extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $fillable = ['name','guard_name','created_at','updated_at'];

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
