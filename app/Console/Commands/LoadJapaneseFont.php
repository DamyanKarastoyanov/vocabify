<?php

namespace App\Console\Commands;

use FontLib\Font;
use Illuminate\Console\Command;

class LoadJapaneseFont extends Command
{
    protected $signature = 'dompdf:load-japanese-font';

    protected $description = 'Pre-load IPA Japanese font for Dompdf PDF generation';

    public function handle(): int
    {
        $fontDir = storage_path('fonts');
        $fontFile = $fontDir . DIRECTORY_SEPARATOR . 'ipag.ttf';
        $fontBase = $fontDir . DIRECTORY_SEPARATOR . 'ipag';

        if (!file_exists($fontFile)) {
            $this->error('Font file not found: ' . $fontFile);
            $this->info('Download ipag.ttf from https://moji.or.jp/ipafont/ and place it in storage/fonts/');
            return self::FAILURE;
        }

        $this->info('Loading font and generating metrics...');

        try {
            $font = Font::load($fontFile);
            $font->parse();
            $font->saveAdobeFontMetrics($fontBase . '.ufm');
            $font->close();
        } catch (\Throwable $e) {
            $this->error('Failed to process font: ' . $e->getMessage());
            return self::FAILURE;
        }

        $installedFontsPath = $fontDir . DIRECTORY_SEPARATOR . 'installed-fonts.json';
        $fonts = [];

        if (file_exists($installedFontsPath)) {
            $fonts = json_decode(file_get_contents($installedFontsPath), true) ?? [];
        }

        $fonts['ipag'] = [
            'normal' => 'ipag',
            'bold' => 'ipag',
            'italic' => 'ipag',
            'bold_italic' => 'ipag',
        ];

        file_put_contents($installedFontsPath, json_encode($fonts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->info('Japanese font (ipag) loaded successfully.');

        return self::SUCCESS;
    }
}
