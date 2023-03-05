<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bill\StoreBillRequest;
use App\Http\Requests\Bills\UpdateUsersRequest;
use App\Models\Roles;
use Spatie\Permission\Models\Role;
use App\Models\Bills;
use App\Models\BillFields;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Exception;

class BillController extends Controller
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
        $role = Role::findById($role_id, null);

        if (!$role->hasPermissionTo('list users')) {
            return false;
        }
        if ($filters != null) {
            $phone = Bills::tablefilter($filters)->get();
        } else {
            $phone = Bills::get();
        }
        return ($phone);
    }
    public function data_with_id(Request $request, $bill_id)
    {

        $role_id = $request->header('roleId');
        $role = Role::findById($role_id, null);

        if (!$role->hasPermissionTo('list users')) {
            return false;
        }
        $phone = Bills::find($bill_id);

        return ($phone);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBillRequest $request)
    {
        $user = array();
        $payload = json_decode($request->getContent(), true);
        $fields_ids = array();
        $all_fields = $payload['fields'];

        foreach ($all_fields as $index => $field) {
            $BillFields = new BillFields;
            $BillFields->product_id = $field['product_id'];
            $BillFields->description = $field['description'];
            $BillFields->hsn_code = $field['hsn_code'];
            $BillFields->quantity = $field['quantity'];
            $BillFields->rate = $field['rate'];
            $BillFields->quantity_unit = $field['quantity_unit'];
            $BillFields->save();
            $fields_ids[$index] = $BillFields->id;
        }

        $fields_ids_str = implode(",", $fields_ids);
        $fields = array(
            'bill_date' => $payload['bill_date'],
            'bill_site' => $payload['bill_site'],
            'buyer_address' => $payload['buyer_address'],
            'buyer_name' => $payload['buyer_name'],
            'buyer_gst' => $payload['buyer_gst'],
            'fields_ids' => $fields_ids_str,
        );
        // $bill_create = new Bills;
        // $bill_create->bill_date = $payload['bill_date'];
        // $bill_create->bill_site = $payload['bill_site'];
        // $bill_create->buyer_address = $payload['buyer_address'];
        // $bill_create->buyer_gst = $payload['buyer_gst'];
        // $bill_create->fields_ids = $fields_ids;

        $user['data'] = Bills::create($fields);
        $user['success_message'] = "Bill has been created successfully.";

        return json_encode($user);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Bills  $users
     * @return \Illuminate\Http\Response
     */
    public function show($users, Request $request)
    {
        // $role_id = $request->header('roleId');

        // $role = Role::findById($role_id,null);

        // if(!$role->hasPermissionTo('edit users')){
        //     return false;
        // }

        $bills = Bills::find(intval($users));
        $bills_fields = explode(",", $bills->fields_ids);
        foreach ($bills_fields as $index => $bills_field_id) {
            $data = BillFields::find($bills_field_id);
            $array[$index] = $data;
            $bills->fields_ids = $array;
        }
        // dd($bills);
        // $users->email = base64_decode($users->email);

        return $bills;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Bills  $users
     * @return \Illuminate\Http\Response
     */
    public function update($users, UpdateUsersRequest $request)
    {
        $user = array();
        $payload = json_decode($request->getContent(), true);

        try {
            $user['data'] = Bills::find(intval($users))->update(['name' => $payload['user'], 'email' => base64_encode($payload['email']), 'roleId' => $payload['roleId']]);
            $user['success_message'] = $payload['user'] . " user has been updated.";
        } catch (Exception $e) {
            $user['error_message'] = "A users " . $payload['user'] . " already exists.";
        }

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Bills  $users
     * @return \Illuminate\Http\Response
     */
    public function destroy($users, Request $request)
    {
        $role_id = $request->header('roleId');

        $role = Role::findById($role_id, null);

        if (!$role->hasPermissionTo('delete users')) {
            return false;
        }
        return Bills::destroy(json_decode($users));
    }

    public function test(Request $request)
    {
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