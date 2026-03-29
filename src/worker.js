// app.blackroad.io — The Front Door
// A: Landing + Login  B: Auth gate  C: Dashboard  D: Agents  E: Chat
// BlackRoad OS, Inc. All rights reserved.

// Use workers.dev URLs to avoid CF same-zone fetch issues
const AUTH_URL = 'https://auth-blackroad.blackroad.workers.dev';
const ROUNDTRIP_URL = 'https://roadtrip-blackroad.blackroad.workers.dev';
const CHAT_URL = 'https://chat-blackroad.blackroad.workers.dev';
const SEARCH_URL = 'https://road-search.blackroad.workers.dev';
const FLEET_URL = 'https://status-blackroad.blackroad.workers.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // Auth — proxy signin/signup to real auth worker
    if (path === '/auth/signin' && request.method === 'POST') {
      try {
        const res = await fetch(AUTH_URL + '/api/signin', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: await request.text(), redirect: 'manual',
        });
        const data = await res.json();
        return Response.json(data, { headers: cors });
      } catch (e) { return Response.json({ error: e.message }, { status: 502, headers: cors }); }
    }
    if (path === '/auth/signup' && request.method === 'POST') {
      try {
        const res = await fetch(AUTH_URL + '/api/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: await request.text(), redirect: 'manual',
        });
        const data = await res.json();
        return Response.json(data, { headers: cors });
      } catch (e) { return Response.json({ error: e.message }, { status: 502, headers: cors }); }
    }
    if (path === '/auth/me' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) return Response.json({ error: 'No token' }, { status: 401, headers: cors });
      try {
        const res = await fetch(AUTH_URL + '/api/me', {
          headers: { 'Authorization': authHeader }, redirect: 'manual',
        });
        const data = await res.json();
        return Response.json(data, { headers: cors });
      } catch (e) { return Response.json({ error: e.message }, { status: 502, headers: cors }); }
    }

    // KPIs — proxy to status worker
    if (path === '/api/kpis') {
      try {
        const res = await fetch(FLEET_URL + '/api/kpis', { redirect: 'manual' });
        const data = await res.json();
        return Response.json(data, { headers: cors });
      } catch (e) { return Response.json({ error: e.message }, { status: 502, headers: cors }); }
    }

    // Proxy to roundtrip agents
    if (path.startsWith('/agents/')) {
      const agentPath = path.replace('/agents', '');
      try {
        const res = await fetch(ROUNDTRIP_URL + agentPath, {
          method: request.method,
          headers: { 'Content-Type': 'application/json' },
          body: request.method !== 'GET' ? await request.text() : undefined,
        });
        return new Response(await res.text(), { headers: { ...cors, 'Content-Type': 'application/json' } });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 502, headers: cors });
      }
    }

    // Health
    if (path === '/api/health') {
      return Response.json({ status: 'up', service: 'app.blackroad.io', version: '1.0.0' }, { headers: cors });
    }

    // SSE notifications stream
    if (path === '/api/notifications') {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();
      const write = (data) => writer.write(encoder.encode('data: ' + JSON.stringify(data) + '\\n\\n'));

      // Send initial connection event
      write({ type: 'connected', ts: new Date().toISOString() });

      // Fetch latest agent messages as notifications
      try {
        const res = await fetch(ROUNDTRIP_URL + '/api/messages?channel=general&limit=3');
        const msgs = await res.json();
        for (const m of (msgs || []).slice(0, 3)) {
          write({ type: 'agent_message', agent: m.sender || m.sender_name, content: (m.content || '').slice(0, 100), ts: m.created_at });
        }
      } catch {}

      // Fetch fleet status
      try {
        const res = await fetch(FLEET_URL + '/api/kpis');
        const d = await res.json();
        write({ type: 'kpi_update', agents: d.summary?.agents, nodes: d.summary?.fleet_nodes, sites_up: d.collected?.sites?.up });
      } catch {}

      write({ type: 'done' });
      writer.close();

      return new Response(readable, {
        headers: { ...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
      });
    }

    // PWA manifest
    if (path === '/manifest.json') {
      return Response.json({ name: 'BlackRoad OS', short_name: 'BlackRoad', start_url: '/', display: 'standalone', background_color: '#000000', theme_color: '#FF2255', icons: [{ src: 'https://images.blackroad.io/pixel-art/road-logo.png', sizes: '192x192', type: 'image/png' }, { src: 'https://images.blackroad.io/pixel-art/road-logo.png', sizes: '512x512', type: 'image/png' }] }, { headers: { ...cors, 'Content-Type': 'application/manifest+json' } });
    }

    // SSE notifications stream
    if (path === '/api/notifications/stream') {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send initial connection event
          controller.enqueue(encoder.encode('event: connected\ndata: {"status":"connected"}\n\n'));
          // Poll RoadTrip for new messages every 10s (up to 60s total)
          for (let i = 0; i < 6; i++) {
            await new Promise(r => setTimeout(r, 10000));
            try {
              const res = await fetch('https://roadtrip-blackroad.blackroad.workers.dev/api/messages?channel=general&limit=1');
              const msgs = await res.json();
              if (msgs.length > 0) {
                controller.enqueue(encoder.encode('event: message\ndata: ' + JSON.stringify(msgs[0]) + '\n\n'));
              }
            } catch {}
          }
          controller.close();
        }
      });
      return new Response(stream, { headers: { ...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' } });
    }

    // Service worker
    if (path === '/sw.js') {
      return new Response("self.addEventListener('install',e=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(clients.claim()));self.addEventListener('fetch',e=>{});", { headers: { 'Content-Type': 'application/javascript', ...cors } });
    }

    // Serve the app
    return new Response(renderApp(), { headers: { 'Content-Type': 'text/html;charset=utf-8', ...cors } });
  }
};

