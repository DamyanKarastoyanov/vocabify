<?php

namespace App\Support;

use Spatie\Activitylog\LogOptions;

class ActivityLogHelper
{
    /**
     * Get LogOptions with project defaults applied.
     *
     * @return LogOptions
     */
    public static function defaults(): LogOptions
    {
        $config = config('activitylog.default_log_options', []);
        $options = LogOptions::defaults();

        if ($config['log_only_dirty'] ?? false) {
            $options->logOnlyDirty();
        }

        if ($config['dont_submit_empty_logs'] ?? false) {
            $options->dontSubmitEmptyLogs();
        }

        if ($config['log_fillable'] ?? false) {
            $options->logFillable();
        }

        if ($config['log_unguarded'] ?? false) {
            $options->logUnguarded();
        }

        if (isset($config['log_only']) && is_array($config['log_only'])) {
            $options->logOnly($config['log_only']);
        }

        if (!empty($config['log_except'])) {
            $options->logExcept($config['log_except']);
        }

        return $options;
    }
}
