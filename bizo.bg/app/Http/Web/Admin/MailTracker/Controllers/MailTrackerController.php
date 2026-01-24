<?php

namespace App\Http\Web\Admin\MailTracker\Controllers;

use Illuminate\Http\Request;
use jdavidbakr\MailTracker\AdminController;
use jdavidbakr\MailTracker\Model\SentEmail;

class MailTrackerController extends AdminController
{
    /**
     * Sent email search
     */
    public function postSearch(Request $request)
    {
        $searchInContent = $request->searchInContent;
        $searchInContent = ($searchInContent === 'on') ? 'checked' : '';

        session(['mail-tracker-searchInContent' => $searchInContent]);

        session(['mail-tracker-index-search' => $request->search]);
        session(['mail-tracker-recipient-search' => $request->searchRecipient]);
        session(['mail-tracker-subject-search' => $request->searchSubject]);

        return redirect(route('bizo_mailTracker_Index'));
    }

    /**
     * Clear search
     */
    public function clearSearch()
    {
        session(['mail-tracker-index-search' => null]);
        session(['mail-tracker-recipient-search' => null]);
        session(['mail-tracker-subject-search' => null]);
        if (! is_null(config('mail-tracker.search-date-start'))) {
            session(
                [
                    'mail-tracker-index-date-start' => now()
                        ->subDays(
                            config('mail-tracker.search-date-start')
                        )
                        ->toDateString(),
                ]
            );
            session(['mail-tracker-index-date-end' => now()->toDateString()]);
        }

        return redirect(route('bizo_mailTracker_Index'));
    }

    /**
     * Index.
     *
     * @return \Illuminate\Http\Response
     */
    public function getIndex()
    {
        $request = request();
        session(['mail-tracker-index-page' => $request->page]);
        $terms = [];
        $search = session('mail-tracker-index-search');
        $recipient = session('mail-tracker-recipient-search');
        $subject = session('mail-tracker-subject-search');

        $query = SentEmail::query();
        if ($recipient && $recipient !== '') {
            // array_push($terms, $recipient);
            $query->where(function ($q) use ($recipient) {
                $q->orWhere('recipient_email', 'like', '%' . $recipient . '%');
                $q->orWhere('recipient_name', 'like', '%' . $recipient . '%');
            });
        }
        if ($subject && $subject !== '') {
            // array_push($terms, $subject);
            $query->where('subject', 'like', '%' . $subject . '%');
        }

        if ($search && $search !== '') {
            // $searchArr = explode(" ",$search);
            // array_merge($terms, $searchArr);
            // array_push($terms, $search);
            $query->where('content', 'like', '%' . $search . '%');
        }


        $query->orderBy('created_at', 'desc');

        $emails = $query->paginate(config('mail-tracker.emails-per-page'));

        return \View('emailTrakingViews::index')->with('emails', $emails);
    }
}