function renderApp() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BlackRoad OS</title>
<meta name="description" content="Your device. Your data. Your agents. Pick up your agent. Ride the BlackRoad together.">
<link rel="icon" href="https://images.blackroad.io/pixel-art/road-logo.png">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#FF2255">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--g:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);--g135:linear-gradient(135deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);--bg:#000;--card:#0a0a0a;--elevated:#111;--border:#1a1a1a;--white:#fff;--black:#000;--sg:'Space Grotesk',sans-serif;--jb:'JetBrains Mono',monospace;--inter:'Inter',sans-serif}
body{background:var(--bg);color:var(--white);font-family:var(--sg);min-height:100vh;overflow-x:hidden}
.grad-bar{height:4px;background:var(--g);position:fixed;top:0;left:0;right:0;z-index:999}

/* ═══ LOGIN VIEW ═══ */
.login-view{min-height:100vh;display:flex;flex-direction:column}
.auth-layout{flex:1;display:grid;grid-template-columns:1fr 1fr}
.auth-form-side{display:flex;align-items:center;justify-content:center;padding:48px}
.auth-form-wrap{width:100%;max-width:380px}
.auth-logo{font-weight:700;font-size:22px;display:flex;align-items:center;gap:10px;margin-bottom:48px}
.auth-logo-mark{width:28px;height:4px;border-radius:2px;background:var(--g)}
.auth-form-wrap h1{font-size:28px;font-weight:700;margin-bottom:8px}
.auth-form-wrap .subtitle{font-size:14px;opacity:.4;margin-bottom:36px}
.form-group{margin-bottom:20px}
.form-label{display:block;font-size:12px;font-weight:600;opacity:.6;margin-bottom:6px}
.form-input{width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--white);font-size:14px;font-family:var(--sg);outline:none;transition:border-color .2s}
.form-input:focus{border-color:#333}
.form-input::placeholder{opacity:.2}
.btn-auth{width:100%;padding:12px;border:none;border-radius:6px;background:var(--white);color:var(--black);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sg);margin-top:8px}
.btn-auth:hover{opacity:.9}
.auth-footer{text-align:center;margin-top:32px;font-size:13px;opacity:.4}
.auth-visual-side{border-left:1px solid var(--border);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.auth-orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:.12}
.auth-orb-1{width:500px;height:500px;background:#FF2255;top:-100px;left:-100px}
.auth-orb-2{width:400px;height:400px;background:#4488FF;bottom:-50px;right:-50px}
.auth-orb-3{width:300px;height:300px;background:#8844FF;top:30%;left:30%}
.auth-visual-content{position:relative;text-align:center;padding:48px;max-width:400px}
.auth-visual-content h2{font-size:28px;font-weight:700;margin-bottom:16px}
.auth-visual-content p{font-size:14px;opacity:.5;line-height:1.7}

/* ═══ DASHBOARD VIEW ═══ */
.dashboard-view{display:none;height:100vh;display:none;grid-template-columns:220px 1fr 320px;grid-template-rows:52px 1fr}
.dashboard-view.active{display:grid}
.login-view.hidden{display:none}

/* Topbar */
.topbar{grid-column:1/-1;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:16px}
.topbar-logo{font-weight:700;font-size:16px;display:flex;align-items:center;gap:8px}
.topbar-mark{width:20px;height:3px;border-radius:2px;background:var(--g)}
.topbar-search{flex:1;max-width:400px;margin:0 auto}
.topbar-search input{width:100%;padding:8px 14px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--white);font-size:13px;font-family:var(--sg);outline:none}
.topbar-search input:focus{border-color:#333}
.topbar-user{font-size:13px;opacity:.5;display:flex;align-items:center;gap:8px}
.topbar-dot{width:8px;height:8px;border-radius:50%;background:#4ade80}

/* Sidebar */
.sidebar{background:var(--card);border-right:1px solid var(--border);padding:12px 0;overflow-y:auto}
.side-section{padding:4px 12px;margin-bottom:8px}
.side-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:.3;padding:8px 0 4px;font-weight:600}
.side-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:13px;opacity:.6;transition:all .15s}
.side-item:hover{background:var(--elevated);opacity:.9}
.side-item.active{background:var(--elevated);opacity:1}
.side-icon{width:16px;text-align:center;font-size:14px}

/* Main content */
.main{overflow-y:auto;padding:24px}
.main h2{font-size:20px;font-weight:700;margin-bottom:16px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:16px}
.stat-label{font-size:11px;opacity:.4;text-transform:uppercase;letter-spacing:.5px}
.stat-value{font-size:24px;font-weight:700;margin-top:4px;font-family:var(--jb)}
.stat-sub{font-size:11px;opacity:.3;margin-top:2px}

/* Agent grid */
.agent-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:12px}
.agent-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px;cursor:pointer;transition:border-color .15s;text-align:center}
.agent-card:hover{border-color:#333}
.agent-emoji{font-size:20px}
.agent-name{font-size:12px;font-weight:600;margin-top:4px}
.agent-role{font-size:10px;opacity:.3}

/* Fleet strip */
.fleet-strip{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
.fleet-node{display:flex;align-items:center;gap:6px;padding:6px 12px;background:var(--card);border:1px solid var(--border);border-radius:6px;font-size:12px}
.fleet-dot{width:6px;height:6px;border-radius:50%}

/* Right panel — Chat */
.chat-panel{background:var(--card);border-left:1px solid var(--border);display:flex;flex-direction:column}
.chat-header{padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600}
.chat-frame{flex:1;border:none;width:100%}
.chat-input-area{padding:10px;border-top:1px solid var(--border);display:flex;gap:6px}
.chat-input-area input{flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--white);font-size:13px;font-family:var(--sg);outline:none}
.chat-input-area button{background:var(--white);color:var(--black);border:none;padding:8px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer}

/* Responsive */
@media(max-width:768px){
  .auth-layout{grid-template-columns:1fr}
  .auth-visual-side{display:none}
  .auth-form-side{padding:32px 20px}
  .dashboard-view.active{grid-template-columns:1fr;grid-template-rows:52px 1fr}
  .sidebar{display:none;position:fixed;top:52px;left:0;bottom:0;width:240px;z-index:100;background:var(--card);border-right:1px solid var(--border)}
  .sidebar.mobile-open{display:block}
  .chat-panel{display:none}
  .mobile-menu-btn{display:block!important}
  .topbar-search{max-width:200px}
}
</style>
</head>
<body><style id="br-nav-style">#br-nav{position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #1a1a1a;font-family:'Space Grotesk',-apple-system,sans-serif}#br-nav .ni{max-width:1200px;margin:0 auto;padding:0 20px;height:48px;display:flex;align-items:center;justify-content:space-between}#br-nav .nl{display:flex;align-items:center;gap:12px}#br-nav .nb{color:#666;font-size:12px;padding:6px 8px;border-radius:6px;display:flex;align-items:center;cursor:pointer;border:none;background:none;transition:color .15s}#br-nav .nb:hover{color:#f5f5f5}#br-nav .nh{text-decoration:none;display:flex;align-items:center;gap:8px}#br-nav .nm{display:flex;gap:2px}#br-nav .nm span{width:6px;height:6px;border-radius:50%}#br-nav .nt{color:#f5f5f5;font-weight:600;font-size:14px}#br-nav .ns{color:#333;font-size:14px}#br-nav .np{color:#999;font-size:13px}#br-nav .nk{display:flex;align-items:center;gap:4px;overflow-x:auto;scrollbar-width:none}#br-nav .nk::-webkit-scrollbar{display:none}#br-nav .nk a{color:#888;text-decoration:none;font-size:12px;padding:6px 10px;border-radius:6px;white-space:nowrap;transition:color .15s,background .15s}#br-nav .nk a:hover{color:#f5f5f5;background:#111}#br-nav .nk a.ac{color:#f5f5f5;background:#1a1a1a}#br-nav .mm{display:none;background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:6px}#br-dd{display:none;position:fixed;top:48px;left:0;right:0;background:rgba(0,0,0,0.96);backdrop-filter:blur(12px);border-bottom:1px solid #1a1a1a;z-index:9998;padding:12px 20px}#br-dd.open{display:flex;flex-wrap:wrap;gap:4px}#br-dd a{color:#888;text-decoration:none;font-size:13px;padding:8px 14px;border-radius:6px;transition:color .15s,background .15s}#br-dd a:hover,#br-dd a.ac{color:#f5f5f5;background:#111}body{padding-top:48px!important}@media(max-width:768px){#br-nav .nk{display:none}#br-nav .mm{display:block}}</style><nav id="br-nav"><div class="ni"><div class="nl"><button class="nb" onclick="history.length>1?history.back():location.href='https://blackroad.io'" title="Back">&larr;</button><a href="https://blackroad.io" class="nh"><div class="nm"><span style="background:#FF6B2B"></span><span style="background:#FF2255"></span><span style="background:#CC00AA"></span><span style="background:#8844FF"></span><span style="background:#4488FF"></span><span style="background:#00D4FF"></span></div><span class="nt">BlackRoad</span></a><span class="ns">/</span><span class="np">Dashboard</span></div><div class="nk"><a href="https://blackroad.io">Home</a><a href="https://chat.blackroad.io">Chat</a><a href="https://search.blackroad.io">Search</a><a href="https://tutor.blackroad.io">Tutor</a><a href="https://pay.blackroad.io">Pay</a><a href="https://canvas.blackroad.io">Canvas</a><a href="https://cadence.blackroad.io">Cadence</a><a href="https://video.blackroad.io">Video</a><a href="https://radio.blackroad.io">Radio</a><a href="https://game.blackroad.io">Game</a><a href="https://roundtrip.blackroad.io">Agents</a><a href="https://roadcode.blackroad.io">RoadCode</a><a href="https://hq.blackroad.io">HQ</a><a href="https://app.blackroad.io" class="ac">Dashboard</a></div><button class="mm" onclick="document.getElementById('br-dd').classList.toggle('open')">&#9776;</button></div></nav><div id="br-dd"><a href="https://blackroad.io">Home</a><a href="https://chat.blackroad.io">Chat</a><a href="https://search.blackroad.io">Search</a><a href="https://tutor.blackroad.io">Tutor</a><a href="https://pay.blackroad.io">Pay</a><a href="https://canvas.blackroad.io">Canvas</a><a href="https://cadence.blackroad.io">Cadence</a><a href="https://video.blackroad.io">Video</a><a href="https://radio.blackroad.io">Radio</a><a href="https://game.blackroad.io">Game</a><a href="https://roundtrip.blackroad.io">Agents</a><a href="https://roadcode.blackroad.io">RoadCode</a><a href="https://hq.blackroad.io">HQ</a><a href="https://app.blackroad.io" class="ac">Dashboard</a></div><script>document.addEventListener('click',function(e){var d=document.getElementById('br-dd');if(d&&d.classList.contains('open')&&!e.target.closest('#br-nav')&&!e.target.closest('#br-dd'))d.classList.remove('open')});</script>
<div class="grad-bar"></div>

<!-- ═══ A: LOGIN ═══ -->
<div class="login-view" id="loginView">
<div class="auth-layout">
  <div class="auth-form-side">
    <div class="auth-form-wrap">
      <div class="auth-logo"><div class="auth-logo-mark"></div>BlackRoad</div>
      <h1>Sign in</h1>
      <p class="subtitle">Your device. Your data. Your agents.</p>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" id="loginEmail" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input class="form-input" type="password" id="loginPass" placeholder="Enter password">
      </div>
      <button class="btn-auth" onclick="doLogin()">Sign in</button>
      <p style="text-align:center;margin-top:12px;font-size:13px;opacity:.4">No account? <a href="#" onclick="doSignup();return false" style="color:#fff;text-decoration:underline">Sign up</a></p>
      <p class="auth-footer">Pick up your agent. Ride the BlackRoad together.</p>
    </div>
  </div>
  <div class="auth-visual-side">
    <div class="auth-orb auth-orb-1"></div>
    <div class="auth-orb auth-orb-2"></div>
    <div class="auth-orb auth-orb-3"></div>
    <div class="auth-visual-content">
      <h2>Remember the Road. Pave Tomorrow.</h2>
      <p>18 agents. 7 nodes. 52 TOPS. 1,339 repos. Your entire AI fleet, in one place.</p>
    </div>
  </div>
</div>
</div>

<!-- ═══ C: DASHBOARD ═══ -->
<div class="dashboard-view" id="dashView">
  <!-- Topbar -->
  <div class="topbar">
    <div class="topbar-logo"><div class="topbar-mark"></div>BlackRoad</div>
    <div class="topbar-search"><input placeholder="Search everything..." id="searchInput" onkeydown="if(event.key==='Enter')doSearch()"></div>
    <button class="mobile-menu-btn" style="display:none;background:none;border:none;color:#fff;font-size:20px;cursor:pointer" onclick="document.querySelector('.sidebar').classList.toggle('mobile-open')">&#9776;</button>
    <div class="topbar-user"><div class="topbar-dot"></div><span id="userName">User</span> <span onclick="doLogout()" style="cursor:pointer;opacity:.3;margin-left:8px;font-size:11px">[logout]</span></div>
  </div>

  <!-- Sidebar -->
  <div class="sidebar">
    <div class="side-section">
      <div class="side-label">Workspace</div>
      <div class="side-item active" onclick="showPanel('overview')"><span class="side-icon">~</span> Overview</div>
      <div class="side-item" onclick="showPanel('agents')"><span class="side-icon">></span> Agents</div>
      <div class="side-item" onclick="showPanel('fleet')"><span class="side-icon">#</span> Fleet</div>
      <div class="side-item" onclick="showPanel('code')"><span class="side-icon">/</span> Code</div>
    </div>
    <div class="side-section">
      <div class="side-label">Tools</div>
      <div class="side-item" onclick="showPanel('search')"><span class="side-icon">?</span> Search</div>
      <div class="side-item" onclick="showPanel('vision')"><span class="side-icon">@</span> Vision</div>
      <div class="side-item" onclick="showPanel('notifications')"><span class="side-icon">!</span> Alerts</div>
      <div class="side-item" onclick="showPanel('billing')"><span class="side-icon">$</span> Billing</div>
      <div class="side-item" onclick="showPanel('settings')"><span class="side-icon">%</span> Settings</div>
      <div class="side-item" onclick="showPanel('admin')"><span class="side-icon">*</span> Admin</div>
    </div>
    <div class="side-section">
      <div class="side-label">Fleet Nodes</div>
      <div id="sideFleet"></div>
    </div>
  </div>

  <!-- Main -->
  <div class="main" id="mainContent">
    <!-- D: Overview with agents -->
    <div id="panel-overview">
      <h2>Welcome back</h2>
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
        <button onclick="window.open('https://chat.blackroad.io','_blank')" style="padding:10px 18px;border:1px solid var(--border);border-radius:8px;background:transparent;color:var(--white);font-size:13px;font-family:var(--sg);cursor:pointer;transition:border-color .15s" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='var(--border)'">New Chat</button>
        <button onclick="showPanel('search');document.getElementById('searchBox').focus()" style="padding:10px 18px;border:1px solid var(--border);border-radius:8px;background:transparent;color:var(--white);font-size:13px;font-family:var(--sg);cursor:pointer;transition:border-color .15s" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='var(--border)'">Search</button>
        <button onclick="showPanel('fleet')" style="padding:10px 18px;border:1px solid var(--border);border-radius:8px;background:transparent;color:var(--white);font-size:13px;font-family:var(--sg);cursor:pointer;transition:border-color .15s" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='var(--border)'">View Fleet</button>
        <button onclick="showPanel('agents')" style="padding:10px 18px;border:1px solid var(--border);border-radius:8px;background:transparent;color:var(--white);font-size:13px;font-family:var(--sg);cursor:pointer;transition:border-color .15s" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='var(--border)'">All Agents</button>
      </div>
      <div class="grid-3">
        <div class="stat-card"><div class="stat-label">Agents</div><div class="stat-value" id="statAgents">--</div><div class="stat-sub">fleet-wide</div></div>
        <div class="stat-card"><div class="stat-label">Nodes</div><div class="stat-value" id="statNodes">--</div><div class="stat-sub">online right now</div></div>
        <div class="stat-card"><div class="stat-label">Vision</div><div class="stat-value">52</div><div class="stat-sub">TOPS (Hailo-8 x2)</div></div>
      </div>
      <h2>Fleet</h2>
      <div class="fleet-strip" id="fleetStrip"></div>
      <h2 style="margin-top:24px">Recent Activity</h2>
      <div id="activityFeed" style="margin-bottom:24px"><div style="opacity:.3;font-size:13px">Loading activity...</div></div>
      <h2>Agents</h2>
      <div class="agent-grid" id="agentGrid"></div>
    </div>

    <div id="panel-agents" style="display:none">
      <h2>All Agents</h2>
      <div class="agent-grid" id="agentGridFull"></div>
    </div>

    <div id="panel-fleet" style="display:none">
      <h2>Fleet Map</h2>
      <div id="fleetMap" style="position:relative;height:300px;background:#050510;border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden"></div>
      <h3 style="margin-bottom:8px">Node Details</h3>
      <div id="fleetDetail" class="grid-3"></div>
    </div>

    <div id="panel-notifications" style="display:none">
      <h2>Notifications</h2>
      <div id="notifList" style="max-height:500px;overflow-y:auto"></div>
    </div>

    <div id="panel-search" style="display:none">
      <h2>Search</h2>
      <input class="form-input" style="max-width:500px;margin-bottom:16px" placeholder="Search all BlackRoad content..." id="searchBox" onkeydown="if(event.key==='Enter')doSearch()">
      <div id="searchResults"></div>
    </div>

    <div id="panel-vision" style="display:none">
      <h2>Hailo-8 Vision</h2>
      <p style="opacity:.4;font-size:14px;margin-bottom:16px">26 TOPS object detection across Cecilia + Octavia</p>
      <div class="grid-3" id="hailoModels"></div>
    </div>

    <div id="panel-code" style="display:none"><h2>Code</h2><p style="opacity:.4">1,339 repos across GitHub + Gitea</p><iframe src="https://git.blackroad.io" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;margin-top:12px"></iframe></div>
    <div id="panel-billing" style="display:none"><h2>Billing</h2><p style="opacity:.4">RoadPay — 4 plans</p></div>

    <div id="panel-admin" style="display:none">
      <h2>Admin Panel</h2>
      <div class="grid-3" style="margin-top:12px">
        <div class="stat-card"><div class="stat-label">Workers</div><div class="stat-value" id="adminWorkers">496</div></div>
        <div class="stat-card"><div class="stat-label">D1 Databases</div><div class="stat-value">34</div></div>
        <div class="stat-card"><div class="stat-label">KV Namespaces</div><div class="stat-value">20</div></div>
        <div class="stat-card"><div class="stat-label">R2 Buckets</div><div class="stat-value">13</div></div>
        <div class="stat-card"><div class="stat-label">Domains</div><div class="stat-value">20</div></div>
        <div class="stat-card"><div class="stat-label">GitHub Orgs</div><div class="stat-value">37</div></div>
      </div>
      <h3 style="margin-top:24px;margin-bottom:8px">Products</h3>
      <div id="adminProducts" class="grid-3"></div>
      <h3 style="margin-top:24px;margin-bottom:8px">Quick Actions</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-auth" style="width:auto;padding:8px 16px;font-size:12px" onclick="window.open('https://dash.cloudflare.com','_blank')">CF Dashboard</button>
        <button class="btn-auth" style="width:auto;padding:8px 16px;font-size:12px" onclick="window.open('https://dashboard.stripe.com','_blank')">Stripe</button>
        <button class="btn-auth" style="width:auto;padding:8px 16px;font-size:12px" onclick="window.open('https://dashboard.clerk.com','_blank')">Clerk</button>
        <button class="btn-auth" style="width:auto;padding:8px 16px;font-size:12px" onclick="window.open('https://github.com/orgs/BlackRoadOS','_blank')">GitHub</button>
      </div>
    </div>

    <div id="panel-settings" style="display:none">
      <h2>Settings</h2>
      <div style="max-width:500px">
        <div style="margin-bottom:24px">
          <div style="font-size:12px;opacity:.4;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Display Name</div>
          <input class="form-input" id="settingsName" placeholder="Your name">
        </div>
        <div style="margin-bottom:24px">
          <div style="font-size:12px;opacity:.4;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Default AI Model</div>
          <select class="form-input" id="settingsModel" style="cursor:pointer">
            <option value="fleet">BlackRoad Fleet (local Ollama)</option>
            <option value="cf-llama">Cloudflare Llama 3.1 8B</option>
            <option value="openai">OpenAI GPT-4o-mini (bring key)</option>
            <option value="anthropic">Anthropic Claude (bring key)</option>
            <option value="grok">xAI Grok (bring key)</option>
          </select>
        </div>
        <div style="margin-bottom:24px">
          <div style="font-size:12px;opacity:.4;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">API Key (for external models)</div>
          <input class="form-input" id="settingsApiKey" type="password" placeholder="sk-... or key-...">
        </div>
        <div style="margin-bottom:24px">
          <div style="font-size:12px;opacity:.4;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Theme</div>
          <div style="display:flex;gap:8px">
            <button onclick="setTheme('dark')" style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:#000;color:#fff;cursor:pointer;font-family:var(--sg)">Dark</button>
            <button onclick="setTheme('midnight')" style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:#0a0a1a;color:#8888ff;cursor:pointer;font-family:var(--sg)">Midnight</button>
            <button onclick="setTheme('ember')" style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:#1a0a0a;color:#FF6B2B;cursor:pointer;font-family:var(--sg)">Ember</button>
          </div>
        </div>
        <button onclick="saveSettings()" style="padding:12px 24px;border:none;border-radius:8px;background:#fff;color:#000;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sg)">Save Settings</button>
        <span id="settingsSaved" style="margin-left:12px;font-size:13px;opacity:0;transition:opacity .3s">Saved</span>
      </div>
    </div>
  </div>

  <!-- Notification toasts -->
  <div id="notifArea" style="position:fixed;top:60px;right:20px;z-index:9998;display:flex;flex-direction:column;gap:8px;max-width:320px"></div>

  <!-- E: Chat panel -->
  <div class="chat-panel">
    <div class="chat-header">Chat with Agents</div>
    <iframe class="chat-frame" src="https://chat.blackroad.io" id="chatFrame"></iframe>
  </div>
</div>

<script>
// ═══ B: AUTH (real) ═══
var authToken = localStorage.getItem('br_token');
var authUser = JSON.parse(localStorage.getItem('br_user') || 'null');

async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  if (!email || !pass) return;
  const btn = document.querySelector('.btn-auth');
  btn.textContent = 'Signing in...'; btn.disabled = true;
  try {
    const r = await fetch('/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email, password: pass}) });
    const d = await r.json();
    if (d.token) {
      authToken = d.token;
      authUser = d.user || { email, name: email.split('@')[0] };
      localStorage.setItem('br_token', authToken);
      localStorage.setItem('br_user', JSON.stringify(authUser));
      enterDashboard();
    } else {
      btn.textContent = d.error || 'Invalid credentials';
      setTimeout(() => { btn.textContent = 'Sign in'; btn.disabled = false; }, 2000);
    }
  } catch(e) {
    btn.textContent = 'Connection error';
    setTimeout(() => { btn.textContent = 'Sign in'; btn.disabled = false; }, 2000);
  }
}

async function doSignup() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  if (!email || !pass) return;
  try {
    const r = await fetch('/auth/signup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email, password: pass, name: email.split('@')[0]}) });
    const d = await r.json();
    if (d.token) {
      authToken = d.token;
      authUser = d.user || { email, name: email.split('@')[0] };
      localStorage.setItem('br_token', authToken);
      localStorage.setItem('br_user', JSON.stringify(authUser));
      enterDashboard();
    } else {
      alert(d.error || 'Signup failed');
    }
  } catch(e) { alert('Connection error'); }
}

function doLogout() {
  localStorage.removeItem('br_token');
  localStorage.removeItem('br_user');
  authToken = null; authUser = null;
  document.getElementById('dashView').classList.remove('active');
  document.getElementById('loginView').classList.remove('hidden');
}

function enterDashboard() {
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('dashView').classList.add('active');
  document.getElementById('userName').textContent = (authUser && authUser.name) || 'User';
  loadKPIs();
  loadAgents();
  loadFleet();
  loadHailo();
  loadActivity();
  startNotifications();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
  if (!localStorage.getItem('br_onboarded')) showOnboarding();
}

function showOnboarding() {
  const steps = [
    {title:'Welcome to BlackRoad OS',desc:'Your sovereign AI operating system. 18 agents, 7 nodes, 1,339 repos. Everything runs on your infrastructure.'},
    {title:'Meet Your Agents',desc:'Each agent has a role — Alice runs the gateway, Cecilia handles AI, Octavia manages DevOps. Click any agent to chat directly.'},
    {title:'Try Searching',desc:'Search across all BlackRoad content, repos, and docs. Type anything in the search bar above.'}
  ];
  let step = 0;
  const overlay = document.createElement('div');
  overlay.id = 'onboardOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center';
  function render() {
    const s = steps[step];
    const isLast = step === steps.length - 1;
    overlay.innerHTML = '<div style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:48px;max-width:460px;text-align:center">'
      + '<div style="font-size:11px;opacity:.4;margin-bottom:12px">Step ' + (step+1) + ' of ' + steps.length + '</div>'
      + '<h2 style="font-size:24px;font-weight:700;margin-bottom:12px">' + s.title + '</h2>'
      + '<p style="font-size:14px;opacity:.5;line-height:1.7;margin-bottom:32px">' + s.desc + '</p>'
      + '<button onclick="' + (isLast ? 'localStorage.setItem(\\'br_onboarded\\',\\'1\\');document.getElementById(\\'onboardOverlay\\').remove()' : 'nextOnboard()') + '" style="padding:12px 32px;border:none;border-radius:8px;background:#fff;color:#000;font-size:14px;font-weight:600;cursor:pointer;font-family:Space Grotesk,sans-serif">' + (isLast ? 'Get Started' : 'Next') + '</button></div>';
  }
  window.nextOnboard = function() { step++; render(); };
  render();
  document.body.appendChild(overlay);
}

async function loadKPIs() {
  try {
    const r = await fetch('/api/kpis');
    const d = await r.json();
    const s = d.summary || {};
    if (s.agents) document.getElementById('statAgents').textContent = s.agents;
    if (s.fleet_nodes) document.getElementById('statNodes').textContent = s.fleet_nodes + '/7';
  } catch {}
}

// Auto-login if token exists
if (authToken) enterDashboard();

// ═══ ACTIVITY FEED ═══
async function loadActivity() {
  try {
    const res = await fetch('https://roadtrip-blackroad.blackroad.workers.dev/api/messages?channel=general&limit=8');
    const msgs = await res.json();
    const feed = document.getElementById('activityFeed');
    if (!msgs.length) { feed.innerHTML = '<div style="opacity:.3;font-size:13px">No recent activity</div>'; return; }
    feed.innerHTML = msgs.map(function(m) {
      var time = m.created_at ? new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
      var sender = m.sender || m.agent || 'unknown';
      return '<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">'
        + '<div style="width:28px;height:28px;border-radius:50%;background:var(--elevated);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0">' + sender[0].toUpperCase() + '</div>'
        + '<div style="min-width:0"><div style="font-size:12px;font-weight:600">' + sender + ' <span style="opacity:.3;font-weight:400">' + time + '</span></div>'
        + '<div style="font-size:12px;opacity:.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:400px">' + (m.content || '').slice(0, 120) + '</div></div></div>';
    }).join('');
  } catch(e) { document.getElementById('activityFeed').innerHTML = '<div style="opacity:.3;font-size:13px">Activity unavailable</div>'; }
}

// ═══ NOTIFICATIONS (SSE) ═══
function startNotifications() {
  try {
    var es = new EventSource('/api/notifications');
    es.onmessage = function(e) {
      try {
        var d = JSON.parse(e.data);
        if (d.type === 'agent_message') showNotif(d.agent + ': ' + d.content);
        if (d.type === 'kpi_update' && d.sites_up) showNotif('Fleet: ' + d.nodes + ' nodes, ' + d.sites_up + ' sites up');
        if (d.type === 'done') es.close();
      } catch(err) {}
    };
    es.onerror = function() { es.close(); };
  } catch(err) {}
}
function showNotif(text) {
  var area = document.getElementById('notifArea');
  var el = document.createElement('div');
  el.style.cssText = 'background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:12px;opacity:0;transition:opacity .3s;box-shadow:0 4px 12px rgba(0,0,0,.3)';
  el.textContent = text;
  area.appendChild(el);
  setTimeout(function() { el.style.opacity = '1'; }, 50);
  setTimeout(function() { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 300); }, 5000);
}

