<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Сайтът е в поддръжка</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    :root{
      --bg-top:#0a2a3c;
      --bg-bottom:#092235;
      --text:#eaf2f8;
      --muted:#c9d6e2;
      --accent:#2ea0ff;
      --maxw:1100px;
      --radius:18px;
    }

    /* Базов reset */
    *,*::before,*::after{ box-sizing:border-box }
    html,body{ height:100% }
    body{
      margin:0;
      font:16px/1.5 "Segoe UI", Tahoma, system-ui, -apple-system, Arial, sans-serif;
      color:var(--text);
      background:
        radial-gradient(1200px 600px at 70% -10%, rgba(46,160,255,.10) 0%, rgba(46,160,255,0) 60%),
        radial-gradient(900px 500px at 10% 120%, rgba(21,94,117,.18) 0%, rgba(21,94,117,0) 60%),
        linear-gradient(180deg, var(--bg-top), var(--bg-bottom));
      min-height:100%;
    }

    /* Деликатен pattern като на лендинга */
    .pattern{
      position:fixed; inset:0; pointer-events:none; opacity:.12;
      background-image:
        radial-gradient(circle at 25% 50%, rgba(255,255,255,.14) 1px, transparent 1px),
        radial-gradient(circle at 75% 50%, rgba(255,255,255,.14) 1px, transparent 1px);
      background-size: 56px 24px, 56px 24px;
      mix-blend-mode: overlay;
    }

    .wrap{
      display:flex; align-items:center; justify-content:center;
      padding: clamp(24px, 5vw, 60px);
      min-height:100vh;
    }

    .card{
      width: min(100%, var(--maxw));
      display:grid;
      grid-template-columns: 1.1fr .9fr;
      gap: clamp(18px, 4vw, 48px);
      align-items:center;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: var(--radius);
      box-shadow: 0 20px 60px rgba(0,0,0,.35);
      backdrop-filter: blur(6px);
      padding: clamp(18px, 3.5vw, 40px);
    }
    @media (max-width: 900px){
      .card{ grid-template-columns: 1fr; text-align:center; }
    }

    h1{
      margin:0 0 .35em 0;
      font-weight:800;
      line-height:1.1;
      font-size: clamp(28px, 4.2vw, 52px);
      letter-spacing:.01em;
    }
    .lead{
      margin:0;
      color:var(--muted);
      font-size: clamp(16px, 2vw, 20px);
    }

    .hero{
      display:flex; align-items:flex-end; justify-content:center;
      min-height:280px;
      filter: drop-shadow(0 10px 28px rgba(0,0,0,.55));
    }
    .hero img{
      width:min(360px, 80%);
      height:auto;
      animation: floaty 4.5s ease-in-out infinite;
    }
    @keyframes floaty{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-6px) } }

    /* Малък индикатор за „работим“ */
    .status{
      display:flex; align-items:center; gap:10px;
      margin-top:16px; color:var(--muted); font-size:.95rem;
    }
    @media (max-width: 900px){ .status{ justify-content:center } }
    .dot{
      width:10px; height:10px; border-radius:999px; background:#fbbf24;
      box-shadow:0 0 0 0 rgba(251,191,36,.6);
      animation:pulse 1.8s infinite;
    }
    @keyframes pulse{
      0%{ box-shadow:0 0 0 0 rgba(251,191,36,.6) }
      70%{ box-shadow:0 0 0 12px rgba(251,191,36,0) }
      100%{ box-shadow:0 0 0 0 rgba(251,191,36,0) }
    }

    /* Дребни подобрения за достъпност */
    a{ color:var(--accent) }
    img{ display:block; }
  </style>
</head>
<body>
  <div class="pattern" aria-hidden="true"></div>

  <main class="wrap" role="main">
    <section class="card" role="document" aria-live="polite">
      <div>
        <h1>Нашият супергерой стяга сървърите 💪</h1>
        <p class="lead">
          Работим зад кулисите, за да подобрим услугата.
          Благодарим за търпението – ще бъдем онлайн съвсем скоро!
        </p>
        <div class="status">
          <span class="dot" aria-hidden="true"></span>
          <span>Системите се обновяват...</span>
        </div>
      </div>

      <figure class="hero">
        <img src="{{ asset('assets/maintenance.jpg') }}"
             alt="Хакер-бизон на компютър работи по системата">
      </figure>
    </section>
  </main>
</body>
</html>
