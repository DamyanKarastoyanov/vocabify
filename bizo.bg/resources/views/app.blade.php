<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Prevent search engine indexing -->
        <meta name="robots" content="noindex, nofollow, nosnippet, noarchive, noimageindex">
        <meta name="googlebot" content="noindex, nofollow, nosnippet, noarchive, noimageindex">
        <meta name="bingbot" content="noindex, nofollow, nosnippet, noarchive, noimageindex">

        @php
            $seo = $page['props']['seo'] ?? [];
            $title = $seo['title'] ?? config('app.name', 'Bizo');
            $description = $seo['description'] ?? '';
            $keywords = $seo['keywords'] ?? '';
        @endphp

        <title inertia>{{ $title }}</title>
        
        @if($description)
            <meta name="description" content="{{ $description }}">
        @endif

        @if($keywords)
            <meta name="keywords" content="{{ $keywords }}">
        @endif

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/favicon-16x16.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Segoe UI:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        >
        <link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
