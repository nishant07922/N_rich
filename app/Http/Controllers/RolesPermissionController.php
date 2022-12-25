<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\RolesPermission;
use App\Models\Models;
use Spatie\Permission\Models\Role;
use App\Http\Requests\StoreRolesPermissionRequest;
use App\Http\Requests\UpdateRolesPermissionRequest;
use Spatie\Permission\Models\Permission;

class RolesPermissionController extends Controller
{

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RolesPermission  $rolesPermission
     * @return \Illuminate\Http\Response
     */
    public function show($rolepermission, RolesPermission $rolesPermission,Request $request)
    {
        $return_data = array();

        $roleId = $request->header('roleId');
        $role = Role::findById($roleId,null);
        
        if(!$role->hasPermissionTo('list rolespermission')){
            return false;
        }

        $Models_id = Permission::select( 'models_id')->groupBy('models_id')->get();
        

        foreach ($Models_id as $index=>$model_id) {
            $permission_data = Permission::select('id', 'name')->where('models_id', $model_id->models_id)->get();
            foreach ($permission_data as $key => $per_data) {
                if (RolesPermission::where('role_id', $rolepermission)->where('permission_id', $per_data->id)->count() > 0) {
                    $permission_data[$key]['roleHasPermission'] = true;
                } else {
                    $permission_data[$key]['roleHasPermission'] = false;
                }
            }
            $model_name = Models::find($model_id->models_id)->name;
            $return_data[$model_name] = $permission_data;
        }
        return $return_data;
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

}
