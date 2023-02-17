<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ModelCreatorController extends Controller
{
    public function store(Request $request)
    {
        $user = array();
        $payload = json_decode($request->getContent(), true);
        $fields = array(
            'name' => $payload['user'],
            'email' => base64_encode($payload['email']),
            'password' => md5($payload['password']),
            'roleId' => $payload['roleId']
        );
       
        $user['data'] = Users::create($fields);
        $user['success_message'] = $payload['user'] . " user has been created successfully.";
    
        return json_encode($user);
    }
}
