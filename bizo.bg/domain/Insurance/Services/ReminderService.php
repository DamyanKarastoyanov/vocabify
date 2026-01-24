<?php

namespace Domain\Insurance\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

class ReminderService
{
    public function sendReminders(Collection $items, string $type, string $mailableClass, callable $recipientResolver)
    {
        foreach ($items as $item) {
            $recipients = collect($recipientResolver($item));

            if ($recipients->isEmpty()) {
                continue;
            }

            foreach ($recipients as $user) {
                Mail::to($user->email)->send(new $mailableClass($item, $user));
            }

            $item->reminders()->create([
                'type'    => $type,
                'sent_at' => now(),
            ]);
        }
    }

	/**
	 * Send digest reminders for a collection of items to a list of recipients,
	 * and mark each item as reminded with the given type.
	 *
	 * @param Collection<int, mixed> $items
	 * @param list<string> $emails
	 */
	public function sendGroupReminders(Collection $items, string $type, string $mailableClass, array $emails): void
	{
		if ($items->isEmpty() || empty($emails)) {
			return;
		}

		Mail::to($emails)->send(new $mailableClass($items));

		foreach ($items as $item) {
			$item->reminders()->create([
				'type'    => $type,
				'sent_at' => now(),
			]);
		}
	}
}