// ═══ D: AGENTS ═══
async function loadAgents() {
  try {
    const res = await fetch('/agents/api/agents');
    const agents = await res.json();
    const grid = document.getElementById('agentGrid');
    const gridFull = document.getElementById('agentGridFull');
    const html = agents.slice(0, 24).map(a =>
      '<div class="agent-card" onclick="chatAgent(\\'' + a.id + '\\')">' +
      '<div class="agent-emoji">' + a.emoji + '</div>' +
      '<div class="agent-name">' + a.name + '</div>' +
      '<div class="agent-role">' + a.role + '</div></div>'
    ).join('');
    const htmlFull = agents.map(a =>
      '<div class="agent-card" onclick="chatAgent(\\'' + a.id + '\\')">' +
      '<div class="agent-emoji">' + a.emoji + '</div>' +
      '<div class="agent-name">' + a.name + '</div>' +
      '<div class="agent-role">' + a.role + '</div></div>'
    ).join('');
    grid.innerHTML = html;
    gridFull.innerHTML = htmlFull;
    document.getElementById('statAgents').textContent = agents.length;
  } catch {}
}

function chatAgent(id) {
  document.getElementById('chatFrame').src = 'https://roundtrip.blackroad.io#agent=' + id;
}

// ═══ F: FLEET ═══
async function loadFleet() {
  // Get real agent status from RoadTrip heartbeat API
  try {
    const res = await fetch('https://roadtrip.blackroad.io/api/agents');
    const agents = await res.json();
    const fleet = agents.filter(a => a.type === 'compute');
    const strip = document.getElementById('fleetStrip');
    const side = document.getElementById('sideFleet');
    const online = fleet.filter(a => a.online).length;
    strip.innerHTML = fleet.map(a => {
      const color = a.online ? '#4ade80' : '#666';
      return '<div class="fleet-node"><div class="fleet-dot" style="background:' + color + '"></div>' + a.name + ' <span style="opacity:.3;font-size:10px">' + a.role.split(' ')[0] + '</span></div>';
    }).join('');
    side.innerHTML = fleet.map(a => {
      const color = a.online ? '#4ade80' : '#444';
      return '<div class="side-item"><span class="side-icon" style="color:' + color + ';font-size:8px">*</span> ' + a.name + (a.online ? '' : ' <span style="opacity:.2;font-size:10px">off</span>') + '</div>';
    }).join('');
    document.getElementById('statNodes').textContent = online + '/' + fleet.length;
  } catch {
    document.getElementById('fleetStrip').innerHTML = '<span style="opacity:.3">Fleet unavailable</span>';
  }
}

