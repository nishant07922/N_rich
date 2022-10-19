<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Spatie\Permission\Contracts\Role;
// use Spatie\Permission\Models\Permission;

class RolesPermission extends Model
{
    use HasFactory;
    protected $table = 'role_has_permissions';
    protected $fillable = ['permission_id','role_id'];

    public function permission()
    {
        return $this->hasMany(Permission::class);
    }
    public function role()
    {
        return $this->hasMany(Role::class);
    }
}