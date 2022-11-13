<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Users extends Model
{
    use HasFactory;
    protected $table = 'users';
    protected $fillable = ['name', 'email', 'roleId', 'password', 'created_at', 'updated_at'];

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
