<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'images' => ['required', 'array', 'min:1'],
            'images.*' => [
                'required',
                'file',
                'mimetypes:image/jpeg,image/png,image/webp',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.max' => 'Cada imagen debe pesar como maximo 5 MB.',
            'images.*.mimes' => 'Solo se permiten imagenes jpg, jpeg, png o webp.',
            'images.*.mimetypes' => 'Solo se permiten imagenes validas.',
        ];
    }
}
