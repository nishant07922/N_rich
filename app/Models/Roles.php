<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $fillable = ['name', 'guard_name', 'created_at', 'updated_at'];

    public function scopeTablefilter($query, $filters)
    {
        $name_search = json_decode($filters)->name_search;
        return $query->where('name', 'LIKE', '%' . $name_search . '%');
    }
    public function scopeRolePermission($query, $role_id)
    {
        if ($role_id == 1) {
            return $query->where('id', '>=', $role_id);
        } else {
            return $query->where('id', '>', $role_id);
        }
    }

    // public function users()
    // {
    //     return $this->belongsTo(Users::class);
    // }
}
