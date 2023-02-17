<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUsersRequest;
use App\Http\Requests\Users\UpdateUsersRequest;
use App\Models\Roles;
use Spatie\Permission\Models\Role;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Exception;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filters = $request->header('filters');
        $role_id = $request->header('roleId');
        $role = Role::findById($role_id,null);
        
        if(!$role->hasPermissionTo('list users')){
            return false;
        }
        $phone = Users::with('roles')->tablefilter($filters)->rolePermission($role_id)->get();
        return ($phone);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUsersRequest $request)
    {
        $user = array();
        $payload = json_decode($request->getContent(), true);
        $fields = array(
            'name' => $payload['user'],
            'email' => base64_encode($payload['email']),
            'password' => md5($payload['password']),
            'roleId' => $payload['roleId']
        );
        // try {
        $user['data'] = Users::create($fields);
        $user['success_message'] = $payload['user'] . " user has been created successfully.";
        // } catch (Exception $e) {
        //     $user['error_message'] = "A user " . $payload['user'] . " already exists.";
        // }
        return json_encode($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function show($users, Request $request)
    {
        $role_id = $request->header('roleId');
        
        $role = Role::findById($role_id,null);
        
        if(!$role->hasPermissionTo('edit users')){
            return false;
        }

        $users =  Users::select('id', 'name', 'email', 'roleId')
            ->rolePermission($role_id)
            ->find(intval($users));

        $users->email = base64_decode($users->email);

        return $users;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function update($users, UpdateUsersRequest $request)
    {
        $user = array();
        $payload = json_decode($request->getContent(), true);

        try {
            $user['data'] = Users::find(intval($users))->update(['name' => $payload['user'], 'email' => base64_encode($payload['email']), 'roleId' => $payload['roleId']]);
            $user['success_message'] = $payload['user'] . " user has been updated.";
        } catch (Exception $e) {
            $user['error_message'] = "A users " . $payload['user'] . " already exists.";
        }

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function destroy($users,Request $request)
    {
        $role_id = $request->header('roleId');

        $role = Role::findById($role_id,null);
        
        if(!$role->hasPermissionTo('delete users')){
            return false;
        }
        return Users::destroy(json_decode($users));
    }

    public function test(Request $request) {
        // prepare content
        $content = "Test Man \n";
    
        // file name that will be used in the download
        $fileName = "logs.txt";
    
        // use headers in order to generate the download
        $headers = [
          'Content-type' => 'text/plain', 
          'Content-Disposition' => sprintf('attachment; filename="%s"', $fileName),
          'Content-Length' => strlen($content)
        ];
    
        // make a response, with the content, a 200 response code and the headers
        return Response::make($content, 200, $headers);
    }
}
