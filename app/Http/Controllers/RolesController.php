<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Http\Requests\Roles\StoreRolesRequest;
use App\Http\Requests\Roles\UpdateRolesRequest;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Exception;

class RolesController extends Controller
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

        return Roles::select('id', 'name', 'created_at', 'updated_at')
            ->tablefilter($filters)
            ->rolePermission($role_id)
            ->get();
    }

    public function selectroles()
    {
        $role_select = Roles::select('id', 'name')->get();
        return $role_select;
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRolesRequest $request)
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
     * @param  \App\Models\Roles  $roles
     * @return \Illuminate\Http\Response
     */
    public function show($roles, Roles $Roles, Request $request)
    {
        $role_id = $request->header('roleId');

        return Roles::select('id', 'name')
            ->rolePermission($role_id)
            ->find(intval($roles));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Roles  $roles
     * @return \Illuminate\Http\Response
     */
    public function edit(Roles $roles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Roles  $roles
     * @return \Illuminate\Http\Response
     */
    public function update($roles, StoreRolesRequest $request, Roles $Roles)
    {
        $role = array();
        $payload = json_decode($request->getContent(), true);

        try {
            $role['data'] = Roles::find(intval($roles))->update(['name' => $payload['role']]);
            $role['success_message'] = $payload['role'] . " role has been updated.";
        } catch (Exception $e) {
            $role['error_message'] = "A role " . $payload['role'] . " already exists.";
        }

        return $role;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Roles  $roles
     * @return \Illuminate\Http\Response
     */
    public function destroy($roles)
    {
        return Roles::destroy(json_decode($roles));
    }
}
