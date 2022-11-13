<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRolesPermissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(Request $request)
    {
        $payload = json_decode($request->getContent(), true);
        $roleId = $request->header('roleId');
        $role = Role::findById($roleId,null);
        
        return $role->hasPermissionTo('edit rolespermission');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            //
        ];
    }
}
