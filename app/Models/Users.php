<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Users extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'users';

    public function scopeTablefilter($query, $filters)
    {
        $name_search = json_decode($filters)->name_search;
        return $query->where('name', 'LIKE', '%' . $name_search . '%');
    }
    public function scopeRolePermission($query, $role_id)
    {
        if ($role_id == 1) {
            return $query->where('roleId', '>=', $role_id);
        } else {
            return $query->where('roleId', '>', $role_id);
        }
    }

    public function roles(): HasOne
    {
        return $this->hasOne(Roles::class, 'id','roleId');
    }
}
