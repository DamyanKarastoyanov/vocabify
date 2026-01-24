<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <title>{{ $title ?? 'Bizo' }}</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&family=Sora:wght@100..800&display=swap" rel="stylesheet">

    <style type="text/css">
        body,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        a,
        .cta,
        .cta a,
        .cta *,
        font,
        td,
        table,
        span,
        div,
        p {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        }

        .paragraph > * {
            word-break: break-word;
            overflow-wrap: break-word;
        }
        .paragraph {
            word-break: break-word;
            overflow-wrap: break-word;
        }   
        div.paragraph > *,
        div.paragraph > p > *,
        div.paragraph li,
        div.paragraph li > * {
            background-color: inherit !important;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif !important;
        }
        .paragraph > p > a {
            color: #1E9AFF;
            font-weight: 300;
            text-decoration: underline;
        }
        b,
        strong{
            font-weight: 600;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif !important;
        }
        .comment_component > .paragraph > * {
            font-size: inherit !important;
        }
        .comment_component > .paragraph > p {
            margin-block-end: 0;
            margin-block-start: 0;
        }
        @media screen and (max-width: 530px) {
            .footer-connected{
                font-size: 14px;
            }
        }
        @media screen and (max-width: 480px) {
            .title{
                font-size: 32px !important;
            }
        }
        @media screen and (max-width: 600px) {
            #main-container,
            #main-container[style],
            #main-container[bgcolor] {
                background-color: transparent !important;
            }
            .wrapper,
            .wrapper[style],
            .wrapper[bgcolor] {
                background-color: transparent !important;
            }
            #masthead,
            #masthead[style] {
                margin: 0 auto !important;
            }
        }
        @media screen and (max-width: 390px) {
            .title{
                font-size: 24px !important;
            }
            .logo{
                padding: 24px !important;
            }
            .footer{
                padding: 54px 10px 0px 10px !important;
            }
            .footer-useful-links-table{
                width: 100% !important;
            }
            .footer-useful-link{
                width: 50% !important;
            }
        }
    </style>

    @yield('headerScripts')

</head>
<body style="border: 0;margin: 0;padding: 0; color: #15151e;">
<div>
    <div id="main-container" style="background-color:#15151e" bgcolor="#15151e">
        <table id="email-container" dir="ltr" style="margin:0;padding:0" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody>
                <tr>
                    <td class="wrapper" style="padding:0 0px;background-color:#15151e;" bgcolor="#15151e" width="100%">
                        <table class="background-dark-mode" bgcolor="#FFFFFF" id="masthead" style="border-radius: 16px; margin: 0 auto; max-width:600px;padding:0" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr>
                                    <td style="padding: 48px 48px 40px 48px;">
                                            <table cellpadding="0" cellspacing="0" width="700" bgcolor="#143779" style="background: #FFFFFF; background: radial-gradient(circle at 90% 10%, #4896F2 -20%, #143779 100%); border-radius: 16px;">
                                                <tr>
                                                    <td width="20%" valign="middle" style="padding: 24px 0px 24px 32px;">
                                                        <img src="{{Config::get("app.url")}}/resources/mail/bizo-logo.png" alt="Bizo" style="display: block; border: 0; width:100px; height: auto;padding-right:20px;">
                                                    </td>
                                                    <td style="padding: 24px auto;">
                                                        <div style="width: 1px; height: 60px; background: rgba(255,255,255,0.3);"></div>
                                                    </td>

                                                    <td valign="middle" style="padding: 24px 5%;">
                                                        <p style="font-size: 16px; font-weight: 400; color: #ffffff; margin: 0; line-height: 1.5;">
                                                            Бързи и Изгодни<br><span>Застраховки Онлайн.</span>
                                                        </p>
                                                    </td>

                                                    <td width="25%" align="center" valign="top">
                                                    <img
                                                        src="{{ Config::get('app.url') }}/resources/mail/CaptainBizo_new.png"
                                                        alt="Captain Bizo"
                                                        width="110"
                                                        style="
                                                        display:block;
                                                        margin-top:-40px;      /* overflow above */
                                                        margin-bottom:-40px;   /* overflow below */
                                                        "
                                                    >
                                                    </td>
                                                </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="background-dark-mode" style="padding: 0 48px; padding-bottom: 40px; background: #FFFFFF;">
                                        @yield('content')
                                    </td>
                                </tr>

                                <tr>
                                    <td class="footer" style="padding: 0 48px; background: #FFFFFF; background-size: 100% auto; border-radius: 16px;" align="center" bgcolor="#FFFFFF">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; margin-bottom: 40px;">
                                            <tbody>
                                                <tr>
                                                    <td style="border-top: 2px solid #DBEEFF;" align="center"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                            <tbody>
                                                <tr>
                                                    <td style="padding: 0 8px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #B3E5FC; background-color: #ffffff;">
                                                            <tr>
                                                                <td align="center" valign="middle" style="width: 40px; height: 40px; padding: 0;">
                                                                    <a href="#" target="_blank" style="text-decoration: none;">
                                                                        <img src="{{Config::get("app.url")}}/resources/mail/instagram-fill.png" alt="Instagram" style="display: block; width: 24px; height: 24px; margin: 0 auto;" width="24" height="24">
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>

                                                    <td style="padding: 0 8px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #B3E5FC; background-color: #ffffff;">
                                                            <tr>
                                                                <td align="center" valign="middle" style="width: 40px; height: 40px; padding: 0;">
                                                                    <a href="#" target="_blank" style="text-decoration: none;">
                                                                        <img src="{{Config::get("app.url")}}/resources/mail/facebook-fill.png" alt="Facebook" style="display: block; width: 24px; height: 24px; margin: 0 auto;" width="24" height="24">
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>

                                                    <!-- LinkedIn icon - Note: PNG version (linkedin-fill.png) should be added to public/resources/mail/ for full Outlook compatibility -->
                                                    <td style="padding: 0 8px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #B3E5FC; background-color: #ffffff;">
                                                            <tr>
                                                                <td align="center" valign="middle" style="width: 40px; height: 40px; padding: 0;">
                                                                    <a href="#" target="_blank" style="text-decoration: none;">
                                                                        <img src="{{Config::get("app.url")}}/resources/mail/linked-in-fill.png" alt="Facebook" style="display: block; width: 24px; height: 24px; margin: 0 auto;" width="24" height="24">
                                                                   </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>

                                                    <!-- Twitter/X icon - Note: PNG version (twitter-fill.png or x-fill.png) should be added to public/resources/mail/ for full Outlook compatibility -->
                                                    <td style="padding: 0 8px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #B3E5FC; background-color: #ffffff;">
                                                            <tr>
                                                                <td align="center" valign="middle" style="width: 40px; height: 40px; padding: 0;">
                                                                    <a href="#" target="_blank" style="text-decoration: none;">
                                                                        <img src="{{Config::get("app.url")}}/resources/mail/x-fill.png" alt="Facebook" style="display: block; width: 24px; height: 24px; margin: 0 auto;" width="24" height="24">
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="footer-useful-links-table" align="center" border="0" cellpadding="0" cellspacing="0" width="300" style="width:100%; ">
                                            <tbody>
                                                <tr>
                                                    <td class="footer-useful-link" style="text-align: center" width="100%" align="center">
                                                        <p class="paragraph" dir="ltr" style="color:#BDBDBD; font-size:14px;font-weight:300;line-height:120%;text-align:center;">{{ config('app.copyright') }}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
