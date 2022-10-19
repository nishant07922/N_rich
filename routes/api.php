<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersPermissionController;
use App\Http\Controllers\RolesPermissionController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::group(['middleware'=>['auth:sanctum']],function(){
//     Route::get('test',function(){
//         return 'hello';
//     });
// });

// Route::get('test',[UsersPermissionController::class,'index']);
Route::post("user-signup",[UserController::class,'userSignUp']);
Route::post("user-login", [UserController::class,'userLogin']);
Route::get("user/{email}",[UserController::class,'userDetail'] );

Route::apiResource('roles', UsersPermissionController::class);
Route::apiResource('rolepermission', RolesPermissionController::class);