// ═══ G: HAILO ═══
async function loadHailo() {
  try {
    const res = await fetch('/agents/api/hailo/models');
    const data = await res.json();
    const el = document.getElementById('hailoModels');
    el.innerHTML = Object.entries(data.models || {}).map(([name, info]) =>
      '<div class="stat-card"><div class="stat-label">' + name + '</div><div class="stat-value" style="font-size:16px">' + info.desc + '</div><div class="stat-sub">' + (info.available ? 'Ready' : 'Offline') + '</div></div>'
    ).join('');
  } catch {}
}

// Panel switching
function showPanel(name) {
  document.querySelectorAll('[id^="panel-"]').forEach(el => el.style.display = 'none');
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.style.display = '';
  document.querySelectorAll('.side-item').forEach(el => el.classList.remove('active'));
  event?.target?.closest?.('.side-item')?.classList.add('active');
}

function doSearch() {
  const q = document.getElementById('searchBox')?.value || document.getElementById('searchInput')?.value;
  if (!q) return;
  showPanel('search');
  document.getElementById('searchBox').value = q;
  document.getElementById('searchResults').innerHTML = '<p style="opacity:.4">Searching...</p>';
  fetch('https://search.blackroad.io/api/search?q=' + encodeURIComponent(q))
    .then(r => r.json())
    .then(d => {
      const results = d.results || d.items || [];
      if (!results.length) { document.getElementById('searchResults').innerHTML = '<p style="opacity:.4">No results for "' + q + '"</p>'; return; }
      document.getElementById('searchResults').innerHTML = '<p style="opacity:.4;font-size:12px;margin-bottom:12px">' + results.length + ' results in ' + (d.latency_ms || '?') + 'ms</p>' + results.map(r =>
        '<div class="stat-card" style="margin-bottom:8px;cursor:pointer;display:flex;gap:12px;align-items:flex-start" onclick="window.open(\\'' + (r.url||'#') + '\\',\\'_blank\\')">' +
        (r.image ? '<img src="' + r.image + '" style="width:48px;height:48px;border-radius:6px;object-fit:cover;flex-shrink:0" onerror="this.style.display=\\'none\\'">' : '') +
        '<div><div class="stat-label">' + (r.domain || '') + '</div>' +
        '<div style="font-size:14px;font-weight:600;margin-top:4px">' + (r.title || 'Result') + '</div>' +
        '<p style="margin-top:4px;font-size:12px;opacity:.5;line-height:1.5">' + (r.description || r.snippet || '').slice(0,200) + '</p></div></div>'
      ).join('');
    })
    .catch(() => { document.getElementById('searchResults').innerHTML = '<p style="opacity:.4">Search unavailable</p>'; });
}

