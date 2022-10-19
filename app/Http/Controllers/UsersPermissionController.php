<?php

namespace App\Http\Controllers;

use App\Models\UsersPermission;
use App\Http\Requests\Storeusers_permissionRequest;
use App\Http\Requests\Updateusers_permissionRequest;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Exception;

class UsersPermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $role = Role::create(['name' => 'admin']);
        // return json_encode(Role::all());
        $filters = $request->header('filters');
        $role_id = $request->header('roleId');
        // $permission = Permission::create(['name' => 'add roles']);
        // $permission = Permission::create(['name' => 'edit roles']);
        // $permission = Permission::create(['name' => 'delete roles']);
        // $permission = Permission::create(['name' => 'list roles']);
        // $permission = Permission::create(['name' => 'publish roles']);

        return UsersPermission::select('id', 'name', 'created_at', 'updated_at')
            ->tablefilter($filters)
            ->rolePermission($role_id)
            ->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Storeusers_permissionRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Storeusers_permissionRequest $request)
    {
        $role = array();
        $payload = json_decode($request->getContent(), true);
        try {
            $role['data'] = Role::create(['name' => $payload['role']]);
            $role['success_message'] = $payload['role'] . " role has been created successfully.";
        } catch (Exception $e) {
            $role['error_message'] = "A role " . $payload['role'] . " already exists.";
        }
        return json_encode($role);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UsersPermission  $UsersPermission
     * @return \Illuminate\Http\Response
     */
    public function show($roles, UsersPermission $UsersPermission, Request $request)
    {
        $role_id = $request->header('roleId');

        return UsersPermission::select('id', 'name')
            ->rolePermission($role_id)
            ->find(intval($roles));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Updateusers_permissionRequest  $request
     * @param  \App\Models\UsersPermission  $UsersPermission
     * @return \Illuminate\Http\Response
     */
    public function update($roles, Updateusers_permissionRequest $request, UsersPermission $UsersPermission)
    {
        $role = array();
        $payload = json_decode($request->getContent(), true);

        try {
            $role['data'] = UsersPermission::find(intval($roles))->update(['name' => $payload['role']]);
            $role['success_message'] = $payload['role'] . " role has been updated.";
        } catch (Exception $e) {
            $role['error_message'] = "A role " . $payload['role'] . " already exists.";
        }

        return $role;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UsersPermission  $UsersPermission
     * @return \Illuminate\Http\Response
     */
    public function destroy(UsersPermission $UsersPermission)
    {
        //
    }
}