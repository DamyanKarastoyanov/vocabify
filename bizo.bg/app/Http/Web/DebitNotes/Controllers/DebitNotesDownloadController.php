<?php

namespace App\Http\Web\DebitNotes\Controllers;

use App\Http\Controllers\Controller;
use Domain\Payment\Models\DebitNote;
use Domain\Payment\Requests\DebitNoteDownloadRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class DebitNotesDownloadController extends Controller
{
    public function __invoke(DebitNoteDownloadRequest $request, DebitNote $debitNote)
    {
        $media = $debitNote->getFirstMedia(DebitNote::MEDIA_COLLECTION);

        $url = $request->url();
        if (Str::contains($url, 'view') === true) {
            $content = Storage::disk($media->disk)
                ->get($media->getPathRelativeToRoot(), $media->file_name);
            $response = Response::make($content, 200);
            $response->header('Content-Type', $media->mime_type);

            return $response;
        }

        return Storage::disk($media->disk)
            ->download($media->getPathRelativeToRoot(), $media->file_name);
    }
}