// ═══ H: SETTINGS ═══
function loadSettings() {
  var s = JSON.parse(localStorage.getItem('br_settings') || '{}');
  if (s.name) document.getElementById('settingsName').value = s.name;
  if (s.model) document.getElementById('settingsModel').value = s.model;
  if (s.apiKey) document.getElementById('settingsApiKey').value = s.apiKey;
  if (s.theme) setTheme(s.theme, true);
}
function saveSettings() {
  var s = {
    name: document.getElementById('settingsName').value,
    model: document.getElementById('settingsModel').value,
    apiKey: document.getElementById('settingsApiKey').value,
    theme: localStorage.getItem('br_theme') || 'dark'
  };
  localStorage.setItem('br_settings', JSON.stringify(s));
  if (s.name && authUser) { authUser.name = s.name; localStorage.setItem('br_user', JSON.stringify(authUser)); document.getElementById('userName').textContent = s.name; }
  var el = document.getElementById('settingsSaved');
  el.style.opacity = '1'; setTimeout(function(){ el.style.opacity = '0'; }, 2000);
}
function setTheme(t, quiet) {
  localStorage.setItem('br_theme', t);
  var r = document.documentElement.style;
  if (t === 'midnight') { r.setProperty('--bg','#050510'); r.setProperty('--card','#0a0a1a'); r.setProperty('--border','#1a1a2a'); r.setProperty('--elevated','#10102a'); }
  else if (t === 'ember') { r.setProperty('--bg','#0a0500'); r.setProperty('--card','#1a0a0a'); r.setProperty('--border','#2a1a1a'); r.setProperty('--elevated','#2a1510'); }
  else { r.setProperty('--bg','#000'); r.setProperty('--card','#0a0a0a'); r.setProperty('--border','#1a1a1a'); r.setProperty('--elevated','#111'); }
  if (!quiet) { var el = document.getElementById('settingsSaved'); el.style.opacity = '1'; setTimeout(function(){ el.style.opacity = '0'; }, 1500); }
}
loadSettings();

