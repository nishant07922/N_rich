<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bills extends Model
{
    use HasFactory ,SoftDeletes;

    protected $table = 'bill';

    protected $fillable = ['bill_date','bill_site','buyer_address','buyer_gst','fields_ids'];
    public function scopeTablefilter($query, $filters)
    {
        $name_search = json_decode($filters)->name_search;
        return $query->where('buyer_address', 'LIKE', '%' . $name_search . '%');
    }
}
