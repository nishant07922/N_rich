<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\RolesPermission;
use App\Models\Models;
use App\Http\Requests\StoreRolesPermissionRequest;
use App\Http\Requests\UpdateRolesPermissionRequest;
use Spatie\Permission\Models\Permission;

class RolesPermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
     * @param  \App\Http\Requests\StoreRolesPermissionRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRolesPermissionRequest $request)
    {
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RolesPermission  $rolesPermission
     * @return \Illuminate\Http\Response
     */
    public function show($rolepermission, RolesPermission $rolesPermission)
    {
        $return_data = false;

        $Models_id = Permission::select('name', 'models_id')->distinct()->get();

        foreach ($Models_id as $model_id) {
            $permission_data = Permission::select('id', 'name')->where('models_id', $model_id->models_id)->get();
            foreach ($permission_data as $key => $per_data) {
                if (RolesPermission::where('role_id', $rolepermission)->where('permission_id', $per_data->id)->count() > 0) {
                    $permission_data[$key]['roleHasPermission'] = true;
                } else {
                    $permission_data[$key]['roleHasPermission'] = false;
                }
            }
            $return_data[Models::select('name')->find($model_id->models_id)->first()->name] = $permission_data;
        }
        return $return_data;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\RolesPermission  $rolesPermission
     * @return \Illuminate\Http\Response
     */
    public function edit(RolesPermission $rolesPermission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateRolesPermissionRequest  $request
     * @param  \App\Models\RolesPermission  $rolesPermission
     * @return \Illuminate\Http\Response
     */
    public function update($rolepermission, UpdateRolesPermissionRequest $request, RolesPermission $rolesPermission)
    {
        $return_arr = array();
        $payload = json_decode($request->getContent(), true);

        foreach ($payload['rolepermission'] as $data) {

            try {

                $count = RolesPermission::where('role_id', $rolepermission)->where('permission_id', $data['permission_id'])->count();
                if ($count > 0) {
                    if (!$data['isChecked']) {
                        $return_arr['data'] = RolesPermission::where('role_id', $rolepermission)->where('permission_id', $data['permission_id'])->delete();
                    }
                } else {
                    if ($data['isChecked']) {
                        $return_arr['data'] = RolesPermission::insert([
                            'role_id' => $rolepermission,
                            'permission_id' => $data['permission_id']
                        ]);
                    }
                }
                $return_arr['success_message'] = "Role Permissions has been updated.";
            } catch (Exception $e) {
                $return_arr['error_message'] = "Role Permisions has not been updated.";
            }
        }

        return $return_arr;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RolesPermission  $rolesPermission
     * @return \Illuminate\Http\Response
     */
    public function destroy(RolesPermission $rolesPermission)
    {
        //
    }
}