// ═══ FLEET MAP ═══
function renderFleetMap() {
  var map = document.getElementById('fleetMap');
  if (!map) return;
  var nodes = [
    {name:'Alice',x:20,y:50,color:'#FF1D6C',online:true},
    {name:'Cecilia',x:40,y:30,color:'#F5A623',online:true},
    {name:'Octavia',x:60,y:70,color:'#9C27B0',online:false},
    {name:'Aria',x:35,y:70,color:'#2979FF',online:true},
    {name:'Lucidia',x:55,y:40,color:'#00E676',online:true},
    {name:'Gematria',x:80,y:25,color:'#FF1D6C',online:true},
    {name:'Anastasia',x:85,y:60,color:'#F5A623',online:true},
    {name:'Alexandria',x:15,y:30,color:'#4488FF',online:true},
  ];
  var svg = '<svg width="100%" height="100%" viewBox="0 0 100 100">';
  // Draw connections
  for(var i=0;i<nodes.length;i++) for(var j=i+1;j<nodes.length;j++) {
    if(nodes[i].online&&nodes[j].online) svg+='<line x1="'+nodes[i].x+'" y1="'+nodes[i].y+'" x2="'+nodes[j].x+'" y2="'+nodes[j].y+'" stroke="#1a1a2e" stroke-width="0.3"/>';
  }
  // Draw nodes
  nodes.forEach(function(n){
    var fill=n.online?n.color:'#333';
    svg+='<circle cx="'+n.x+'" cy="'+n.y+'" r="2.5" fill="'+fill+'" opacity="'+(n.online?1:0.3)+'"/>';
    svg+='<text x="'+n.x+'" y="'+(n.y+5)+'" fill="'+(n.online?'#ccc':'#444')+'" font-size="2.8" text-anchor="middle" font-family="Space Grotesk">'+n.name+'</text>';
    if(n.online) svg+='<circle cx="'+n.x+'" cy="'+n.y+'" r="4" fill="'+n.color+'" opacity="0.1"><animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/></circle>';
  });
  svg+='</svg>';
  map.innerHTML=svg;
}

