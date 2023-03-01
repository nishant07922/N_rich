<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillFields extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'bill_fields';

}