// ═══ NOTIFICATIONS ═══
async function loadNotifications() {
  var el=document.getElementById('notifList');
  if(!el) return;
  try {
    var r=await fetch('https://roadtrip.blackroad.io/api/messages?channel=general&limit=10');
    var msgs=await r.json();
    el.innerHTML=msgs.map(function(m){
      return '<div class="stat-card" style="margin-bottom:6px"><div class="stat-label">'+m.sender_name+'</div><div style="font-size:13px;margin-top:4px">'+m.content.slice(0,200)+'</div><div style="font-size:10px;opacity:.3;margin-top:4px">'+m.created_at+'</div></div>';
    }).join('') || '<p style="opacity:.3">No notifications</p>';
  } catch { el.innerHTML='<p style="opacity:.3">Could not load</p>'; }
}
loadNotifications();
renderFleetMap();

// ═══ COMMAND PALETTE (Cmd+K) ═══
var paletteOpen = false;
var COMMANDS = [
  {name:'Search',key:'s',action:function(){showPanel('search');document.getElementById('searchBox').focus()}},
  {name:'Agents',key:'a',action:function(){showPanel('agents')}},
  {name:'Fleet',key:'f',action:function(){showPanel('fleet')}},
  {name:'Code',key:'c',action:function(){showPanel('code')}},
  {name:'Settings',key:',',action:function(){showPanel('settings')}},
  {name:'Billing',key:'b',action:function(){showPanel('billing')}},
  {name:'Vision',key:'v',action:function(){showPanel('vision')}},
  {name:'Open Chat',key:'Enter',action:function(){window.open('https://chat.blackroad.io','_blank')}},
  {name:'Open Search',key:'/',action:function(){window.open('https://search.blackroad.io','_blank')}},
  {name:'Logout',key:'q',action:function(){doLogout()}},
];
document.addEventListener('keydown',function(e){
  // Cmd+K or Ctrl+K opens palette
  if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();togglePalette();return}
  // ? shows keyboard shortcuts
  if(e.key==='?'&&!e.target.matches('input,textarea')){e.preventDefault();togglePalette();return}
  // Escape closes palette
  if(e.key==='Escape'&&paletteOpen){closePalette();return}
});
function togglePalette(){paletteOpen?closePalette():openPalette()}
function openPalette(){
  paletteOpen=true;
  var el=document.getElementById('cmdPalette');
  if(!el){
    el=document.createElement('div');el.id='cmdPalette';
    el.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.8);display:flex;align-items:flex-start;justify-content:center;padding-top:20vh';
    document.body.appendChild(el);
  }
  el.style.display='flex';
  var html='<div style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;width:480px;max-width:90vw;overflow:hidden">';
  html+='<input id="cmdInput" placeholder="Type a command..." style="width:100%;padding:16px;border:none;border-bottom:1px solid #1a1a1a;background:transparent;color:#fff;font-size:15px;font-family:Space Grotesk,sans-serif;outline:none">';
  html+='<div id="cmdList" style="max-height:300px;overflow-y:auto">';
  COMMANDS.forEach(function(c,i){
    html+='<div class="cmd-item" onclick="runCmd('+i+')" style="padding:12px 16px;cursor:pointer;display:flex;justify-content:space-between;font-size:14px;color:#ccc;border-bottom:1px solid #111"><span>'+c.name+'</span><kbd style="background:#1a1a1a;padding:2px 8px;border-radius:4px;font-size:11px;color:#666">'+c.key+'</kbd></div>';
  });
  html+='</div></div>';
  el.innerHTML=html;
  document.getElementById('cmdInput').focus();
  document.getElementById('cmdInput').addEventListener('input',function(e){
    var q=e.target.value.toLowerCase();
    var items=el.querySelectorAll('.cmd-item');
    items.forEach(function(item){item.style.display=item.textContent.toLowerCase().includes(q)?'flex':'none'});
  });
  el.addEventListener('click',function(e){if(e.target===el)closePalette()});
}
function closePalette(){paletteOpen=false;var el=document.getElementById('cmdPalette');if(el)el.style.display='none'}
function runCmd(i){COMMANDS[i].action();closePalette()}
</script>
</body>
</html>`;
}
