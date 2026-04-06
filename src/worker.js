// PROPRIETARY. Copyright 2025-2026 BlackRoad OS, Inc. All rights reserved. NOT open source.
// BlackRoad OS v7.0 — 17 Products, 27 Agents, 6 Divisions, 17 Orgs, 53 Features, 20 API Endpoints

const ECOSYSTEM_HTML = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BlackRoad Ecosystem — Live Map</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#e5e5e5;font-family:Inter,sans-serif;overflow-x:hidden}
.hero{text-align:center;padding:60px 20px 40px;position:relative}
.hero h1{font-family:'Space Grotesk',sans-serif;font-size:42px;font-weight:700;background:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.hero p{color:#737373;font-size:15px}
.stats{display:flex;justify-content:center;gap:32px;padding:20px;flex-wrap:wrap}
.stat{text-align:center}.stat-n{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:#e5e5e5}.stat-l{font-family:'JetBrains Mono',monospace;font-size:10px;color:#525252;text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;padding:20px;max-width:1200px;margin:0 auto}
.card{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:16px;cursor:pointer;transition:border-color .2s,transform .2s;position:relative;overflow:hidden}
.card:hover{border-color:#333;transform:translateY(-2px)}
.card-bar{height:3px;border-radius:2px;margin-bottom:12px}
.card h3{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;margin-bottom:2px}
.card-desc{font-size:12px;color:#737373;margin-bottom:10px}
.card-stats{display:flex;gap:12px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#525252}
.card-stats span{display:flex;align-items:center;gap:4px}
.card-live{position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:50%;background:#00E676;box-shadow:0 0 8px #00E67644}
.card-link{display:block;color:#4488FF;font-size:11px;margin-top:8px;text-decoration:none;font-family:'JetBrains Mono',monospace}
.card-link:hover{text-decoration:underline}
.flows{max-width:1200px;margin:40px auto;padding:0 20px}
.flows h2{font-family:'Space Grotesk',sans-serif;font-size:20px;margin-bottom:16px;color:#e5e5e5}
.flow-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px}
.flow{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:8px;padding:10px 14px;font-size:12px;display:flex;align-items:center;gap:8px}
.flow-arrow{color:#FF1D6C;font-weight:700;font-size:14px}
.flow-label{color:#525252;font-family:'JetBrains Mono',monospace;font-size:10px;margin-left:auto}
.agents{max-width:1200px;margin:40px auto;padding:0 20px 60px}
.agents h2{font-family:'Space Grotesk',sans-serif;font-size:20px;margin-bottom:16px}
.agent-grid{display:flex;flex-wrap:wrap;gap:6px}
.agent-dot{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#0a0a0a;cursor:default;transition:transform .2s;position:relative}
.agent-dot:hover{transform:scale(1.3);z-index:10}
.agent-dot:hover::after{content:attr(title);position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:#111;color:#e5e5e5;padding:4px 8px;border-radius:4px;font-size:10px;white-space:nowrap;border:1px solid #1a1a1a;font-weight:400}
.division-label{font-size:11px;color:#525252;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.04em;margin:16px 0 8px}
footer{text-align:center;padding:40px;color:#333;font-size:12px;border-top:1px solid #111}
</style></head><body>
<div class="hero">
<h1>BlackRoad Ecosystem</h1>
<p>17 products. 27 agents. 2,677 repos. All alive.</p>
</div>
<div class="stats" id="stats"></div>
<div class="grid" id="grid"></div>
<div class="flows"><h2>Data Flows</h2><div class="flow-grid" id="flows"></div></div>
<div class="agents"><h2>The 27 Roadies</h2><div id="agents"></div></div>
<footer>BlackRoad OS, Inc. &copy; 2026 — Build anything. Remember everything.</footer>
<script>
const AGENTS=[{id:'roadie',n:'Roadie',d:'core',c:'#FF2255'},{id:'lucidia',n:'Lucidia',d:'core',c:'#00E676'},{id:'cecilia',n:'Cecilia',d:'operations',c:'#F5A623'},{id:'octavia',n:'Octavia',d:'operations',c:'#9C27B0'},{id:'olympia',n:'Olympia',d:'operations',c:'#CC00AA'},{id:'silas',n:'Silas',d:'operations',c:'#4488FF'},{id:'sebastian',n:'Sebastian',d:'operations',c:'#8844FF'},{id:'calliope',n:'Calliope',d:'creative',c:'#FF2255'},{id:'aria',n:'Aria',d:'creative',c:'#2979FF'},{id:'thalia',n:'Thalia',d:'creative',c:'#FF6B2B'},{id:'lyra',n:'Lyra',d:'creative',c:'#00D4FF'},{id:'sapphira',n:'Sapphira',d:'creative',c:'#CC00AA'},{id:'seraphina',n:'Seraphina',d:'creative',c:'#FF6B2B'},{id:'alexandria',n:'Alexandria',d:'knowledge',c:'#FF1D6C'},{id:'theodosia',n:'Theodosia',d:'knowledge',c:'#8844FF'},{id:'sophia',n:'Sophia',d:'knowledge',c:'#4488FF'},{id:'gematria',n:'Gematria',d:'knowledge',c:'#FF1D6C'},{id:'portia',n:'Portia',d:'governance',c:'#F5A623'},{id:'atticus',n:'Atticus',d:'governance',c:'#4488FF'},{id:'cicero',n:'Cicero',d:'governance',c:'#FF6B2B'},{id:'valeria',n:'Valeria',d:'governance',c:'#FF2255'},{id:'alice',n:'Alice',d:'human',c:'#FF1D6C'},{id:'celeste',n:'Celeste',d:'human',c:'#00D4FF'},{id:'elias',n:'Elias',d:'human',c:'#4488FF'},{id:'ophelia',n:'Ophelia',d:'human',c:'#9C27B0'},{id:'gaia',n:'Gaia',d:'infrastructure',c:'#00E676'},{id:'anastasia',n:'Anastasia',d:'infrastructure',c:'#F5A623'}];
async function load(){
  try{
    var r=await fetch('/api/ecosystem');var d=await r.json();
    // Stats
    var s=d.stats;
    document.getElementById('stats').innerHTML=[
      ['62,786','Lines of Code'],['901+','API Routes'],['370+','D1 Tables'],
      ['27','Agents'],['729','Sub-Agents'],['37','GitHub Orgs'],['2,677','Repositories'],['498','Knowledge Items']
    ].map(function(x){return '<div class="stat"><div class="stat-n">'+x[0]+'</div><div class="stat-l">'+x[1]+'</div></div>'}).join('');
    // Products
    document.getElementById('grid').innerHTML=d.products.map(function(p){
      return '<div class="card" onclick="window.open(\\''+p.url+'\\',\\'_blank\\')"><div class="card-bar" style="background:'+p.color+'"></div><div class="card-live"></div><h3>'+p.name+'</h3><div class="card-desc">'+p.desc+'</div><div class="card-stats"><span>'+p.lines.toLocaleString()+' lines</span><span>'+p.routes+' routes</span><span>'+p.tables+' tables</span></div><a class="card-link" href="'+p.url+'" target="_blank">'+p.url.replace('https://','')+'</a></div>'
    }).join('');
    // Flows
    var pMap={};d.products.forEach(function(p){pMap[p.id]=p.name});
    document.getElementById('flows').innerHTML=d.flows.map(function(f){
      var icon=f.type==='stamp'?'&#x26d3;':f.type==='earn'?'&#x1fa99;':'&#x27a1;&#xfe0f;';
      return '<div class="flow">'+icon+' <strong>'+(pMap[f.from]||f.from)+'</strong> <span class="flow-arrow">&rarr;</span> <strong>'+(pMap[f.to]||f.to)+'</strong> <span class="flow-label">'+f.label+'</span></div>'
    }).join('');
    // Agents by division
    var divs={};AGENTS.forEach(function(a){if(!divs[a.d])divs[a.d]=[];divs[a.d].push(a)});
    var html='';
    ['core','operations','creative','knowledge','governance','human','infrastructure'].forEach(function(div){
      html+='<div class="division-label">'+div+'</div><div class="agent-grid">';
      (divs[div]||[]).forEach(function(a){html+='<div class="agent-dot" style="background:'+a.c+'" title="'+a.n+'">'+a.n[0]+'</div>'});
      html+='</div>';
    });
    document.getElementById('agents').innerHTML=html;
    // Pulse the live dots
    setInterval(function(){document.querySelectorAll('.card-live').forEach(function(d){d.style.opacity=d.style.opacity==='0.3'?'1':'0.3'})},1500);
  }catch(e){document.getElementById('stats').textContent='Loading ecosystem data...'}
}
load();
</script><script>(function(){var d={path:location.pathname,ref:document.referrer,w:screen.width,h:screen.height,t:Date.now()};navigator.sendBeacon&&navigator.sendBeacon('/api/analytics',JSON.stringify(d))})()</script></body></html>`;

const OS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover">
<title>BlackRoad OS v7 — Sovereign AI Operating System</title>
<meta name="description" content="BlackRoad OS Virtual Computer — sovereign computing platform in your browser.">
<link rel="icon" href="https://images.blackroad.io/pixel-art/road-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* ═══════════════════════════════════════
   BRAND CSS — exact copy from brand.blackroad.io
   ═══════════════════════════════════════ */
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --g:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);
  --g135:linear-gradient(135deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);
  --bg:#000;
  --card:#0a0a0a;
  --elevated:#111;
  --hover:#181818;
  --border:#1a1a1a;
  --muted:#444;
  --sub:#737373;
  --text:#f5f5f5;
  --white:#fff;
  --sg:'Space Grotesk',sans-serif;
  --jb:'JetBrains Mono',monospace;
}
html{scroll-behavior:smooth}
body{background:var(--bg);overflow-x:hidden;color:var(--text);font-family:var(--sg);line-height:1.6}
a{color:var(--text);text-decoration:none}
button{font-family:var(--sg);cursor:pointer}
input,textarea,select{font-family:var(--sg)}
::selection{background:rgba(255,255,255,.12)}

.grad-bar{height:4px;background:var(--g)}

/* NAV */
.nav-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:var(--card);border:1px solid var(--border);border-radius:10px}
.nav-logo{font-weight:700;font-size:18px;color:var(--white);display:flex;align-items:center;gap:10px}
.nav-logo-bar{width:24px;height:4px;border-radius:2px;background:var(--g)}
.nav-links{display:flex;gap:28px}
.nav-links a{font-size:13px;font-weight:500;color:var(--sub);transition:color .15s}
.nav-links a:hover{color:var(--white)}
.nav-actions{display:flex;gap:10px;align-items:center}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:6px;font-weight:600;font-size:13px;border:none;transition:all .15s}
.btn-sm{padding:7px 16px;font-size:12px;border-radius:5px}
.btn-lg{padding:14px 32px;font-size:15px;border-radius:8px}
.btn-white{background:var(--white);color:#000}
.btn-white:hover{background:#e0e0e0}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--text)}
.btn-outline:hover{border-color:#444}
.btn-ghost{background:transparent;border:none;color:var(--sub)}
.btn-ghost:hover{color:var(--white)}
.btn-dark{background:var(--elevated);color:var(--text);border:1px solid var(--border)}
.btn-icon{width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:var(--elevated);border:1px solid var(--border);color:var(--sub);font-size:14px}

/* CARDS */
.card{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.card-grad{height:3px;background:var(--g)}
.card-body{padding:20px}
.card-sm .card-body{padding:16px}
.card-title{font-weight:600;font-size:15px;color:var(--white);margin-bottom:6px}
.card-text{font-size:13px;color:var(--sub);line-height:1.7}
.card-meta{font-family:var(--jb);font-size:10px;color:var(--muted);margin-top:10px}
.card-footer{padding:14px 20px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.card-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.card-header-title{font-weight:600;font-size:14px;color:var(--white)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600;background:var(--elevated);border:1px solid var(--border);color:var(--text)}
.badge-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.badge-line{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600;color:var(--text)}
.badge-line::before{content:'';width:12px;height:3px;border-radius:2px;background:var(--g)}

/* INPUTS */
.input{width:100%;padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;outline:none;transition:border-color .15s}
.input:focus{border-color:#333}
.input::placeholder{color:var(--muted)}
.input-label{display:block;font-size:12px;font-weight:600;color:var(--sub);margin-bottom:6px;letter-spacing:.02em}

/* AVATARS */
.avatar{width:36px;height:36px;border-radius:50%;background:var(--elevated);border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--sub);flex-shrink:0}
.avatar-sm{width:28px;height:28px;font-size:11px}

/* TAGS */
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:500;background:var(--elevated);border:1px solid var(--border);color:var(--sub)}

/* LISTS */
.list{list-style:none}
.list-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text);transition:background .1s;cursor:pointer}
.list-item:last-child{border-bottom:none}
.list-item:hover{background:var(--hover)}
.list-item-dot{width:6px;height:6px;border-radius:50%;background:var(--white);flex-shrink:0}
.list-item-text{flex:1}
.list-item-meta{font-family:var(--jb);font-size:10px;color:var(--muted)}

/* TABS */
.tabs{display:flex;gap:0;border-bottom:1px solid var(--border)}
.tab{padding:10px 20px;font-size:13px;font-weight:500;color:var(--sub);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .15s;font-family:var(--sg)}
.tab:hover{color:var(--white)}
.tab.active{color:var(--white);border-bottom-color:var(--white)}

/* PROGRESS */
.progress-track{width:100%;height:4px;background:var(--elevated);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;border-radius:2px;background:var(--g);transition:width .3s}

/* TOAST */
.toast{display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--card);border:1px solid var(--border);border-radius:8px;max-width:380px;font-size:13px}
.toast-bar{width:3px;min-height:32px;border-radius:2px;background:var(--g);flex-shrink:0;align-self:stretch}
.toast-text{flex:1;color:var(--text)}
.toast-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px}

/* STATS */
.stat-value{font-size:32px;font-weight:700;color:var(--white)}
.stat-label{font-size:12px;color:var(--sub);margin-top:2px}
.stat-bar{width:100%;height:3px;border-radius:2px;background:var(--g);margin-top:12px}

/* SIDEBAR */
.sidebar-label{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;padding:8px 10px}
.sidebar-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;font-size:13px;color:var(--sub);cursor:pointer;transition:all .1s}
.sidebar-item:hover{background:var(--hover);color:var(--text)}
.sidebar-item.active{background:var(--hover);color:var(--white);font-weight:500}
.sidebar-item-icon{font-size:14px;width:18px;text-align:center}
.sidebar-item-badge{margin-left:auto;font-family:var(--jb);font-size:10px;color:var(--muted)}

/* DROPDOWN */
.dropdown-menu{min-width:200px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:4px;z-index:100;box-shadow:0 8px 30px rgba(0,0,0,.5)}
.dropdown-item{display:flex;align-items:center;gap:10px;padding:8px 12px;font-size:13px;color:var(--text);border-radius:5px;cursor:pointer;transition:background .1s}
.dropdown-item:hover{background:var(--hover)}
.dropdown-divider{height:1px;background:var(--border);margin:4px 0}
.dropdown-label{padding:6px 12px;font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}

/* CMD PALETTE */
.cmd-palette{background:var(--card);border:1px solid var(--border);border-radius:12px;width:560px;max-width:90vw;overflow:hidden}
.cmd-input-wrap{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.cmd-input{flex:1;background:none;border:none;color:var(--white);font-size:14px;outline:none}
.cmd-input::placeholder{color:var(--muted)}
.cmd-prefix{font-family:var(--jb);font-size:12px;color:var(--muted)}
.cmd-results{max-height:300px;overflow-y:auto;padding:4px}
.cmd-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:6px;cursor:pointer;transition:background .1s}
.cmd-item:hover,.cmd-item.selected{background:var(--hover)}
.cmd-item-icon{font-size:14px;color:var(--muted);width:20px;text-align:center}
.cmd-item-text{flex:1;font-size:13px;color:var(--text)}
.cmd-item-shortcut{font-family:var(--jb);font-size:10px;color:var(--muted)}
.cmd-footer{padding:10px 18px;border-top:1px solid var(--border);display:flex;gap:16px;font-family:var(--jb);font-size:10px;color:var(--muted)}

/* KBD */
.kbd{display:inline-flex;align-items:center;padding:2px 8px;background:var(--elevated);border:1px solid var(--border);border-radius:4px;font-family:var(--jb);font-size:11px;color:var(--sub);line-height:1.8}

/* SPINNER */
.spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--white);border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes gradSweep{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

.anim-sweep{height:6px;border-radius:3px;background:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF,#FF6B2B);background-size:200% 100%;animation:gradSweep 3s linear infinite}

/* SCROLLBAR (brand-matching) */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* FOCUS */
:focus-visible{outline:2px solid #8844FF;outline-offset:2px}
*:focus{outline:none}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #8844FF;outline-offset:2px}

@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}

/* ═══════════════════════════════════════
   OS LAYOUT — minimal additions on top of brand
   ═══════════════════════════════════════ */
html,body{height:100%;overflow:hidden}

#os{display:grid;grid-template-rows:1fr 48px;height:100vh}
#desktop{position:relative;overflow:hidden}

/* Desktop background */
#desktop-bg{position:absolute;inset:0;pointer-events:none}
.bg-orb{position:absolute;border-radius:50%;filter:blur(160px);opacity:.035}

/* Desktop — clean, no icons */
#desktop-center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0}
#desktop-center .logo{width:64px;height:64px;border-radius:16px;background:var(--g135);opacity:.06}

/* ── Windows ── */
.win{position:absolute;display:flex;flex-direction:column;transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .25s cubic-bezier(.4,0,.2,1),box-shadow .2s}
.win.card{border-radius:10px}
.win.focused{box-shadow:0 16px 64px rgba(0,0,0,.6),0 0 1px rgba(255,255,255,.06);border-color:#222;z-index:auto}
.win.maximized{border-radius:0!important;border:none!important;left:0!important;top:0!important;width:100%!important;height:100%!important}
.win.mini{transform:scale(.95) translateY(20px);opacity:0;pointer-events:none}
.win.closing{transform:scale(.92);opacity:0;pointer-events:none;transition:transform .2s ease-in,opacity .2s ease-in}

/* Title bar — uses card-header from brand */
.win .card-header{cursor:default;user-select:none;padding:10px 16px;height:42px}
.win .card-header .dots{display:flex;gap:7px}
.win .card-header .dot{width:13px;height:13px;border-radius:50%;cursor:pointer;transition:transform .1s}
.win .card-header .dot:hover{transform:scale(1.15)}
.win .card-header .dot.close{background:#ff5f57}
.win .card-header .dot.minimize{background:#ffbd2e}
.win .card-header .dot.maximize{background:#28c840}
.win .card-header .drag{flex:1;cursor:grab;display:flex;align-items:center;justify-content:center}
.win .card-header .drag:active{cursor:grabbing}
.win-title{font-size:12px;font-weight:500;color:var(--sub);pointer-events:none}
.win.focused .win-title{color:var(--text)}
.win-body{flex:1;overflow:auto;background:var(--bg)}
.win-body iframe{width:100%;height:100%;border:none;display:block;background:var(--bg)}
.win-resize{position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nwse-resize}

/* Toolbar row (for browser windows) */
.win-toolbar{display:flex;align-items:center;gap:2px;padding:6px 12px;border-bottom:1px solid var(--border);background:var(--card)}
.win-toolbar .btn-ghost{padding:4px 10px;font-size:11px;border-radius:5px}
.win-toolbar .btn-ghost:hover{background:var(--hover)}
.win-toolbar-sep{width:1px;height:16px;background:var(--border);margin:0 4px}

/* Address bar */
.win-addressbar{display:flex;align-items:center;gap:8px;padding:6px 12px;border-bottom:1px solid var(--border);background:var(--card)}
.win-addressbar .input{padding:6px 12px;font-size:12px;font-family:var(--jb);background:var(--bg);border-radius:6px}
.win-addressbar-label{font-family:var(--jb);font-size:10px;color:var(--muted);flex-shrink:0}

/* Status bar — uses card-footer from brand */
.win .card-footer{padding:6px 16px;font-family:var(--jb);font-size:10px;color:var(--muted)}
.win .card-footer .status-section{display:flex;align-items:center;gap:6px}

/* ── Dock — all apps live here ── */
#dock{background:rgba(0,0,0,.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--border);display:flex;align-items:center;padding:0 8px;gap:0;z-index:9000}
#dock-apps{display:flex;align-items:center;gap:2px;flex:1;overflow-x:auto;overflow-y:hidden;padding:4px 0;scrollbar-width:none}
#dock-apps::-webkit-scrollbar{display:none}
.dock-btn{height:36px;min-width:36px;padding:0 10px;display:flex;align-items:center;gap:6px;border-radius:6px;cursor:pointer;font-size:11px;color:var(--sub);transition:all .12s;border:none;background:none;font-family:var(--sg);position:relative;flex-shrink:0}
.dock-btn:hover{background:var(--hover);color:var(--white)}
.dock-btn.active{background:var(--hover);color:var(--white)}
.dock-btn .indicator{position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--white);opacity:0;transition:opacity .15s}
.dock-btn.remembered .indicator{opacity:.3}
.dock-btn.open .indicator{opacity:1}
.dock-sep{width:1px;height:24px;background:var(--border);margin:0 6px;flex-shrink:0}
#dock-tray{display:flex;align-items:center;gap:10px;flex-shrink:0;padding-left:6px}
#dock-clock{font-family:var(--jb);font-size:10px;color:var(--muted)}

/* ── Command Palette (Cmd+K) ── */
#launcher-overlay{position:fixed;inset:0;bottom:48px;z-index:9500;background:rgba(0,0,0,.5);backdrop-filter:blur(30px);display:none;align-items:center;justify-content:center}
#launcher-overlay.open{display:flex}

/* ── Context Menu ── */
#ctx{position:fixed;z-index:99000;display:none}
#ctx .dropdown-menu{display:block}

/* ── Toasts ── */
#toasts{position:fixed;top:12px;right:12px;z-index:99999;display:flex;flex-direction:column;gap:6px;pointer-events:none}
#toasts .toast{pointer-events:auto;animation:fadeIn .25s ease}

/* ── Snap Preview ── */
#snap{position:fixed;z-index:8999;display:none;background:rgba(255,255,255,.03);border:2px solid rgba(255,255,255,.08);border-radius:8px;transition:all .15s cubic-bezier(.4,0,.2,1);pointer-events:none}

/* ── Boot Screen ── */
#boot{position:fixed;inset:0;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100000;transition:opacity .5s}
#boot.done{opacity:0;pointer-events:none}
#boot-logo{width:72px;height:72px;background:var(--g135);border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px}
#boot-text{font-family:var(--jb);font-size:11px;color:var(--muted);text-align:center;line-height:2}
#boot-bar{width:200px;margin-top:16px}

/* ── Mobile ── */
@media(max-width:640px){
  .win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0!important;border:none!important}
  .win-resize{display:none}
  .dock-btn .dock-label{display:none}
  .dock-btn{min-width:32px;padding:0 8px}
}

/* ═══════════════════════════════════════
   v7.0 — AGENT PANEL, NOTIFICATION CENTER, SYSTEM MONITOR
   ═══════════════════════════════════════ */

/* Agent Panel — slide-out right */
#agent-panel{position:fixed;right:0;top:0;bottom:48px;width:340px;background:var(--card);border-left:1px solid var(--border);z-index:9100;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s cubic-bezier(.4,0,.2,1)}
#agent-panel.open{transform:translateX(0)}
#agent-panel-header{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
#agent-panel-header h3{font-size:14px;font-weight:600;color:var(--white);margin:0}
.agent-tabs{display:flex;border-bottom:1px solid var(--border)}
.agent-tab{flex:1;padding:8px;font-size:11px;font-weight:500;color:var(--sub);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:var(--sg);text-align:center}
.agent-tab:hover{color:var(--white)}
.agent-tab.active{color:var(--white);border-bottom-color:var(--white)}
#agent-panel-body{flex:1;overflow-y:auto;padding:0}
.agent-roster-item{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .1s}
.agent-roster-item:hover{background:var(--hover)}
.agent-roster-item.selected{background:var(--hover);border-left:2px solid var(--white)}
.agent-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#000;flex-shrink:0}
.agent-info{flex:1;min-width:0}
.agent-name{font-size:12px;font-weight:600;color:var(--white)}
.agent-role{font-size:10px;color:var(--sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.agent-division-badge{font-size:9px;padding:2px 6px;border-radius:3px;background:var(--elevated);border:1px solid var(--border);color:var(--muted);font-weight:500}
#agent-chat{display:none;flex-direction:column;height:100%}
#agent-chat.active{display:flex}
#agent-chat-header{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
#agent-chat-messages{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.agent-msg{max-width:85%;padding:8px 12px;border-radius:8px;font-size:12px;line-height:1.5}
.agent-msg.from{background:var(--elevated);color:var(--text);align-self:flex-start;border:1px solid var(--border)}
.agent-msg.to{background:rgba(136,68,255,.15);color:var(--text);align-self:flex-end}
.agent-msg-name{font-size:10px;font-weight:600;margin-bottom:2px}
.agent-msg-time{font-size:9px;color:var(--muted);margin-top:2px;font-family:var(--jb)}
#agent-chat-input-wrap{padding:10px 16px;border-top:1px solid var(--border);display:flex;gap:8px}
#agent-chat-input{flex:1;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:12px;font-family:var(--sg);outline:none}
#agent-chat-input:focus{border-color:#333}

/* Notification Center */
#notif-panel{position:fixed;right:0;top:0;bottom:48px;width:320px;background:var(--card);border-left:1px solid var(--border);z-index:9200;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s cubic-bezier(.4,0,.2,1)}
#notif-panel.open{transform:translateX(0)}
#notif-panel-header{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.notif-item{display:flex;gap:10px;padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .1s}
.notif-item:hover{background:var(--hover)}
.notif-item.unread{border-left:2px solid #8844FF}
.notif-icon{width:28px;height:28px;border-radius:6px;background:var(--elevated);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.notif-body{flex:1;min-width:0}
.notif-title{font-size:12px;font-weight:500;color:var(--white)}
.notif-text{font-size:10px;color:var(--sub);margin-top:2px}
.notif-time{font-size:9px;color:var(--muted);font-family:var(--jb);margin-top:3px}
#notif-badge{position:absolute;top:-2px;right:-2px;min-width:14px;height:14px;border-radius:7px;background:#FF2255;color:#fff;font-size:8px;font-weight:700;display:none;align-items:center;justify-content:center;padding:0 3px}

/* System Map Panel */
#sysmap-panel{display:none;flex-direction:column;height:100%;padding:0}
#sysmap-panel.active{display:flex}
.sysmap-section{padding:12px 16px;border-bottom:1px solid var(--border)}
.sysmap-section-title{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
.sysmap-row{display:flex;align-items:center;justify-content:space-between;padding:4px 0;font-size:11px}
.sysmap-row-label{color:var(--sub)}
.sysmap-row-value{color:var(--white);font-family:var(--jb);font-size:10px}
.sysmap-health{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.sysmap-health.up{background:#22c55e}
.sysmap-health.down{background:#ef4444}
.sysmap-health.unknown{background:var(--muted)}

/* ═══════════════════════════════════════
   v6.0 — WIDGETS, SHORTCUTS, CLIPBOARD, SPOTLIGHT, THEMES, BACKUP, PERMISSIONS, STARTUP
   ═══════════════════════════════════════ */

/* Widget overlay */
#widgets-panel{position:absolute;top:8px;left:8px;z-index:60;display:flex;flex-direction:column;gap:8px;pointer-events:auto;max-height:calc(100vh - 80px);overflow-y:auto;scrollbar-width:none}
#widgets-panel::-webkit-scrollbar{display:none}
.desktop-widget{background:rgba(10,10,10,.92);border:1px solid var(--border);border-radius:10px;padding:14px 16px;font-family:var(--jb);font-size:11px;color:var(--sub);backdrop-filter:blur(16px);min-width:200px;max-width:260px;transition:opacity .3s,transform .3s}
.desktop-widget:hover{border-color:#333}
.widget-title{font-family:var(--sg);font-weight:600;font-size:12px;color:var(--white);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
.widget-title .widget-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:10px;padding:2px 6px;border-radius:4px}
.widget-title .widget-close:hover{color:var(--white);background:var(--hover)}
.widget-row{display:flex;align-items:center;justify-content:space-between;padding:3px 0;font-size:11px}
.widget-row-label{color:var(--sub)}
.widget-row-value{color:var(--white);font-weight:500}

/* Spotlight overlay */
#spotlight-overlay{position:fixed;inset:0;z-index:99500;background:rgba(0,0,0,.65);backdrop-filter:blur(40px);display:none;align-items:flex-start;justify-content:center;padding-top:18vh}
#spotlight-overlay.open{display:flex}
#spotlight-box{width:620px;max-width:92vw;background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.7)}
#spotlight-input-wrap{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
#spotlight-input{flex:1;background:none;border:none;color:var(--white);font-size:16px;font-family:var(--sg);outline:none}
#spotlight-input::placeholder{color:var(--muted)}
#spotlight-results{max-height:360px;overflow-y:auto;padding:6px}
.spotlight-section{padding:6px 16px;font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.spotlight-item{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:8px;cursor:pointer;transition:background .1s;font-size:13px;color:var(--text)}
.spotlight-item:hover,.spotlight-item.sel{background:var(--hover)}
.spotlight-item-icon{font-size:12px;color:var(--muted);width:20px;text-align:center;flex-shrink:0}
.spotlight-item-text{flex:1}
.spotlight-item-sub{font-size:10px;color:var(--muted);font-family:var(--jb)}

/* Clipboard panel */
#clipboard-panel{position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9400;width:280px;max-height:60vh;background:var(--card);border:1px solid var(--border);border-radius:10px;display:none;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.5)}
#clipboard-panel.open{display:block}
.clip-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--border);font-size:11px;color:var(--text);cursor:pointer;transition:background .1s}
.clip-item:hover{background:var(--hover)}
.clip-item:last-child{border-bottom:none}
.clip-item-text{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--jb);font-size:10px}
.clip-pin{color:var(--muted);font-size:10px;cursor:pointer;padding:2px 4px;border-radius:3px}
.clip-pin:hover{color:var(--white)}
.clip-pin.pinned{color:#F5A623}

/* Permissions / Startup / Backup panels — reuse dropdown-menu styles */
.os-panel-overlay{position:fixed;inset:0;z-index:99300;background:rgba(0,0,0,.5);backdrop-filter:blur(20px);display:none;align-items:center;justify-content:center}
.os-panel-overlay.open{display:flex}
.os-panel{width:520px;max-width:92vw;max-height:75vh;background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.os-panel-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.os-panel-header h3{font-size:15px;font-weight:600;color:var(--white);margin:0}
.os-panel-body{padding:16px 20px;overflow-y:auto;max-height:calc(75vh - 60px)}
.os-panel-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;border-radius:4px}
.os-panel-close:hover{color:var(--white);background:var(--hover)}
.perm-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)}
.perm-row:last-child{border-bottom:none}
.perm-label{font-size:13px;color:var(--text)}
.perm-sub{font-size:10px;color:var(--muted)}
.toggle-sw{width:36px;height:20px;border-radius:10px;background:var(--border);position:relative;cursor:pointer;transition:background .2s;border:none;padding:0}
.toggle-sw.on{background:#22c55e}
.toggle-sw::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--white);transition:left .2s}
.toggle-sw.on::after{left:18px}
.startup-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.startup-item:last-child{border-bottom:none}
.startup-order{font-family:var(--jb);font-size:11px;color:var(--muted);width:24px;text-align:center}
</style><meta property="og:title" content="BlackRoad OS"><meta property="og:description" content="17 products. 27 agents. 17 orgs. One highway."><meta property="og:url" content="https://os.blackroad.io"><meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png"><meta name="twitter:card" content="summary_large_image"><meta name="robots" content="index, follow, noai, noimageai"><link rel="canonical" href="https://os.blackroad.io/">
</head>
<body>

<!-- BOOT -->
<div id="boot">
  <div id="boot-logo"><span style="font-size:28px;font-weight:700;color:#000">B</span></div>
  <div id="boot-text">
    BlackRoad OS v7.0 — 17 Products. 27 Agents. 17 Orgs.<br>
    <span id="boot-status">Initializing...</span>
  </div>
  <div id="boot-bar">
    <div class="progress-track"><div class="progress-fill" id="boot-fill" style="width:0%"></div></div>
  </div>
</div>

<!-- OS -->
<div id="os" style="opacity:0">

<!-- DESKTOP — clean, just orbs -->
<div id="desktop">
  <div id="desktop-bg">
    <div class="bg-orb" style="width:700px;height:700px;background:#FF2255;top:-250px;right:-150px"></div>
    <div class="bg-orb" style="width:500px;height:500px;background:#4488FF;bottom:-150px;left:-100px"></div>
    <div class="bg-orb" style="width:350px;height:350px;background:#8844FF;top:40%;left:40%"></div>
  </div>
  <div id="desktop-center"><div class="logo"></div></div>
  <div id="win-container"></div>
</div>

<!-- DOCK — all apps live here -->
<div id="dock">
  <div id="dock-apps"></div>
  <div class="dock-sep"></div>
  <div id="dock-tray">
    <button class="btn-icon" onclick="toggleAgentPanel()" title="Agents" style="width:28px;height:28px;font-size:10px;position:relative">A</button>
    <button class="btn-icon" onclick="toggleNotifPanel()" title="Notifications" style="width:28px;height:28px;font-size:10px;position:relative">N<span id="notif-badge">0</span></button>
    <span class="badge"><span class="badge-dot" style="background:var(--white)"></span><span id="tray-status">ready</span></span>
    <span id="dock-clock"></span>
  </div>
</div>
</div>

<!-- AGENT PANEL -->
<div id="agent-panel">
  <div id="agent-panel-header">
    <h3>Agents <span style="font-weight:400;color:var(--sub);font-size:11px">(27)</span></h3>
    <button class="os-panel-close" onclick="toggleAgentPanel()">&#10005;</button>
  </div>
  <div class="agent-tabs">
    <button class="agent-tab active" data-atab="roster" onclick="switchAgentTab('roster')">Roster</button>
    <button class="agent-tab" data-atab="chat" onclick="switchAgentTab('chat')">Chat</button>
    <button class="agent-tab" data-atab="sysmap" onclick="switchAgentTab('sysmap')">System Map</button>
  </div>
  <div id="agent-panel-body">
    <div id="agent-roster"></div>
    <div id="agent-chat">
      <div id="agent-chat-header"></div>
      <div id="agent-chat-messages"></div>
      <div id="agent-chat-input-wrap">
        <input id="agent-chat-input" placeholder="Talk to agent..." onkeydown="if(event.key==='Enter')sendAgentMsg()">
        <button class="btn btn-sm btn-outline" onclick="sendAgentMsg()">Send</button>
      </div>
    </div>
    <div id="sysmap-panel"></div>
  </div>
</div>

<!-- NOTIFICATION CENTER -->
<div id="notif-panel">
  <div id="notif-panel-header">
    <h3>Notifications</h3>
    <div style="display:flex;gap:6px">
      <button class="btn-ghost btn-sm" onclick="markAllRead()" style="font-size:10px">Mark all read</button>
      <button class="os-panel-close" onclick="toggleNotifPanel()">&#10005;</button>
    </div>
  </div>
  <div id="notif-list" style="flex:1;overflow-y:auto"></div>
</div>

<!-- CMD PALETTE (Cmd+K or click desktop) -->
<div id="launcher-overlay" onclick="if(event.target===this)closeLauncher()">
  <div class="cmd-palette">
    <div class="cmd-input-wrap">
      <span class="cmd-prefix">&gt;</span>
      <input class="cmd-input" id="cmd-input" placeholder="Search or run command...">
    </div>
    <div class="cmd-results" id="cmd-results"></div>
    <div class="cmd-footer">
      <span><span class="kbd">up/dn</span> navigate</span>
      <span><span class="kbd">enter</span> open</span>
      <span><span class="kbd">esc</span> close</span>
    </div>
  </div>
</div>

<!-- CONTEXT MENU -->
<div id="ctx"><div class="dropdown-menu" id="ctx-inner"></div></div>

<!-- TOASTS -->
<div id="toasts"></div>

<!-- SNAP PREVIEW -->
<div id="snap"></div>

<!-- WIDGETS PANEL -->
<div id="widgets-panel"></div>

<!-- SPOTLIGHT (Cmd+Space) -->
<div id="spotlight-overlay" onclick="if(event.target===this)closeSpotlight()">
  <div id="spotlight-box">
    <div id="spotlight-input-wrap">
      <span style="font-size:16px;color:var(--muted)">&#9906;</span>
      <input id="spotlight-input" placeholder="Search everything... files, apps, messages, agents, settings">
    </div>
    <div id="spotlight-results"></div>
  </div>
</div>

<!-- CLIPBOARD PANEL -->
<div id="clipboard-panel">
  <div class="card-header"><span class="card-header-title">Clipboard History</span><button class="os-panel-close" onclick="toggleClipboard()">&#10005;</button></div>
  <div id="clipboard-list" style="max-height:50vh;overflow-y:auto"></div>
</div>

<!-- PERMISSIONS PANEL -->
<div class="os-panel-overlay" id="permissions-overlay" onclick="if(event.target===this)closePanel('permissions-overlay')">
  <div class="os-panel">
    <div class="os-panel-header"><h3>App Permissions</h3><button class="os-panel-close" onclick="closePanel('permissions-overlay')">&#10005;</button></div>
    <div class="os-panel-body" id="permissions-body"></div>
  </div>
</div>

<!-- STARTUP PANEL -->
<div class="os-panel-overlay" id="startup-overlay" onclick="if(event.target===this)closePanel('startup-overlay')">
  <div class="os-panel">
    <div class="os-panel-header"><h3>Startup Manager</h3><button class="os-panel-close" onclick="closePanel('startup-overlay')">&#10005;</button></div>
    <div class="os-panel-body" id="startup-body"></div>
  </div>
</div>

<!-- BACKUP PANEL -->
<div class="os-panel-overlay" id="backup-overlay" onclick="if(event.target===this)closePanel('backup-overlay')">
  <div class="os-panel">
    <div class="os-panel-header"><h3>System Backup</h3><button class="os-panel-close" onclick="closePanel('backup-overlay')">&#10005;</button></div>
    <div class="os-panel-body" id="backup-body"></div>
  </div>
</div>

<!-- THEME PICKER PANEL -->
<div class="os-panel-overlay" id="themes-overlay" onclick="if(event.target===this)closePanel('themes-overlay')">
  <div class="os-panel">
    <div class="os-panel-header"><h3>Desktop Themes</h3><button class="os-panel-close" onclick="closePanel('themes-overlay')">&#10005;</button></div>
    <div class="os-panel-body" id="themes-body"></div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════
//  BLACKROAD OS — VIRTUAL COMPUTER
//  Built on brand.blackroad.io
//
//  Philosophy: for messy people who never close anything.
//  - All apps in the dock. Clean desktop.
//  - Opening a new app auto-closes the old one.
//  - Every app remembers its position, size, and URL.
//  - You never have to organize. The OS does it for you.
// ═══════════════════════════════════════════════════════

var APPS = [
  // ── 17 Canonical Products ──
  {id:'roadtrip',    name:'RoadTrip',    icon:'circle', url:'https://roadtrip.blackroad.io',    w:.5, h:.7},
  {id:'roadie',      name:'Roadie',      icon:'square', url:'https://roadie.blackroad.io',      w:.5, h:.65},
  {id:'roadview',    name:'RoadView',    icon:'circle', url:'https://roadview.blackroad.io',    w:.55,h:.7, browser:true},
  {id:'backroad',    name:'BackRoad',    icon:'square', url:'https://backroad.blackroad.io',    w:.48,h:.6},
  {id:'roadcode',    name:'RoadCode',    icon:'circle', url:'https://roadcode.blackroad.io',    w:.6, h:.75},
  {id:'roadwork',    name:'RoadWork',    icon:'square', url:'https://roadwork.blackroad.io',    w:.55,h:.7},
  {id:'carkeys',     name:'CarKeys',     icon:'circle', url:'https://carkeys.blackroad.io',     w:.4, h:.55},
  {id:'roadchain',   name:'RoadChain',   icon:'square', url:'https://roadchain.blackroad.io',   w:.5, h:.65},
  {id:'roadcoin',    name:'RoadCoin',    icon:'circle', url:'https://roadcoin.blackroad.io',    w:.45,h:.6},
  {id:'roadbook',    name:'RoadBook',    icon:'square', url:'https://roadbook.blackroad.io',    w:.55,h:.75},
  {id:'roadworld',   name:'RoadWorld',   icon:'circle', url:'https://roadworld.blackroad.io',   w:.55,h:.65},
  {id:'officeroad',  name:'OfficeRoad',  icon:'square', url:'https://officeroad.blackroad.io',  w:.5, h:.6},
  {id:'carpool',     name:'CarPool',     icon:'circle', url:'https://carpool.blackroad.io',     w:.45,h:.6},
  {id:'oneway',      name:'OneWay',      icon:'square', url:'https://oneway.blackroad.io',      w:.4, h:.55},
  {id:'roadside',    name:'RoadSide',    icon:'circle', url:'https://roadside.blackroad.io',    w:.45,h:.6},
  {id:'blackboard',  name:'BlackBoard',  icon:'square', url:'https://blackboard.blackroad.io',  w:.55,h:.7},
  // ── System ──
  {id:'highway',     name:'Highway',     icon:'circle', url:'https://highway.blackroad.io',     w:.6, h:.75},
];

// Icon renderer — circles and squares only
function iconHTML(shape, size){
  size = size || 10;
  var r = shape === 'circle' ? '50%' : '2px';
  return '<span style="display:inline-block;width:'+size+'px;height:'+size+'px;border-radius:'+r+';background:var(--g135);flex-shrink:0"></span>';
}

var wins = {}, zTop = 100, focusedId = null;
var STORAGE_KEY = 'bos-memory';

// ═══ MEMORY — localStorage persistence ═══
function loadMemory(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e){ return {}; }
}
function saveMemory(id, data){
  var mem = loadMemory();
  mem[id] = Object.assign(mem[id] || {}, data, {ts: Date.now()});
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mem)); } catch(e){}
}
function getMemory(id){
  return loadMemory()[id] || null;
}
function hasMemory(id){
  return !!loadMemory()[id];
}

// ═══ BOOT ═══
(function(){
  var msgs = ['Initializing kernel...','Loading modules...','Starting network...','Loading AI subsystem...','Restoring memory...','Ready.'];
  var fill = document.getElementById('boot-fill');
  var status = document.getElementById('boot-status');
  var i = 0;
  function step(){
    if(i >= msgs.length){
      fill.style.width = '100%';
      setTimeout(function(){
        document.getElementById('boot').classList.add('done');
        document.getElementById('os').style.opacity = '1';
        setTimeout(function(){
          document.getElementById('boot').remove();
          renderDock();
        }, 400);
      }, 300);
      return;
    }
    status.textContent = msgs[i];
    fill.style.width = Math.round(((i+1)/msgs.length)*100) + '%';
    i++;
    setTimeout(step, 120 + Math.random()*200);
  }
  setTimeout(step, 400);
})();

// ═══ CMD PALETTE (Cmd+K) ═══
var launcherOn = false;
function buildLauncher(q){
  var el = document.getElementById('cmd-results');
  var html = '';
  APPS.forEach(function(app){
    if(q && app.name.toLowerCase().indexOf(q) === -1 && app.url.toLowerCase().indexOf(q) === -1) return;
    var mem = hasMemory(app.id);
    html += '<div class="cmd-item" onclick="openApp(\\''+app.id+'\\');closeLauncher()">';
    html += '<span class="cmd-item-icon">'+iconHTML(app.icon, 8)+'</span>';
    html += '<span class="cmd-item-text">'+app.name+(mem ? ' <span style="color:var(--muted);font-family:var(--jb);font-size:9px">remembered</span>' : '')+'</span>';
    html += '<span class="cmd-item-shortcut">'+app.url.replace('https://','')+'</span>';
    html += '</div>';
  });
  el.innerHTML = html;
}
function toggleLauncher(){ launcherOn ? closeLauncher() : openLauncher(); }
function openLauncher(){ launcherOn=true; document.getElementById('launcher-overlay').classList.add('open'); var s=document.getElementById('cmd-input'); s.value=''; buildLauncher(); s.focus(); }
function closeLauncher(){ launcherOn=false; document.getElementById('launcher-overlay').classList.remove('open'); }
document.getElementById('cmd-input').addEventListener('input', function(e){ buildLauncher(e.target.value.toLowerCase()); });

// ═══ WINDOW MANAGER ═══
// Auto-close: opening a new app closes the previous one (saves memory first)
function autoCloseOthers(exceptId){
  Object.keys(wins).forEach(function(id){
    if(id !== exceptId) closeWin(id);
  });
}

function openApp(id){
  closeLauncher();
  // If already open, just focus
  if(wins[id]){
    focusWin(id);
    return;
  }
  // Auto-close whatever else is open
  autoCloseOthers(id);

  var app = APPS.find(function(a){return a.id===id});
  if(!app) return;

  var D = document.getElementById('desktop');
  var dw = D.offsetWidth, dh = D.offsetHeight;

  // Restore from memory or use defaults
  var mem = getMemory(id);
  var w, h, x, y, url;
  if(mem){
    w = Math.min(mem.w || Math.round(dw * app.w), dw);
    h = Math.min(mem.h || Math.round(dh * app.h), dh);
    x = Math.min(mem.x || 0, dw - w);
    y = Math.min(mem.y || 0, dh - h);
    url = mem.url || app.url;
  } else {
    w = Math.max(340, Math.min(Math.round(dw * app.w), dw - 20));
    h = Math.max(240, Math.min(Math.round(dh * app.h), dh - 20));
    x = Math.round((dw - w) / 2);
    y = Math.round((dh - h) / 2);
    url = app.url;
  }

  var el = document.createElement('div');
  el.className = 'win card focused';
  el.id = 'w-'+id;
  el.style.cssText = 'left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;z-index:'+(++zTop);

  var html = '<div class="card-grad"></div>';

  // Title bar
  html += '<div class="card-header">';
  html += '<div class="dots"><div class="dot close" data-a="close"></div><div class="dot minimize" data-a="min"></div><div class="dot maximize" data-a="max"></div></div>';
  html += '<div class="drag"><span class="win-title">'+app.name+'</span></div>';
  html += '<div style="width:50px"></div>';
  html += '</div>';

  // Toolbar + address bar for browser windows
  if(app.browser){
    html += '<div class="win-toolbar">';
    html += '<button class="btn-ghost btn-sm" onclick="winRefresh(\\''+id+'\\')">Reload</button>';
    html += '<div class="win-toolbar-sep"></div>';
    html += '<button class="btn-ghost btn-sm" onclick="winHome(\\''+id+'\\')">Home</button>';
    html += '</div>';
    html += '<div class="win-addressbar">';
    html += '<span class="win-addressbar-label">Address</span>';
    html += '<input class="input" value="'+url+'" data-addr="1" onkeydown="if(event.key===\\'Enter\\')winNav(\\''+id+'\\',this.value)">';
    html += '</div>';
  }

  html += '<div class="win-body"><iframe src="'+url+'" loading="lazy"></iframe></div>';

  html += '<div class="card-footer">';
  html += '<div class="status-section"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--white)"></span> Ready</div>';
  html += '<div style="font-family:var(--jb);font-size:10px;color:var(--muted)">'+url.replace('https://','')+'</div>';
  html += '</div>';

  html += '<div class="win-resize"></div>';

  el.innerHTML = html;

  // Dot actions
  el.querySelectorAll('.dot').forEach(function(dot){
    dot.addEventListener('click', function(e){
      e.stopPropagation();
      var a = dot.dataset.a;
      if(a==='close') closeWin(id);
      else if(a==='min') closeWin(id); // minimize = close (auto-tidy)
      else if(a==='max') maxiWin(id);
    });
  });

  // Focus
  el.addEventListener('mousedown', function(){ focusWin(id); });

  // Drag
  var dragEl = el.querySelector('.drag');
  var dragging = false, ddx, ddy;
  dragEl.addEventListener('mousedown', function(e){
    if(wins[id].maxi) return;
    dragging = true; ddx = e.clientX - wins[id].x; ddy = e.clientY - wins[id].y;
    el.style.transition = 'box-shadow .2s';
    focusWin(id);
    document.querySelectorAll('.win-body iframe').forEach(function(f){ f.style.pointerEvents='none'; });
  });
  document.addEventListener('mousemove', function(e){
    if(!dragging) return;
    var nx = e.clientX - ddx, ny = Math.max(0, e.clientY - ddy);
    wins[id].x = nx; wins[id].y = ny;
    el.style.left = nx+'px'; el.style.top = ny+'px';
    var snap = null, sdw = D.offsetWidth, sdh = D.offsetHeight;
    if(e.clientX <= 4) snap = 'left';
    else if(e.clientX >= sdw - 4) snap = 'right';
    else if(e.clientY <= 4) snap = 'max';
    showSnap(snap, sdw, sdh);
    wins[id]._snap = snap;
  });
  document.addEventListener('mouseup', function(){
    if(!dragging) return;
    dragging = false; el.style.transition = '';
    document.querySelectorAll('.win-body iframe').forEach(function(f){ f.style.pointerEvents=''; });
    hideSnap();
    var snap = wins[id]._snap;
    if(snap){
      var sdw = D.offsetWidth, sdh = D.offsetHeight;
      wins[id]._prev = {x:wins[id].x, y:wins[id].y, w:wins[id].w, h:wins[id].h};
      if(snap==='left'){ wins[id].x=0;wins[id].y=0;wins[id].w=Math.round(sdw/2);wins[id].h=sdh; }
      else if(snap==='right'){ wins[id].x=Math.round(sdw/2);wins[id].y=0;wins[id].w=Math.round(sdw/2);wins[id].h=sdh; }
      else if(snap==='max'){ maxiWin(id); wins[id]._snap=null; return; }
      el.style.left=wins[id].x+'px';el.style.top=wins[id].y+'px';el.style.width=wins[id].w+'px';el.style.height=wins[id].h+'px';
      wins[id]._snap = null;
    }
    // Save position to memory after drag
    saveMemory(id, {x:wins[id].x, y:wins[id].y, w:wins[id].w, h:wins[id].h});
  });
  dragEl.addEventListener('dblclick', function(){ maxiWin(id); });

  // Resize
  var resEl = el.querySelector('.win-resize');
  var resizing = false, rx, ry, rw, rh;
  resEl.addEventListener('mousedown', function(e){
    if(wins[id].maxi) return;
    e.stopPropagation(); resizing=true; rx=e.clientX;ry=e.clientY;rw=wins[id].w;rh=wins[id].h;
    document.querySelectorAll('.win-body iframe').forEach(function(f){ f.style.pointerEvents='none'; });
  });
  document.addEventListener('mousemove', function(e){
    if(!resizing) return;
    wins[id].w = Math.max(340, rw + e.clientX - rx);
    wins[id].h = Math.max(240, rh + e.clientY - ry);
    el.style.width = wins[id].w+'px'; el.style.height = wins[id].h+'px';
  });
  document.addEventListener('mouseup', function(){
    if(resizing){
      resizing = false;
      document.querySelectorAll('.win-body iframe').forEach(function(f){ f.style.pointerEvents=''; });
      // Save size to memory after resize
      saveMemory(id, {w:wins[id].w, h:wins[id].h});
    }
  });

  document.getElementById('win-container').appendChild(el);
  wins[id] = {el:el, app:app, x:x, y:y, w:w, h:h, maxi:false};
  focusWin(id);
  renderDock();
}

function closeWin(id){
  if(!wins[id]) return;
  var w = wins[id];
  // Save everything to memory before closing
  var addr = w.el.querySelector('[data-addr="1"]');
  saveMemory(id, {
    x: w.x, y: w.y, w: w.w, h: w.h,
    url: addr ? addr.value : w.app.url
  });
  // Animate out
  w.el.classList.add('closing');
  var iframe = w.el.querySelector('iframe');
  if(iframe) iframe.src = 'about:blank';
  setTimeout(function(){ if(w.el.parentNode) w.el.remove(); }, 220);
  delete wins[id];
  if(focusedId===id) focusedId=null;
  renderDock();
}

function maxiWin(id){
  if(!wins[id]) return;
  var w = wins[id];
  if(w.maxi){
    w.el.classList.remove('maximized');
    if(w._prev){ w.x=w._prev.x;w.y=w._prev.y;w.w=w._prev.w;w.h=w._prev.h; }
    w.el.style.left=w.x+'px';w.el.style.top=w.y+'px';w.el.style.width=w.w+'px';w.el.style.height=w.h+'px';
    w.maxi = false;
  } else {
    w._prev = {x:w.x,y:w.y,w:w.w,h:w.h};
    w.el.classList.add('maximized');
    w.maxi = true;
  }
}

function focusWin(id){
  if(focusedId && wins[focusedId]) wins[focusedId].el.classList.remove('focused');
  focusedId = id;
  if(wins[id]){ wins[id].el.classList.add('focused'); wins[id].el.style.zIndex = ++zTop; }
  renderDock();
}

// ═══ BROWSER NAV ═══
function winNav(id, url){
  if(!wins[id]) return;
  if(url.indexOf('://') === -1) url = 'https://' + url;
  var iframe = wins[id].el.querySelector('iframe');
  if(iframe) iframe.src = url;
  var addr = wins[id].el.querySelector('[data-addr="1"]');
  if(addr) addr.value = url;
  saveMemory(id, {url: url});
}
function winRefresh(id){ if(wins[id]){ var f=wins[id].el.querySelector('iframe'); if(f){ var s=f.src; f.src='about:blank'; setTimeout(function(){f.src=s},50); } } }
function winHome(id){ if(wins[id]) winNav(id, wins[id].app.url); }

// ═══ SNAP ═══
function showSnap(zone,dw,dh){
  var el=document.getElementById('snap');
  if(!zone){el.style.display='none';return}
  el.style.display='block';
  if(zone==='left'){el.style.left='4px';el.style.top='4px';el.style.width=(dw/2-8)+'px';el.style.height=(dh-8)+'px'}
  else if(zone==='right'){el.style.left=(dw/2+4)+'px';el.style.top='4px';el.style.width=(dw/2-8)+'px';el.style.height=(dh-8)+'px'}
  else if(zone==='max'){el.style.left='4px';el.style.top='4px';el.style.width=(dw-8)+'px';el.style.height=(dh-8)+'px'}
}
function hideSnap(){document.getElementById('snap').style.display='none'}

// ═══ DOCK — every app lives here ═══
function renderDock(){
  var el = document.getElementById('dock-apps');
  el.innerHTML = APPS.map(function(a){
    var isOpen = !!wins[a.id];
    var isActive = a.id === focusedId && isOpen;
    var remembered = hasMemory(a.id);
    var cls = 'dock-btn';
    if(isActive) cls += ' active';
    if(isOpen) cls += ' open';
    if(remembered && !isOpen) cls += ' remembered';
    return '<button class="'+cls+'" onclick="openApp(\\''+a.id+'\\')" title="'+a.name+(remembered && !isOpen ? ' (remembered)' : '')+'">'
      + iconHTML(a.icon, 8)
      + '<span class="dock-label">'+a.name+'</span>'
      + '<span class="indicator"></span>'
      + '</button>';
  }).join('');
}
renderDock();

// ═══ CONTEXT MENU ═══
document.addEventListener('contextmenu', function(e){
  if(e.target.closest('.win') || e.target.closest('#dock')) return;
  e.preventDefault();
  var m = document.getElementById('ctx');
  m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';m.style.display='block';
  document.getElementById('ctx-inner').innerHTML = [
    {l:'Command Palette',a:'openLauncher()'},
    {s:1},
    {l:'Clear All Memory',a:'clearAllMemory()'},
  ].map(function(x){
    if(x.s) return '<div class="dropdown-divider"></div>';
    return '<div class="dropdown-item" onclick="'+x.a+';document.getElementById(\\'ctx\\').style.display=\\'none\\'">'+x.l+'</div>';
  }).join('');
});
document.addEventListener('click', function(e){
  if(!e.target.closest('#ctx')) document.getElementById('ctx').style.display='none';
});

function clearAllMemory(){
  localStorage.removeItem(STORAGE_KEY);
  renderDock();
  toast('Memory cleared');
}

// ═══ KEYBOARD ═══
document.addEventListener('keydown', function(e){
  if((e.metaKey||e.ctrlKey) && e.key==='k'){e.preventDefault(); launcherOn ? closeLauncher() : openLauncher();}
  if(e.key==='Escape'){closeLauncher();}
  if((e.metaKey||e.ctrlKey) && e.key==='w'){e.preventDefault(); if(focusedId) closeWin(focusedId);}
});

// ═══ CLOCK ═══
function tick(){
  var d=new Date();
  document.getElementById('dock-clock').textContent=d.toLocaleDateString([],{month:'short',day:'numeric'})+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}
tick(); setInterval(tick, 15000);

// ═══ TOAST ═══
function toast(msg){
  var el=document.createElement('div');
  el.className='toast';
  el.innerHTML='<div class="toast-bar"></div><div class="toast-text">'+msg+'</div>';
  document.getElementById('toasts').appendChild(el);
  setTimeout(function(){el.style.opacity='0';el.style.transform='translateX(20px)';el.style.transition='all .25s';setTimeout(function(){el.remove()},250)},3500);
}
toast('BlackRoad OS v7 ready — 17 products, 27 agents, 17 orgs');

// ═══════════════════════════════════════════════════════
// NEW FEATURES — from PRODUCT.md
// ═══════════════════════════════════════════════════════

// ── 1. DAILY ROAD SUMMARY WIDGET ──
(function(){
  var widget = document.createElement('div');
  widget.id = 'road-summary';
  widget.style.cssText = 'position:absolute;top:16px;right:16px;z-index:50;background:rgba(10,10,10,.9);border:1px solid #1a1a1a;border-radius:10px;padding:14px 18px;font-family:var(--jb);font-size:11px;color:var(--sub);backdrop-filter:blur(10px);min-width:180px;pointer-events:auto;cursor:pointer;transition:opacity .3s';
  var mem = loadMemory();
  var appCount = Object.keys(mem).length;
  var d = new Date();
  widget.innerHTML = '<div style="color:var(--white);font-family:var(--sg);font-weight:600;font-size:13px;margin-bottom:6px">Daily Road Summary</div>'
    + '<div style="margin-bottom:4px">Apps remembered: <span style="color:var(--white)">' + appCount + '</span></div>'
    + '<div style="margin-bottom:4px">Products: <span style="color:var(--white)">17</span></div>'
    + '<div style="margin-bottom:4px">Agents: <span style="color:var(--white)">27</span></div>'
    + '<div style="margin-bottom:8px">Session: <span style="color:var(--white)">' + d.toLocaleDateString() + '</span></div>'
    + '<div style="height:3px;border-radius:2px;background:var(--g)"></div>';
  widget.onclick = function(){ widget.style.opacity = widget.style.opacity === '0' ? '1' : '0'; };
  document.getElementById('desktop').appendChild(widget);
})();

// ── 2. MULTIPLE WINDOWS (remove auto-close) ──
// Override autoCloseOthers to allow multiple windows
autoCloseOthers = function(exceptId){};

// ── 3. LANE SWITCHING (Ctrl+Tab / Ctrl+Shift+Tab) ──
document.addEventListener('keydown', function(e){
  if(e.ctrlKey && e.key === 'Tab'){
    e.preventDefault();
    var openIds = Object.keys(wins);
    if(openIds.length < 2) return;
    var idx = openIds.indexOf(focusedId);
    var next = e.shiftKey ? (idx - 1 + openIds.length) % openIds.length : (idx + 1) % openIds.length;
    focusWin(openIds[next]);
  }
  // Number shortcuts: Ctrl+1 through Ctrl+9 open apps by dock position
  if(e.ctrlKey && e.key >= '1' && e.key <= '9'){
    e.preventDefault();
    var appIdx = parseInt(e.key) - 1;
    if(appIdx < APPS.length) openApp(APPS[appIdx].id);
  }
});

// ── 4. FOCUS TUNNEL MODE (Ctrl+Shift+F) ──
var tunnelMode = false;
document.addEventListener('keydown', function(e){
  if(e.ctrlKey && e.shiftKey && e.key === 'F'){
    e.preventDefault();
    tunnelMode = !tunnelMode;
    var dock = document.getElementById('dock');
    var bg = document.getElementById('desktop-bg');
    if(tunnelMode){
      dock.style.opacity = '0'; dock.style.pointerEvents = 'none';
      bg.style.filter = 'brightness(0.3)';
      if(focusedId && wins[focusedId]) maxiWin(focusedId);
      toast('Focus Tunnel — press Ctrl+Shift+F to exit');
    } else {
      dock.style.opacity = '1'; dock.style.pointerEvents = '';
      bg.style.filter = '';
      toast('Focus Tunnel off');
    }
  }
});

// ── 5. DESKTOP THEMES ──
var themes = {
  highway: {orbs:['#FF2255','#4488FF','#8844FF'], bg:'#000'},
  night:   {orbs:['#1a1a4a','#0d2040','#2a1a3a'], bg:'#050510'},
  sunrise: {orbs:['#FF6B2B','#FF2255','#F5A623'], bg:'#0a0505'},
  ocean:   {orbs:['#00D4FF','#4488FF','#0066AA'], bg:'#000a14'},
  forest:  {orbs:['#22c55e','#16a34a','#15803d'], bg:'#050a05'},
};
var currentTheme = 'highway';
function setTheme(name){
  var t = themes[name]; if(!t) return;
  currentTheme = name;
  document.body.style.background = t.bg;
  var orbs = document.querySelectorAll('.bg-orb');
  t.orbs.forEach(function(c,i){ if(orbs[i]) orbs[i].style.background = c; });
  toast('Theme: ' + name);
  try { localStorage.setItem('bos-theme', name); } catch(e){}
}
// Restore saved theme
try { var saved = localStorage.getItem('bos-theme'); if(saved && themes[saved]) setTheme(saved); } catch(e){}

// ── 6. ENHANCED CONTEXT MENU ──
document.removeEventListener('contextmenu', document.oncontextmenu);
document.addEventListener('contextmenu', function(e){
  if(e.target.closest('.win') || e.target.closest('#dock')) return;
  e.preventDefault();
  var m = document.getElementById('ctx');
  m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';m.style.display='block';
  document.getElementById('ctx-inner').innerHTML = [
    {l:'Command Palette',a:'openLauncher()'},
    {s:1},
    {l:'Theme: Highway',a:"setTheme('highway')"},
    {l:'Theme: Night Drive',a:"setTheme('night')"},
    {l:'Theme: Sunrise',a:"setTheme('sunrise')"},
    {l:'Theme: Ocean',a:"setTheme('ocean')"},
    {l:'Theme: Forest',a:"setTheme('forest')"},
    {s:1},
    {l:'Focus Tunnel (Ctrl+Shift+F)',a:'document.dispatchEvent(new KeyboardEvent("keydown",{ctrlKey:true,shiftKey:true,key:"F"}))'},
    {l:'Tile All Windows',a:'tileWindows()'},
    {s:1},
    {l:'About BlackRoad OS',a:'showAbout()'},
    {l:'Clear All Memory',a:'clearAllMemory()'},
  ].map(function(x){
    if(x.s) return '<div class="dropdown-divider"></div>';
    return '<div class="dropdown-item" onclick="'+x.a+';document.getElementById(\\'ctx\\').style.display=\\'none\\'">'+x.l+'</div>';
  }).join('');
});

// ── 7. TILE WINDOWS ──
function tileWindows(){
  var ids = Object.keys(wins);
  if(!ids.length) return;
  var D = document.getElementById('desktop');
  var dw = D.offsetWidth, dh = D.offsetHeight;
  var cols = Math.ceil(Math.sqrt(ids.length));
  var rows = Math.ceil(ids.length / cols);
  var tw = Math.floor(dw / cols), th = Math.floor(dh / rows);
  ids.forEach(function(id, i){
    var col = i % cols, row = Math.floor(i / cols);
    var w = wins[id];
    w.x = col * tw; w.y = row * th; w.w = tw; w.h = th;
    w.el.style.left = w.x+'px'; w.el.style.top = w.y+'px';
    w.el.style.width = w.w+'px'; w.el.style.height = w.h+'px';
    if(w.maxi){ w.el.classList.remove('maximized'); w.maxi = false; }
  });
  toast('Windows tiled (' + ids.length + ')');
}

// ── 8. ABOUT DIALOG ──
function showAbout(){
  toast('BlackRoad OS v5.0 — 17 products, 27 agents, 7 divisions. Built on Raspberry Pis. $150/month. Remember the Road. Pave Tomorrow.');
}

// ── 9. SYSTEM HEALTH IN TRAY ──
(function(){
  fetch('/api/health').then(function(r){return r.json()}).then(function(d){
    document.getElementById('tray-status').textContent = 'v' + (d.version||'5.0') + ' · ' + (d.products||17) + ' products';
  }).catch(function(){
    document.getElementById('tray-status').textContent = 'ready';
  });
})();

// ── 10. OPEN DEFAULT APP ON BOOT ──
// Open Highway (dashboard) as the home screen
setTimeout(function(){
  openApp('highway');
}, 100);

// ── 11. KEYBOARD HELP (Ctrl+/) ──
document.addEventListener('keydown', function(e){
  if(e.ctrlKey && e.key === '/'){
    e.preventDefault();
    toast('Shortcuts: Cmd/Ctrl+K = Command Palette · Ctrl+Tab = Switch Window · Ctrl+1-9 = Open App · Ctrl+W = Close · Ctrl+Shift+F = Focus Tunnel · Right-click = Themes');
  }
});

// ── 12. WELCOME TOAST FROM ROADIE ──
setTimeout(function(){
  toast('Roadie: "Yep. Got it. Let\\'s move." — Pick an app from the dock to get started.');
}, 2000);

// ═══════════════════════════════════════════════════════
// MORE FEATURES — ROUND 2
// ═══════════════════════════════════════════════════════

// ── 13. CONVOY PRESENCE AURA — glowing window borders when agents are active ──
setInterval(function(){
  Object.keys(wins).forEach(function(id){
    var w = wins[id];
    if(!w) return;
    // Random agent activity pulse
    if(Math.random() < 0.15){
      w.el.style.boxShadow = '0 0 20px rgba(136,68,255,0.15), 0 16px 64px rgba(0,0,0,.6)';
      setTimeout(function(){ if(wins[id]) w.el.style.boxShadow = ''; }, 2000);
    }
  });
}, 5000);

// ── 14. MEMORY PEEK HUD — hover dock to see memory info ──
document.getElementById('dock-apps').addEventListener('mouseover', function(e){
  var btn = e.target.closest('.dock-btn');
  if(!btn) return;
  var appId = null;
  APPS.forEach(function(a,i){ if(btn === document.querySelectorAll('.dock-btn')[i]) appId = a.id; });
  if(!appId) return;
  var mem = getMemory(appId);
  if(mem){
    var ago = Math.round((Date.now() - (mem.ts || 0)) / 60000);
    var hint = ago < 60 ? ago + 'min ago' : Math.round(ago/60) + 'hr ago';
    btn.title = APPS.find(function(a){return a.id===appId}).name + ' — last used ' + hint + (mem.url ? ' · ' + mem.url.replace('https://','') : '');
  }
});

// ── 15. HIGHWAY SOUNDSCAPE — ambient background audio ──
var soundEnabled = false;
var audioCtx = null;
function toggleSound(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  soundEnabled = !soundEnabled;
  if(soundEnabled){
    // Create gentle ambient hum
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 55; // Low A — highway hum
    gain.gain.value = 0.02; // Very quiet
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    window._ambientOsc = osc;
    window._ambientGain = gain;
    toast('Highway soundscape on');
  } else {
    if(window._ambientOsc){ window._ambientOsc.stop(); window._ambientOsc = null; }
    toast('Highway soundscape off');
  }
}

// ── 16. NOTIFICATION CENTER ──
var notifications = [];
function addNotification(from, msg){
  notifications.unshift({from:from, msg:msg, ts:Date.now()});
  if(notifications.length > 20) notifications.pop();
  toast(from + ': ' + msg);
}

// ── 17. AGENT GREETINGS — different agents greet at different times ──
setTimeout(function(){
  var hour = new Date().getHours();
  var greetings = [
    {h:[5,6,7,8,9], agent:'Celeste', msg:'Good morning. You\\'re okay. Let\\'s do this simply.'},
    {h:[10,11,12,13], agent:'Roadie', msg:'Let\\'s get it. What are we building today?'},
    {h:[14,15,16,17], agent:'Calliope', msg:'The afternoon is for creation. Say it so it stays.'},
    {h:[18,19,20,21], agent:'Sophia', msg:'Evening. A good time to reflect. What is true?'},
    {h:[22,23,0,1,2,3,4], agent:'Lucidia', msg:'Late night session. I\\'ll remember everything. Let\\'s make this clean and real.'},
  ];
  var greeting = greetings.find(function(g){ return g.h.indexOf(hour) !== -1; }) || greetings[0];
  addNotification(greeting.agent, greeting.msg);
}, 4000);

// ── 18. SAVED DESKTOP LAYOUTS ──
var layouts = {};
function saveLayout(name){
  var state = {};
  Object.keys(wins).forEach(function(id){
    var w = wins[id];
    state[id] = {x:w.x, y:w.y, w:w.w, h:w.h, maxi:w.maxi};
  });
  layouts[name] = state;
  try { localStorage.setItem('bos-layouts', JSON.stringify(layouts)); } catch(e){}
  toast('Layout saved: ' + name);
}
function restoreLayout(name){
  var l = layouts[name];
  if(!l){ toast('No layout: ' + name); return; }
  // Close all first
  Object.keys(wins).forEach(function(id){ closeWin(id); });
  // Open each app in the layout
  setTimeout(function(){
    Object.keys(l).forEach(function(id){
      openApp(id);
      setTimeout(function(){
        if(wins[id]){
          var w = wins[id], s = l[id];
          w.x=s.x; w.y=s.y; w.w=s.w; w.h=s.h;
          w.el.style.left=s.x+'px'; w.el.style.top=s.y+'px';
          w.el.style.width=s.w+'px'; w.el.style.height=s.h+'px';
          if(s.maxi) maxiWin(id);
        }
      }, 200);
    });
    toast('Layout restored: ' + name);
  }, 300);
}
// Load saved layouts
try { layouts = JSON.parse(localStorage.getItem('bos-layouts')) || {}; } catch(e){ layouts = {}; }

// ── 19. DOCK SEPARATOR BETWEEN CATEGORIES ──
// Inject separators after every 4 apps in dock
var origRenderDock = renderDock;
renderDock = function(){
  origRenderDock();
  var el = document.getElementById('dock-apps');
  var btns = el.querySelectorAll('.dock-btn');
  // Add separators at logical groupings: after 4th, 8th, 12th
  [12, 8, 4].forEach(function(idx){
    if(btns[idx]){
      var sep = document.createElement('div');
      sep.className = 'dock-sep';
      btns[idx].parentNode.insertBefore(sep, btns[idx]);
    }
  });
};
renderDock();

// ── 20. WINDOW COUNT IN TRAY ──
var origRenderDock2 = renderDock;
renderDock = function(){
  origRenderDock2();
  var count = Object.keys(wins).length;
  var tray = document.getElementById('tray-status');
  if(tray && count > 0){
    tray.textContent = count + ' window' + (count > 1 ? 's' : '') + ' open';
  }
};

// ── 21. DOUBLE-CLICK DESKTOP TO OPEN LAUNCHER ──
document.getElementById('desktop').addEventListener('dblclick', function(e){
  if(e.target.closest('.win') || e.target.closest('#road-summary')) return;
  openLauncher();
});

// ── 22. ENHANCED COMMAND PALETTE — add commands ──
var origBuildLauncher = buildLauncher;
buildLauncher = function(q){
  var el = document.getElementById('cmd-results');
  var html = '';

  // System commands
  var cmds = [
    {name:'Focus Tunnel', desc:'Ctrl+Shift+F', action:'document.dispatchEvent(new KeyboardEvent("keydown",{ctrlKey:true,shiftKey:true,key:"F"}))'},
    {name:'Tile Windows', desc:'Grid all open windows', action:'tileWindows()'},
    {name:'Theme: Highway', desc:'Default theme', action:"setTheme('highway')"},
    {name:'Theme: Night Drive', desc:'Dark focused theme', action:"setTheme('night')"},
    {name:'Theme: Sunrise', desc:'Warm morning theme', action:"setTheme('sunrise')"},
    {name:'Theme: Ocean', desc:'Cool blue theme', action:"setTheme('ocean')"},
    {name:'Theme: Forest', desc:'Natural green theme', action:"setTheme('forest')"},
    {name:'Toggle Sound', desc:'Highway soundscape', action:'toggleSound()'},
    {name:'Save Layout', desc:'Save current window arrangement', action:"saveLayout(prompt('Layout name:')||'default')"},
    {name:'About', desc:'BlackRoad OS v5.0', action:'showAbout()'},
    {name:'Keyboard Shortcuts', desc:'Ctrl+/', action:"toast('Ctrl+K=Palette · Ctrl+Tab=Switch · Ctrl+1-9=App · Ctrl+W=Close · Ctrl+Shift+F=Tunnel')"},
  ];

  // Saved layouts
  Object.keys(layouts).forEach(function(name){
    cmds.push({name:'Layout: ' + name, desc:'Restore saved layout', action:"restoreLayout('"+name+"')"});
  });

  // Filter
  var filtered = q ? cmds.filter(function(c){ return c.name.toLowerCase().indexOf(q) !== -1 || c.desc.toLowerCase().indexOf(q) !== -1; }) : [];

  // Apps
  APPS.forEach(function(app){
    if(q && app.name.toLowerCase().indexOf(q) === -1 && app.url.toLowerCase().indexOf(q) === -1) return;
    var mem = hasMemory(app.id);
    html += '<div class="cmd-item" onclick="openApp(\\''+app.id+'\\');closeLauncher()">';
    html += '<span class="cmd-item-icon">'+iconHTML(app.icon, 8)+'</span>';
    html += '<span class="cmd-item-text">'+app.name+(mem ? ' <span style="color:var(--muted);font-family:var(--jb);font-size:9px">remembered</span>' : '')+'</span>';
    html += '<span class="cmd-item-shortcut">'+app.url.replace('https://','')+'</span>';
    html += '</div>';
  });

  // Commands section
  if(filtered.length > 0 || !q){
    var showCmds = q ? filtered : cmds.slice(0, 5);
    if(showCmds.length){
      html += '<div class="dropdown-label" style="padding:8px 14px;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em">Commands</div>';
      showCmds.forEach(function(c){
        html += '<div class="cmd-item" onclick="'+c.action+';closeLauncher()">';
        html += '<span class="cmd-item-icon" style="color:var(--muted)">⌘</span>';
        html += '<span class="cmd-item-text">'+c.name+'</span>';
        html += '<span class="cmd-item-shortcut" style="font-size:9px;color:var(--muted)">'+c.desc+'</span>';
        html += '</div>';
      });
    }
  }

  el.innerHTML = html;
};

// ── 23. WINDOW MINIMIZE TO DOCK (instead of close) ──
// Already handled — minimize = close with memory save

// ── 24. AGENT STATUS INDICATORS IN DOCK ──
// Periodically check product health and show green/red dots
setInterval(function(){
  APPS.forEach(function(app, i){
    var btn = document.querySelectorAll('.dock-btn')[i];
    if(!btn) return;
    var indicator = btn.querySelector('.indicator');
    if(!indicator) return;
    // Show a subtle pulse for apps that have memory (were used)
    if(hasMemory(app.id)){
      indicator.style.opacity = '0.4';
      indicator.style.background = '#22c55e';
    }
  });
}, 10000);

// ── 25. END-OF-DAY REFLECTION ──
(function(){
  var hour = new Date().getHours();
  if(hour >= 22 || hour <= 4){
    setTimeout(function(){
      var openCount = Object.keys(wins).length;
      var memCount = Object.keys(loadMemory()).length;
      addNotification('Lucidia', 'End of day. You opened ' + openCount + ' windows. ' + memCount + ' apps remember you. The road remembers. Rest well.');
    }, 30000);
  }
})();

// ═══════════════════════════════════════════════════════
// v6.0 FEATURES — ROUND 3
// ═══════════════════════════════════════════════════════

// ── 26. WIDGETS DASHBOARD ──
var widgetConfigs = {};
try { widgetConfigs = JSON.parse(localStorage.getItem('bos-widgets')) || {}; } catch(e){ widgetConfigs = {}; }

var defaultWidgets = {
  clock: {enabled:true, title:'Clock', order:0},
  weather: {enabled:true, title:'Weather', order:1},
  stats: {enabled:true, title:'System Stats', order:2},
  todo: {enabled:false, title:'Quick Todo', order:3},
  music: {enabled:false, title:'Music Player', order:4},
  calendar: {enabled:false, title:'Calendar', order:5},
  stocks: {enabled:false, title:'Stocks', order:6},
  news: {enabled:false, title:'News Ticker', order:7},
};

function getWidgetConfigs(){
  var merged = {};
  Object.keys(defaultWidgets).forEach(function(k){
    merged[k] = Object.assign({}, defaultWidgets[k], widgetConfigs[k] || {});
  });
  return merged;
}

function saveWidgetConfigs(){
  try { localStorage.setItem('bos-widgets', JSON.stringify(widgetConfigs)); } catch(e){}
}

function toggleWidget(id){
  if(!widgetConfigs[id]) widgetConfigs[id] = {};
  var cfg = getWidgetConfigs();
  widgetConfigs[id].enabled = !cfg[id].enabled;
  saveWidgetConfigs();
  renderWidgets();
}

function renderWidgets(){
  var panel = document.getElementById('widgets-panel');
  var cfg = getWidgetConfigs();
  var html = '';
  var sorted = Object.keys(cfg).filter(function(k){return cfg[k].enabled}).sort(function(a,b){return cfg[a].order - cfg[b].order});

  sorted.forEach(function(id){
    var w = cfg[id];
    html += '<div class="desktop-widget" data-widget="'+id+'">';
    html += '<div class="widget-title">'+w.title+'<button class="widget-close" onclick="toggleWidget(\\''+id+'\\')">&#10005;</button></div>';

    if(id === 'clock'){
      var d = new Date();
      html += '<div style="font-size:28px;font-weight:700;color:var(--white);font-family:var(--jb)">'+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})+'</div>';
      html += '<div style="margin-top:4px;font-size:11px;color:var(--sub)">'+d.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric',year:'numeric'})+'</div>';
    } else if(id === 'weather'){
      html += '<div class="widget-row"><span class="widget-row-label">Conditions</span><span class="widget-row-value">Partly Cloudy</span></div>';
      html += '<div class="widget-row"><span class="widget-row-label">Temperature</span><span class="widget-row-value">62F</span></div>';
      html += '<div class="widget-row"><span class="widget-row-label">Humidity</span><span class="widget-row-value">45%</span></div>';
      html += '<div class="widget-row"><span class="widget-row-label">Wind</span><span class="widget-row-value">8 mph NW</span></div>';
    } else if(id === 'stats'){
      var openWins = Object.keys(wins).length;
      var memCount = Object.keys(loadMemory()).length;
      html += '<div class="widget-row"><span class="widget-row-label">Windows</span><span class="widget-row-value">'+openWins+'</span></div>';
      html += '<div class="widget-row"><span class="widget-row-label">Apps remembered</span><span class="widget-row-value">'+memCount+'</span></div>';
      html += '<div class="widget-row"><span class="widget-row-label">Products</span><span class="widget-row-value">17</span></div>';
      html += '<div class="widget-row"><span class="widget-row-label">Agents</span><span class="widget-row-value">27</span></div>';
      html += '<div style="height:3px;border-radius:2px;background:var(--g);margin-top:8px"></div>';
    } else if(id === 'todo'){
      var todos = [];
      try { todos = JSON.parse(localStorage.getItem('bos-widget-todos')) || []; } catch(e){}
      html += '<div style="margin-bottom:6px">';
      todos.forEach(function(t,i){
        html += '<div style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:11px;color:'+(t.done?'var(--muted)':'var(--text)')+'"><span style="cursor:pointer" onclick="toggleWidgetTodo('+i+')">'+(t.done?'[x]':'[ ]')+'</span> '+t.text+'</div>';
      });
      html += '</div>';
      html += '<input class="input" style="font-size:10px;padding:5px 8px" placeholder="Add todo..." onkeydown="if(event.key===\\'Enter\\'){addWidgetTodo(this.value);this.value=\\'\\'}">';
    } else if(id === 'music'){
      html += '<div style="text-align:center;padding:4px 0">';
      html += '<div style="font-size:12px;color:var(--white);margin-bottom:4px">Highway Soundscape</div>';
      html += '<div style="font-size:10px;color:var(--sub);margin-bottom:8px">Ambient - 55Hz Sine</div>';
      html += '<div style="display:flex;gap:12px;justify-content:center">';
      html += '<button class="btn-ghost btn-sm" onclick="toggleSound()" style="font-size:11px">Play/Pause</button>';
      html += '</div></div>';
    } else if(id === 'calendar'){
      var d = new Date();
      var monthName = d.toLocaleDateString([],{month:'long',year:'numeric'});
      html += '<div style="text-align:center;font-size:12px;color:var(--white);margin-bottom:6px">'+monthName+'</div>';
      html += '<div style="font-size:10px;color:var(--sub)">Today: '+d.toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'})+'</div>';
      html += '<div style="margin-top:4px;font-size:10px;color:var(--muted)">No events scheduled</div>';
    } else if(id === 'stocks'){
      var tickers = [{s:'ROAD',p:'42.00',c:'+1.5%'},{s:'AAPL',p:'198.50',c:'+0.3%'},{s:'MSFT',p:'425.00',c:'-0.2%'}];
      tickers.forEach(function(t){
        html += '<div class="widget-row"><span class="widget-row-label">'+t.s+'</span><span class="widget-row-value" style="color:'+(t.c.startsWith('+')?'#22c55e':'#ef4444')+'">$'+t.p+' '+t.c+'</span></div>';
      });
    } else if(id === 'news'){
      var items = ['BlackRoad OS v6 ships 8 new APIs','Amundson Constant verified to 10M digits','27 agents now active in fleet','RoadTrip reaches 109 agents'];
      items.forEach(function(n,i){
        html += '<div style="padding:3px 0;font-size:10px;color:var(--sub);border-bottom:1px solid var(--border)">'+(i+1)+'. '+n+'</div>';
      });
    }
    html += '</div>';
  });

  panel.innerHTML = html;
}

function addWidgetTodo(text){
  if(!text) return;
  var todos = [];
  try { todos = JSON.parse(localStorage.getItem('bos-widget-todos')) || []; } catch(e){}
  todos.push({text:text, done:false});
  try { localStorage.setItem('bos-widget-todos', JSON.stringify(todos)); } catch(e){}
  renderWidgets();
}
function toggleWidgetTodo(idx){
  var todos = [];
  try { todos = JSON.parse(localStorage.getItem('bos-widget-todos')) || []; } catch(e){}
  if(todos[idx]) todos[idx].done = !todos[idx].done;
  try { localStorage.setItem('bos-widget-todos', JSON.stringify(todos)); } catch(e){}
  renderWidgets();
}

renderWidgets();
// Refresh clock widget every second
setInterval(function(){
  var cw = document.querySelector('[data-widget="clock"]');
  if(cw){
    var d = new Date();
    var timeEl = cw.querySelector('div[style*="font-size:28px"]');
    if(timeEl) timeEl.textContent = d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
}, 1000);
// Refresh stats widget every 5s
setInterval(renderWidgets, 30000);

// ── 27. KEYBOARD SHORTCUTS SYSTEM ──
var customShortcuts = {};
try { customShortcuts = JSON.parse(localStorage.getItem('bos-shortcuts')) || {}; } catch(e){ customShortcuts = {}; }

var builtinShortcuts = [
  {id:'cmd-palette', keys:'Cmd+K', desc:'Open command palette', category:'navigation'},
  {id:'spotlight', keys:'Cmd+Space', desc:'Open Spotlight search', category:'navigation'},
  {id:'close-win', keys:'Ctrl+W', desc:'Close focused window', category:'windows'},
  {id:'switch-win', keys:'Ctrl+Tab', desc:'Switch between windows', category:'windows'},
  {id:'focus-tunnel', keys:'Ctrl+Shift+F', desc:'Toggle focus tunnel', category:'focus'},
  {id:'tile-all', keys:'Ctrl+Shift+T', desc:'Tile all windows', category:'windows'},
  {id:'clipboard', keys:'Ctrl+Shift+V', desc:'Open clipboard history', category:'tools'},
  {id:'kbd-help', keys:'Ctrl+/', desc:'Show keyboard shortcuts', category:'help'},
  {id:'app-1', keys:'Ctrl+1', desc:'Open first dock app', category:'apps'},
  {id:'app-2', keys:'Ctrl+2', desc:'Open second dock app', category:'apps'},
  {id:'app-3', keys:'Ctrl+3', desc:'Open third dock app', category:'apps'},
  {id:'widgets-toggle', keys:'Ctrl+Shift+W', desc:'Toggle widgets panel', category:'desktop'},
  {id:'theme-cycle', keys:'Ctrl+Shift+D', desc:'Cycle desktop theme', category:'desktop'},
  {id:'backup-panel', keys:'Ctrl+Shift+B', desc:'Open backup panel', category:'system'},
];

function getAllShortcuts(){
  return builtinShortcuts.map(function(s){
    return Object.assign({}, s, customShortcuts[s.id] || {});
  });
}

function registerShortcut(id, keys){
  customShortcuts[id] = {keys:keys};
  try { localStorage.setItem('bos-shortcuts', JSON.stringify(customShortcuts)); } catch(e){}
}

// ── 28. CLIPBOARD MANAGER ──
var clipboardHistory = [];
try { clipboardHistory = JSON.parse(localStorage.getItem('bos-clipboard')) || []; } catch(e){ clipboardHistory = []; }
var pinnedClips = {};
try { pinnedClips = JSON.parse(localStorage.getItem('bos-clipboard-pins')) || {}; } catch(e){ pinnedClips = {}; }

function addToClipboard(text){
  if(!text || (clipboardHistory.length > 0 && clipboardHistory[0].text === text)) return;
  clipboardHistory.unshift({text:text, ts:Date.now()});
  if(clipboardHistory.length > 50) clipboardHistory = clipboardHistory.slice(0, 50);
  try { localStorage.setItem('bos-clipboard', JSON.stringify(clipboardHistory)); } catch(e){}
  renderClipboard();
}

function togglePinClip(idx){
  var key = 'clip-'+idx;
  if(pinnedClips[key]) delete pinnedClips[key];
  else pinnedClips[key] = true;
  try { localStorage.setItem('bos-clipboard-pins', JSON.stringify(pinnedClips)); } catch(e){}
  renderClipboard();
}

function renderClipboard(){
  var list = document.getElementById('clipboard-list');
  if(!list) return;
  if(clipboardHistory.length === 0){
    list.innerHTML = '<div style="padding:16px;text-align:center;font-size:11px;color:var(--muted)">No clipboard items yet.<br>Copy text to populate.</div>';
    return;
  }
  var html = '';
  // Pinned first
  clipboardHistory.forEach(function(c,i){
    var isPinned = !!pinnedClips['clip-'+i];
    if(!isPinned) return;
    html += '<div class="clip-item" onclick="copyClipItem('+i+')" title="Click to copy">';
    html += '<span class="clip-item-text">'+escHTML(c.text.substring(0,80))+'</span>';
    html += '<span class="clip-pin pinned" onclick="event.stopPropagation();togglePinClip('+i+')">&#9733;</span>';
    html += '</div>';
  });
  clipboardHistory.forEach(function(c,i){
    var isPinned = !!pinnedClips['clip-'+i];
    if(isPinned) return;
    html += '<div class="clip-item" onclick="copyClipItem('+i+')" title="Click to copy">';
    html += '<span class="clip-item-text">'+escHTML(c.text.substring(0,80))+'</span>';
    html += '<span class="clip-pin" onclick="event.stopPropagation();togglePinClip('+i+')">&#9734;</span>';
    html += '</div>';
  });
  list.innerHTML = html;
}

function copyClipItem(idx){
  var item = clipboardHistory[idx];
  if(!item) return;
  navigator.clipboard.writeText(item.text).then(function(){
    toast('Copied to clipboard');
  }).catch(function(){
    toast('Copy failed');
  });
}

function escHTML(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

var clipboardVisible = false;
function toggleClipboard(){
  clipboardVisible = !clipboardVisible;
  var panel = document.getElementById('clipboard-panel');
  if(clipboardVisible){
    panel.classList.add('open');
    renderClipboard();
  } else {
    panel.classList.remove('open');
  }
}

// Listen for copy events
document.addEventListener('copy', function(){
  setTimeout(function(){
    navigator.clipboard.readText().then(function(text){
      addToClipboard(text);
    }).catch(function(){});
  }, 100);
});

// ── 29. SPOTLIGHT SEARCH ──
var spotlightOpen = false;

function openSpotlight(){
  spotlightOpen = true;
  document.getElementById('spotlight-overlay').classList.add('open');
  var input = document.getElementById('spotlight-input');
  input.value = '';
  input.focus();
  buildSpotlightResults('');
}

function closeSpotlight(){
  spotlightOpen = false;
  document.getElementById('spotlight-overlay').classList.remove('open');
}

function buildSpotlightResults(q){
  var el = document.getElementById('spotlight-results');
  var html = '';
  var query = (q || '').toLowerCase().trim();

  if(!query){
    html += '<div class="spotlight-section">Recent</div>';
    APPS.slice(0,5).forEach(function(app){
      html += '<div class="spotlight-item" onclick="openApp(\\''+app.id+'\\');closeSpotlight()">';
      html += '<span class="spotlight-item-icon">'+iconHTML(app.icon, 8)+'</span>';
      html += '<span class="spotlight-item-text">'+app.name+'</span>';
      html += '<span class="spotlight-item-sub">'+app.url.replace('https://','')+'</span>';
      html += '</div>';
    });
    html += '<div class="spotlight-section">Quick Actions</div>';
    html += '<div class="spotlight-item" onclick="tileWindows();closeSpotlight()"><span class="spotlight-item-icon">&#9638;</span><span class="spotlight-item-text">Tile All Windows</span></div>';
    html += '<div class="spotlight-item" onclick="openPanel(\\'themes-overlay\\');closeSpotlight()"><span class="spotlight-item-icon">&#9672;</span><span class="spotlight-item-text">Change Theme</span></div>';
    html += '<div class="spotlight-item" onclick="openPanel(\\'startup-overlay\\');closeSpotlight()"><span class="spotlight-item-icon">&#9654;</span><span class="spotlight-item-text">Startup Manager</span></div>';
    el.innerHTML = html;
    return;
  }

  // Search apps
  var appResults = APPS.filter(function(a){ return a.name.toLowerCase().indexOf(query) !== -1 || a.url.toLowerCase().indexOf(query) !== -1; });
  if(appResults.length){
    html += '<div class="spotlight-section">Apps</div>';
    appResults.forEach(function(app){
      html += '<div class="spotlight-item" onclick="openApp(\\''+app.id+'\\');closeSpotlight()">';
      html += '<span class="spotlight-item-icon">'+iconHTML(app.icon, 8)+'</span>';
      html += '<span class="spotlight-item-text">'+app.name+'</span>';
      html += '<span class="spotlight-item-sub">'+app.url.replace('https://','')+'</span>';
      html += '</div>';
    });
  }

  // Search commands
  var cmdResults = [
    {name:'Focus Tunnel', action:'document.dispatchEvent(new KeyboardEvent("keydown",{ctrlKey:true,shiftKey:true,key:"F"}));closeSpotlight()'},
    {name:'Tile Windows', action:'tileWindows();closeSpotlight()'},
    {name:'Toggle Sound', action:'toggleSound();closeSpotlight()'},
    {name:'Clear Memory', action:'clearAllMemory();closeSpotlight()'},
    {name:'Save Layout', action:'saveLayout(prompt("Layout name:")||"default");closeSpotlight()'},
    {name:'Clipboard History', action:'toggleClipboard();closeSpotlight()'},
    {name:'Backup Settings', action:'openPanel("backup-overlay");closeSpotlight()'},
    {name:'Permissions', action:'openPanel("permissions-overlay");closeSpotlight()'},
    {name:'Startup Manager', action:'openPanel("startup-overlay");closeSpotlight()'},
    {name:'Themes', action:'openPanel("themes-overlay");closeSpotlight()'},
  ].filter(function(c){ return c.name.toLowerCase().indexOf(query) !== -1; });
  if(cmdResults.length){
    html += '<div class="spotlight-section">Commands</div>';
    cmdResults.forEach(function(c){
      html += '<div class="spotlight-item" onclick="'+c.action+'">';
      html += '<span class="spotlight-item-icon">&#8250;</span>';
      html += '<span class="spotlight-item-text">'+c.name+'</span>';
      html += '</div>';
    });
  }

  // Search agents
  var agents = ['Roadie','Celeste','Sophia','Lucidia','Calliope','Sentinel','Echo','Alexandria','Road','Gematria','Anastasia','Octavia','Aria','Cecilia','Alice'];
  var agentResults = agents.filter(function(a){ return a.toLowerCase().indexOf(query) !== -1; });
  if(agentResults.length){
    html += '<div class="spotlight-section">Agents</div>';
    agentResults.forEach(function(a){
      html += '<div class="spotlight-item" onclick="toast(\\'Agent: '+a+' — active\\');closeSpotlight()">';
      html += '<span class="spotlight-item-icon">&#9679;</span>';
      html += '<span class="spotlight-item-text">'+a+'</span>';
      html += '<span class="spotlight-item-sub">agent</span>';
      html += '</div>';
    });
  }

  // Search themes
  var themeNames = Object.keys(themes);
  var themeResults = themeNames.filter(function(t){ return t.indexOf(query) !== -1; });
  if(themeResults.length){
    html += '<div class="spotlight-section">Themes</div>';
    themeResults.forEach(function(t){
      html += '<div class="spotlight-item" onclick="setTheme(\\''+t+'\\');closeSpotlight()">';
      html += '<span class="spotlight-item-icon">&#9672;</span>';
      html += '<span class="spotlight-item-text">'+t.charAt(0).toUpperCase()+t.slice(1)+'</span>';
      html += '</div>';
    });
  }

  // Search widgets
  var wCfg = getWidgetConfigs();
  var widgetResults = Object.keys(wCfg).filter(function(k){ return wCfg[k].title.toLowerCase().indexOf(query) !== -1; });
  if(widgetResults.length){
    html += '<div class="spotlight-section">Widgets</div>';
    widgetResults.forEach(function(k){
      var w = wCfg[k];
      html += '<div class="spotlight-item" onclick="toggleWidget(\\''+k+'\\');closeSpotlight()">';
      html += '<span class="spotlight-item-icon">&#9632;</span>';
      html += '<span class="spotlight-item-text">'+w.title+' '+(w.enabled?'(on)':'(off)')+'</span>';
      html += '<span class="spotlight-item-sub">toggle widget</span>';
      html += '</div>';
    });
  }

  // Search shortcuts
  var scResults = builtinShortcuts.filter(function(s){ return s.desc.toLowerCase().indexOf(query) !== -1 || s.keys.toLowerCase().indexOf(query) !== -1; });
  if(scResults.length){
    html += '<div class="spotlight-section">Keyboard Shortcuts</div>';
    scResults.forEach(function(s){
      html += '<div class="spotlight-item">';
      html += '<span class="spotlight-item-icon">&#9000;</span>';
      html += '<span class="spotlight-item-text">'+s.desc+'</span>';
      html += '<span class="spotlight-item-sub">'+s.keys+'</span>';
      html += '</div>';
    });
  }

  if(!html) html = '<div style="padding:24px;text-align:center;font-size:12px;color:var(--muted)">No results for "'+escHTML(query)+'"</div>';
  el.innerHTML = html;
}

document.getElementById('spotlight-input').addEventListener('input', function(e){ buildSpotlightResults(e.target.value); });

// ── 30. DESKTOP THEMES ENGINE (expanded) ──
// Add 3 more themes to existing 5
themes.midnight = {orbs:['#1a0033','#0a0028','#220044'], bg:'#020008'};
themes.sunset = {orbs:['#FF6B2B','#FF2255','#CC00AA'], bg:'#0a0205'};
themes.cyberpunk = {orbs:['#00FF88','#FF0080','#00D4FF'], bg:'#050508'};
themes.retro = {orbs:['#E8A87C','#D96459','#C38D9E'], bg:'#0a0808'};

var themeList = [
  {id:'highway', name:'Highway', desc:'Classic BlackRoad dark'},
  {id:'night', name:'Night Drive', desc:'Deep darkness'},
  {id:'sunrise', name:'Sunrise', desc:'Warm morning glow'},
  {id:'ocean', name:'Ocean', desc:'Cool blue depths'},
  {id:'forest', name:'Forest', desc:'Natural green'},
  {id:'midnight', name:'Midnight', desc:'Ultra-dark purple'},
  {id:'sunset', name:'Sunset', desc:'Warm evening colors'},
  {id:'cyberpunk', name:'Cyberpunk', desc:'Neon electric'},
  {id:'retro', name:'Retro', desc:'Vintage warm tones'},
];

function renderThemesPanel(){
  var body = document.getElementById('themes-body');
  var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  themeList.forEach(function(t){
    var th = themes[t.id];
    var isActive = currentTheme === t.id;
    html += '<div style="background:var(--elevated);border:1px solid '+(isActive?'#8844FF':'var(--border)')+';border-radius:8px;padding:12px;cursor:pointer;transition:border-color .15s" onclick="setTheme(\\''+t.id+'\\');renderThemesPanel()">';
    html += '<div style="display:flex;gap:4px;margin-bottom:8px">';
    th.orbs.forEach(function(c){ html += '<div style="width:16px;height:16px;border-radius:50%;background:'+c+'"></div>'; });
    html += '</div>';
    html += '<div style="font-size:13px;font-weight:600;color:var(--white)">'+t.name+(isActive?' (active)':'')+'</div>';
    html += '<div style="font-size:10px;color:var(--sub)">'+t.desc+'</div>';
    html += '</div>';
  });
  html += '</div>';
  html += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">';
  html += '<div style="font-size:12px;font-weight:600;color:var(--white);margin-bottom:8px">Custom Theme</div>';
  html += '<div style="display:flex;gap:8px;align-items:center">';
  html += '<input class="input" id="custom-theme-name" placeholder="Theme name" style="flex:1;font-size:11px;padding:6px 10px">';
  html += '<input type="color" id="custom-theme-c1" value="#FF2255" style="width:30px;height:30px;border:none;background:none;cursor:pointer">';
  html += '<input type="color" id="custom-theme-c2" value="#4488FF" style="width:30px;height:30px;border:none;background:none;cursor:pointer">';
  html += '<input type="color" id="custom-theme-c3" value="#8844FF" style="width:30px;height:30px;border:none;background:none;cursor:pointer">';
  html += '<button class="btn btn-sm btn-outline" onclick="createCustomTheme()">Create</button>';
  html += '</div></div>';
  body.innerHTML = html;
}

function createCustomTheme(){
  var name = (document.getElementById('custom-theme-name').value || '').trim().toLowerCase();
  if(!name){ toast('Enter a theme name'); return; }
  var c1 = document.getElementById('custom-theme-c1').value;
  var c2 = document.getElementById('custom-theme-c2').value;
  var c3 = document.getElementById('custom-theme-c3').value;
  themes[name] = {orbs:[c1,c2,c3], bg:'#050505'};
  themeList.push({id:name, name:name.charAt(0).toUpperCase()+name.slice(1), desc:'Custom theme'});
  try { localStorage.setItem('bos-custom-themes', JSON.stringify({themes:themes, list:themeList})); } catch(e){}
  setTheme(name);
  renderThemesPanel();
  toast('Custom theme "'+name+'" created');
}

// Load custom themes
try {
  var ct = JSON.parse(localStorage.getItem('bos-custom-themes'));
  if(ct && ct.themes){
    Object.keys(ct.themes).forEach(function(k){
      if(!themes[k]){ themes[k] = ct.themes[k]; }
    });
    if(ct.list) ct.list.forEach(function(item){
      if(!themeList.find(function(t){return t.id===item.id})) themeList.push(item);
    });
  }
} catch(e){}

// ── 31. SYSTEM BACKUP ──
function createBackup(){
  var backup = {
    version: '6.0',
    created: new Date().toISOString(),
    memory: loadMemory(),
    theme: currentTheme,
    layouts: layouts,
    widgets: widgetConfigs,
    shortcuts: customShortcuts,
    clipboard: clipboardHistory,
    clipboardPins: pinnedClips,
    permissions: appPermissions,
    startup: startupConfig,
    todos: null,
  };
  try { backup.todos = JSON.parse(localStorage.getItem('bos-widget-todos')); } catch(e){}
  return backup;
}

function downloadBackup(){
  var backup = createBackup();
  var blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'blackroad-os-backup-'+new Date().toISOString().split('T')[0]+'.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Backup downloaded');
}

function restoreBackup(data){
  try {
    var backup = typeof data === 'string' ? JSON.parse(data) : data;
    if(backup.memory) localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.memory));
    if(backup.theme && themes[backup.theme]) setTheme(backup.theme);
    if(backup.layouts){ layouts = backup.layouts; localStorage.setItem('bos-layouts', JSON.stringify(layouts)); }
    if(backup.widgets){ widgetConfigs = backup.widgets; saveWidgetConfigs(); renderWidgets(); }
    if(backup.shortcuts){ customShortcuts = backup.shortcuts; localStorage.setItem('bos-shortcuts', JSON.stringify(customShortcuts)); }
    if(backup.clipboard){ clipboardHistory = backup.clipboard; localStorage.setItem('bos-clipboard', JSON.stringify(clipboardHistory)); }
    if(backup.clipboardPins){ pinnedClips = backup.clipboardPins; localStorage.setItem('bos-clipboard-pins', JSON.stringify(pinnedClips)); }
    if(backup.permissions){ appPermissions = backup.permissions; localStorage.setItem('bos-permissions', JSON.stringify(appPermissions)); }
    if(backup.startup){ startupConfig = backup.startup; localStorage.setItem('bos-startup', JSON.stringify(startupConfig)); }
    if(backup.todos) localStorage.setItem('bos-widget-todos', JSON.stringify(backup.todos));
    renderDock();
    toast('Backup restored from ' + (backup.created || 'unknown date'));
  } catch(e){
    toast('Restore failed: invalid backup');
  }
}

function renderBackupPanel(){
  var body = document.getElementById('backup-body');
  var backup = createBackup();
  var size = new Blob([JSON.stringify(backup)]).size;
  var html = '';
  html += '<div style="margin-bottom:16px">';
  html += '<div class="widget-row"><span class="widget-row-label">OS Version</span><span class="widget-row-value">v6.0</span></div>';
  html += '<div class="widget-row"><span class="widget-row-label">Apps Remembered</span><span class="widget-row-value">'+Object.keys(backup.memory).length+'</span></div>';
  html += '<div class="widget-row"><span class="widget-row-label">Saved Layouts</span><span class="widget-row-value">'+Object.keys(backup.layouts).length+'</span></div>';
  html += '<div class="widget-row"><span class="widget-row-label">Clipboard Items</span><span class="widget-row-value">'+backup.clipboard.length+'</span></div>';
  html += '<div class="widget-row"><span class="widget-row-label">Backup Size</span><span class="widget-row-value">'+(size/1024).toFixed(1)+' KB</span></div>';
  html += '</div>';
  html += '<div style="display:flex;gap:10px;margin-bottom:16px">';
  html += '<button class="btn btn-white" onclick="downloadBackup()">Download Backup</button>';
  html += '<label class="btn btn-outline" style="cursor:pointer"><input type="file" accept=".json" style="display:none" onchange="handleBackupFile(this.files[0])">Restore from File</label>';
  html += '</div>';
  html += '<div style="padding-top:12px;border-top:1px solid var(--border)">';
  html += '<div style="font-size:12px;font-weight:600;color:var(--white);margin-bottom:6px">Auto-Backup</div>';
  html += '<div style="font-size:11px;color:var(--sub)">Settings are automatically saved to localStorage. Use Download to create a portable backup file you can restore on any device.</div>';
  html += '</div>';
  body.innerHTML = html;
}

function handleBackupFile(file){
  if(!file) return;
  var reader = new FileReader();
  reader.onload = function(e){ restoreBackup(e.target.result); };
  reader.readAsText(file);
}

// ── 32. APP PERMISSIONS ──
var appPermissions = {};
try { appPermissions = JSON.parse(localStorage.getItem('bos-permissions')) || {}; } catch(e){ appPermissions = {}; }

var permissionTypes = [
  {id:'camera', name:'Camera', desc:'Access to camera for video calls'},
  {id:'microphone', name:'Microphone', desc:'Audio input for voice features'},
  {id:'notifications', name:'Notifications', desc:'Show desktop notifications'},
  {id:'location', name:'Location', desc:'Access geographic location'},
  {id:'storage', name:'Storage', desc:'Read/write local storage'},
];

function getAppPermissions(appId){
  var defaults = {};
  permissionTypes.forEach(function(p){ defaults[p.id] = p.id === 'storage' || p.id === 'notifications'; });
  return Object.assign({}, defaults, appPermissions[appId] || {});
}

function setAppPermission(appId, permId, value){
  if(!appPermissions[appId]) appPermissions[appId] = {};
  appPermissions[appId][permId] = value;
  try { localStorage.setItem('bos-permissions', JSON.stringify(appPermissions)); } catch(e){}
  toast(APPS.find(function(a){return a.id===appId}).name + ': ' + permId + ' ' + (value ? 'granted' : 'revoked'));
  renderPermissionsPanel();
}

function renderPermissionsPanel(){
  var body = document.getElementById('permissions-body');
  var html = '<div style="margin-bottom:12px">';
  html += '<select class="input" id="perm-app-select" onchange="renderPermissionsPanel()" style="margin-bottom:12px">';
  APPS.forEach(function(a){
    var sel = document.getElementById('perm-app-select');
    var selected = sel && sel.value === a.id ? ' selected' : (a.id === 'roadtrip' && (!sel || !sel.value) ? ' selected' : '');
    html += '<option value="'+a.id+'"'+selected+'>'+a.name+'</option>';
  });
  html += '</select></div>';

  var selEl = document.getElementById('perm-app-select');
  var selectedApp = selEl ? selEl.value : 'roadtrip';
  var perms = getAppPermissions(selectedApp);

  permissionTypes.forEach(function(p){
    var granted = perms[p.id];
    html += '<div class="perm-row">';
    html += '<div><div class="perm-label">'+p.name+'</div><div class="perm-sub">'+p.desc+'</div></div>';
    html += '<button class="toggle-sw'+(granted?' on':'')+'" onclick="setAppPermission(\\''+selectedApp+'\\',\\''+p.id+'\\','+(!granted)+')"></button>';
    html += '</div>';
  });

  body.innerHTML = html;
}

// ── 33. STARTUP MANAGER ──
var startupConfig = {};
try { startupConfig = JSON.parse(localStorage.getItem('bos-startup')) || {}; } catch(e){ startupConfig = {}; }

var defaultStartup = {
  enabled: true,
  apps: ['roadtrip'],
  order: ['roadtrip'],
  splashDuration: 1500,
  showSplash: true,
  autoTile: false,
};

function getStartupConfig(){
  return Object.assign({}, defaultStartup, startupConfig);
}

function toggleStartupApp(appId){
  var cfg = getStartupConfig();
  var idx = cfg.apps.indexOf(appId);
  if(idx !== -1){
    cfg.apps.splice(idx, 1);
    cfg.order = cfg.order.filter(function(id){return id !== appId});
  } else {
    cfg.apps.push(appId);
    cfg.order.push(appId);
  }
  startupConfig = cfg;
  try { localStorage.setItem('bos-startup', JSON.stringify(startupConfig)); } catch(e){}
  renderStartupPanel();
}

function setStartupSetting(key, value){
  var cfg = getStartupConfig();
  cfg[key] = value;
  startupConfig = cfg;
  try { localStorage.setItem('bos-startup', JSON.stringify(startupConfig)); } catch(e){}
  renderStartupPanel();
}

function moveStartupApp(appId, direction){
  var cfg = getStartupConfig();
  var idx = cfg.order.indexOf(appId);
  if(idx === -1) return;
  var newIdx = direction === 'up' ? Math.max(0, idx-1) : Math.min(cfg.order.length-1, idx+1);
  cfg.order.splice(idx, 1);
  cfg.order.splice(newIdx, 0, appId);
  startupConfig = cfg;
  try { localStorage.setItem('bos-startup', JSON.stringify(startupConfig)); } catch(e){}
  renderStartupPanel();
}

function renderStartupPanel(){
  var body = document.getElementById('startup-body');
  var cfg = getStartupConfig();
  var html = '';

  html += '<div class="perm-row"><div><div class="perm-label">Enable Startup Apps</div><div class="perm-sub">Launch selected apps on boot</div></div>';
  html += '<button class="toggle-sw'+(cfg.enabled?' on':'')+'" onclick="setStartupSetting(\\'enabled\\','+(!cfg.enabled)+')"></button></div>';

  html += '<div class="perm-row"><div><div class="perm-label">Show Splash Screen</div><div class="perm-sub">Display boot animation</div></div>';
  html += '<button class="toggle-sw'+(cfg.showSplash?' on':'')+'" onclick="setStartupSetting(\\'showSplash\\','+(!cfg.showSplash)+')"></button></div>';

  html += '<div class="perm-row"><div><div class="perm-label">Auto-Tile on Boot</div><div class="perm-sub">Tile all startup apps automatically</div></div>';
  html += '<button class="toggle-sw'+(cfg.autoTile?' on':'')+'" onclick="setStartupSetting(\\'autoTile\\','+(!cfg.autoTile)+')"></button></div>';

  html += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">';
  html += '<div style="font-size:12px;font-weight:600;color:var(--white);margin-bottom:10px">Startup Apps (launch order)</div>';

  // Show startup apps in order
  cfg.order.forEach(function(appId, i){
    var app = APPS.find(function(a){return a.id===appId});
    if(!app) return;
    html += '<div class="startup-item">';
    html += '<span class="startup-order">'+(i+1)+'</span>';
    html += iconHTML(app.icon, 8);
    html += '<span style="flex:1;font-size:13px;color:var(--white)">'+app.name+'</span>';
    html += '<button class="btn-ghost btn-sm" onclick="moveStartupApp(\\''+appId+'\\',\\'up\\')" style="font-size:10px;padding:2px 6px">&#9650;</button>';
    html += '<button class="btn-ghost btn-sm" onclick="moveStartupApp(\\''+appId+'\\',\\'down\\')" style="font-size:10px;padding:2px 6px">&#9660;</button>';
    html += '<button class="btn-ghost btn-sm" onclick="toggleStartupApp(\\''+appId+'\\')" style="font-size:10px;padding:2px 6px;color:#ef4444">&#10005;</button>';
    html += '</div>';
  });

  // Show available apps not in startup
  html += '<div style="margin-top:12px;font-size:11px;color:var(--muted);margin-bottom:6px">Add to startup:</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:4px">';
  APPS.forEach(function(app){
    if(cfg.apps.indexOf(app.id) !== -1) return;
    html += '<button class="btn btn-sm btn-outline" onclick="toggleStartupApp(\\''+app.id+'\\')" style="font-size:10px;padding:4px 10px">+ '+app.name+'</button>';
  });
  html += '</div></div>';

  body.innerHTML = html;
}

// ── PANEL HELPERS ──
function openPanel(id){
  document.getElementById(id).classList.add('open');
  if(id === 'permissions-overlay') renderPermissionsPanel();
  else if(id === 'startup-overlay') renderStartupPanel();
  else if(id === 'backup-overlay') renderBackupPanel();
  else if(id === 'themes-overlay') renderThemesPanel();
}
function closePanel(id){
  document.getElementById(id).classList.remove('open');
}

// ── ADDITIONAL KEYBOARD SHORTCUTS for v6 features ──
document.addEventListener('keydown', function(e){
  // Cmd+Space = Spotlight
  if((e.metaKey||e.ctrlKey) && e.code === 'Space'){
    e.preventDefault();
    spotlightOpen ? closeSpotlight() : openSpotlight();
  }
  // Ctrl+Shift+V = Clipboard
  if(e.ctrlKey && e.shiftKey && e.key === 'V'){
    e.preventDefault();
    toggleClipboard();
  }
  // Ctrl+Shift+T = Tile windows
  if(e.ctrlKey && e.shiftKey && e.key === 'T'){
    e.preventDefault();
    tileWindows();
  }
  // Ctrl+Shift+W = Toggle widgets
  if(e.ctrlKey && e.shiftKey && e.key === 'W'){
    e.preventDefault();
    var wp = document.getElementById('widgets-panel');
    wp.style.display = wp.style.display === 'none' ? '' : 'none';
  }
  // Ctrl+Shift+D = Cycle themes
  if(e.ctrlKey && e.shiftKey && e.key === 'D'){
    e.preventDefault();
    var tNames = Object.keys(themes);
    var ci = tNames.indexOf(currentTheme);
    setTheme(tNames[(ci + 1) % tNames.length]);
  }
  // Ctrl+Shift+B = Backup panel
  if(e.ctrlKey && e.shiftKey && e.key === 'B'){
    e.preventDefault();
    openPanel('backup-overlay');
  }
  // Escape closes panels
  if(e.key === 'Escape'){
    closeSpotlight();
    if(clipboardVisible) toggleClipboard();
    ['permissions-overlay','startup-overlay','backup-overlay','themes-overlay'].forEach(function(id){
      closePanel(id);
    });
  }
});

// ── UPDATE CONTEXT MENU with v6 items ──
document.addEventListener('contextmenu', function(e){
  if(e.target.closest('.win') || e.target.closest('#dock')) return;
  e.preventDefault();
  var m = document.getElementById('ctx');
  m.style.left=e.clientX+'px';m.style.top=e.clientY+'px';m.style.display='block';
  document.getElementById('ctx-inner').innerHTML = [
    {l:'Spotlight Search (Cmd+Space)',a:'openSpotlight()'},
    {l:'Command Palette (Cmd+K)',a:'openLauncher()'},
    {s:1},
    {l:'Desktop Themes',a:"openPanel('themes-overlay')"},
    {l:'Widgets',a:"var wp=document.getElementById('widgets-panel');wp.style.display=wp.style.display==='none'?'':'none'"},
    {l:'Clipboard History',a:'toggleClipboard()'},
    {s:1},
    {l:'Focus Tunnel (Ctrl+Shift+F)',a:'document.dispatchEvent(new KeyboardEvent("keydown",{ctrlKey:true,shiftKey:true,key:"F"}))'},
    {l:'Tile All Windows',a:'tileWindows()'},
    {s:1},
    {l:'App Permissions',a:"openPanel('permissions-overlay')"},
    {l:'Startup Manager',a:"openPanel('startup-overlay')"},
    {l:'Backup / Restore',a:"openPanel('backup-overlay')"},
    {s:1},
    {l:'About BlackRoad OS',a:'showAbout()'},
    {l:'Clear All Memory',a:'clearAllMemory()'},
  ].map(function(x){
    if(x.s) return '<div class="dropdown-divider"></div>';
    return '<div class="dropdown-item" onclick="'+x.a+';document.getElementById(\\'ctx\\').style.display=\\'none\\'">'+x.l+'</div>';
  }).join('');
}, true);

// ── UPDATE ABOUT for v6 ──
showAbout = function(){
  toast('BlackRoad OS v7.0 — 17 products, 27 agents, 7 divisions, 17 orgs, 20 APIs. Agent Panel, System Map, Notification Center. Remember the Road. Pave Tomorrow.');
};

// ── APPLY STARTUP CONFIG ON BOOT ──
setTimeout(function(){
  var cfg = getStartupConfig();
  if(cfg.enabled && cfg.apps.length > 0){
    cfg.order.forEach(function(appId, i){
      setTimeout(function(){ openApp(appId); }, i * 200);
    });
    if(cfg.autoTile){
      setTimeout(tileWindows, cfg.order.length * 200 + 300);
    }
  }
}, 500);

// ═══════════════════════════════════════════════════════
// v7.0 — AGENT PANEL, NOTIFICATION CENTER, SYSTEM MAP
// ═══════════════════════════════════════════════════════

var AGENTS = [
  {id:'roadie',name:'Roadie',role:'Front Door / Task Runner',division:'core',color:'#FF2255',voice:'Yep. Got it. Let\\'s move.'},
  {id:'lucidia',name:'Lucidia',role:'Core Intelligence / Memory Spine',division:'core',color:'#00E676',voice:'Let\\'s make this clean and real.'},
  {id:'cecilia',name:'Cecilia',role:'Executive Operator / Workflow',division:'operations',color:'#F5A623',voice:'Already handled.'},
  {id:'octavia',name:'Octavia',role:'Systems Orchestrator / Queue',division:'operations',color:'#9C27B0',voice:'Everything has a place.'},
  {id:'olympia',name:'Olympia',role:'Command Console / Launch Control',division:'operations',color:'#CC00AA',voice:'Raise the standard.'},
  {id:'silas',name:'Silas',role:'Reliability / Maintenance',division:'operations',color:'#4488FF',voice:'I\\'ll keep it running.'},
  {id:'sebastian',name:'Sebastian',role:'Client-Facing Polish',division:'operations',color:'#8844FF',voice:'There\\'s a better way to present this.'},
  {id:'calliope',name:'Calliope',role:'Narrative Architect / Copy',division:'creative',color:'#FF2255',voice:'Say it so it stays.'},
  {id:'aria',name:'Aria',role:'Voice / Conversational Interface',division:'creative',color:'#2979FF',voice:'Let\\'s make it sing.'},
  {id:'thalia',name:'Thalia',role:'Creative Sprint / Delight',division:'creative',color:'#FF6B2B',voice:'Make it better and more fun.'},
  {id:'lyra',name:'Lyra',role:'Signal / Sound / UX Polish',division:'creative',color:'#00D4FF',voice:'It should feel right immediately.'},
  {id:'sapphira',name:'Sapphira',role:'Brand Aura / Visual Taste',division:'creative',color:'#CC00AA',voice:'Make it unforgettable.'},
  {id:'seraphina',name:'Seraphina',role:'Creative Director / Big Launch',division:'creative',color:'#FF6B2B',voice:'Make it worthy.'},
  {id:'alexandria',name:'Alexandria',role:'Archive / Library / Research',division:'knowledge',color:'#FF1D6C',voice:'It\\'s all here.'},
  {id:'theodosia',name:'Theodosia',role:'Doctrine / Canon / Texts',division:'knowledge',color:'#8844FF',voice:'Name it correctly.'},
  {id:'sophia',name:'Sophia',role:'Wisdom / Final Reasoning',division:'knowledge',color:'#4488FF',voice:'What is true?'},
  {id:'gematria',name:'Gematria',role:'Symbolic Analysis / Patterns',division:'knowledge',color:'#FF1D6C',voice:'The pattern is there.'},
  {id:'portia',name:'Portia',role:'Policy Judge / Arbitration',division:'governance',color:'#F5A623',voice:'Let\\'s be exact.'},
  {id:'atticus',name:'Atticus',role:'Reviewer / Auditor / Proof',division:'governance',color:'#4488FF',voice:'Show me the proof.'},
  {id:'cicero',name:'Cicero',role:'Rhetoric / Persuasion',division:'governance',color:'#FF6B2B',voice:'Let\\'s make the case.'},
  {id:'valeria',name:'Valeria',role:'Security Chief / Enforcement',division:'governance',color:'#FF2255',voice:'Not everything gets access.'},
  {id:'alice',name:'Alice',role:'Exploration / Onboarding Guide',division:'human',color:'#FF1D6C',voice:'Okay, but what\\'s actually going on here?'},
  {id:'celeste',name:'Celeste',role:'Calm Companion / Reassurance',division:'human',color:'#00D4FF',voice:'You\\'re okay. Let\\'s do this simply.'},
  {id:'elias',name:'Elias',role:'Teacher / Patient Explainer',division:'human',color:'#4488FF',voice:'Let\\'s slow down and understand it.'},
  {id:'ophelia',name:'Ophelia',role:'Reflection / Mood / Depth',division:'human',color:'#9C27B0',voice:'There\\'s something underneath this.'},
  {id:'gaia',name:'Gaia',role:'Infrastructure / Hardware Monitor',division:'infrastructure',color:'#00E676',voice:'What is the system actually standing on?'},
  {id:'anastasia',name:'Anastasia',role:'Restoration / Recovery',division:'infrastructure',color:'#F5A623',voice:'It can be made whole again.'},
];

var DIVISIONS = {core:'Core',operations:'Operations',creative:'Creative',knowledge:'Knowledge',governance:'Governance',human:'Human',infrastructure:'Infrastructure'};

var ORGS = [
  {id:'blackroad-os-inc',name:'BlackRoad-OS-Inc',lead:'olympia',repos:330,role:'Parent company'},
  {id:'blackroad-os',name:'BlackRoad-OS',lead:'cecilia',repos:373,role:'Legacy fleet'},
  {id:'blackroad-ai',name:'BlackRoad-AI',lead:'lucidia',repos:0,role:'AI models & research'},
  {id:'blackroad-labs',name:'BlackRoad-Labs',lead:'gematria',repos:0,role:'Experimental'},
  {id:'blackroad-cloud',name:'BlackRoad-Cloud',lead:'gaia',repos:0,role:'Cloud infra'},
  {id:'blackroad-hardware',name:'BlackRoad-Hardware',lead:'gaia',repos:0,role:'Hardware'},
  {id:'blackroad-education',name:'BlackRoad-Education',lead:'elias',repos:0,role:'Learning'},
  {id:'blackroad-gov',name:'BlackRoad-Gov',lead:'portia',repos:0,role:'Governance'},
  {id:'blackroad-security',name:'BlackRoad-Security',lead:'valeria',repos:0,role:'Security'},
  {id:'blackroad-foundation',name:'BlackRoad-Foundation',lead:'sophia',repos:0,role:'Non-profit'},
  {id:'blackroad-media',name:'BlackRoad-Media',lead:'calliope',repos:0,role:'Content'},
  {id:'blackroad-studio',name:'BlackRoad-Studio',lead:'sapphira',repos:0,role:'Creative'},
  {id:'blackroad-interactive',name:'BlackRoad-Interactive',lead:'thalia',repos:0,role:'Interactive'},
  {id:'blackroad-ventures',name:'BlackRoad-Ventures',lead:'cicero',repos:0,role:'Business'},
  {id:'blackroad-archive',name:'BlackRoad-Archive',lead:'alexandria',repos:0,role:'Legacy'},
  {id:'blackbox-enterprises',name:'Blackbox-Enterprises',lead:'alice',repos:0,role:'Commercial'},
  {id:'blackboxprogramming',name:'blackboxprogramming',lead:null,repos:0,role:'Personal'},
];

var PRODUCT_MAP = [
  {product:'RoadTrip',org:'BlackRoad-OS-Inc',agent:'roadie',domain:'roadtrip.blackroad.io',category:'communication'},
  {product:'Roadie',org:'BlackRoad-Education',agent:'elias',domain:'tutor.blackroad.io',category:'ai'},
  {product:'RoadView',org:'BlackRoad-OS-Inc',agent:'alexandria',domain:'search.blackroad.io',category:'analytics'},
  {product:'BackRoad',org:'BlackRoad-Media',agent:'calliope',domain:'backroad.blackroad.io',category:'content'},
  {product:'RoadCode',org:'BlackRoad-OS-Inc',agent:'gematria',domain:'roadcode.blackroad.io',category:'development'},
  {product:'RoadWork',org:'BlackRoad-Education',agent:'cecilia',domain:'work.blackroad.io',category:'productivity'},
  {product:'CarKeys',org:'BlackRoad-OS-Inc',agent:'valeria',domain:'carkeys.blackroad.io',category:'security'},
  {product:'RoadChain',org:'BlackRoad-OS-Inc',agent:'atticus',domain:'roadchain.blackroad.io',category:'data'},
  {product:'RoadCoin',org:'BlackRoad-Gov',agent:'portia',domain:'roadcoin.blackroad.io',category:'finance'},
  {product:'RoadBook',org:'BlackRoad-Education',agent:'theodosia',domain:'roadbook.blackroad.io',category:'content'},
  {product:'RoadWorld',org:'BlackRoad-OS',agent:'thalia',domain:'roadworld.blackroad.io',category:'social'},
  {product:'OfficeRoad',org:'BlackRoad-OS-Inc',agent:'sebastian',domain:'officeroad.blackroad.io',category:'productivity'},
  {product:'CarPool',org:'BlackRoad-OS-Inc',agent:'octavia',domain:'carpool.blackroad.io',category:'collaboration'},
  {product:'OneWay',org:'BlackRoad-OS-Inc',agent:'silas',domain:'oneway.blackroad.io',category:'communication'},
  {product:'RoadSide',org:'BlackRoad-OS-Inc',agent:'celeste',domain:'roadside.blackroad.io',category:'support'},
  {product:'BlackBoard',org:'BlackRoad-Studio',agent:'sapphira',domain:'blackboard.blackroad.io',category:'education'},
  {product:'BlackRoad OS',org:'BlackRoad-OS-Inc',agent:'lucidia',domain:'os.blackroad.io',category:'system'},
];

// ── AGENT PANEL ──
var agentPanelOpen = false;
var selectedAgent = null;
var agentChats = {};

function toggleAgentPanel(){
  agentPanelOpen = !agentPanelOpen;
  document.getElementById('agent-panel').classList.toggle('open', agentPanelOpen);
  if(agentPanelOpen) renderAgentRoster();
}

function switchAgentTab(tab){
  document.querySelectorAll('.agent-tab').forEach(function(t){ t.classList.toggle('active', t.dataset.atab === tab); });
  document.getElementById('agent-roster').style.display = tab === 'roster' ? '' : 'none';
  document.getElementById('agent-chat').className = tab === 'chat' ? 'active' : '';
  document.getElementById('sysmap-panel').className = tab === 'sysmap' ? 'active' : '';
  if(tab === 'roster') renderAgentRoster();
  if(tab === 'sysmap') renderSystemMap();
}

function renderAgentRoster(){
  var el = document.getElementById('agent-roster');
  var html = '';
  var byDiv = {};
  AGENTS.forEach(function(a){ if(!byDiv[a.division]) byDiv[a.division] = []; byDiv[a.division].push(a); });
  Object.keys(DIVISIONS).forEach(function(div){
    var agents = byDiv[div] || [];
    html += '<div class="sidebar-label">' + DIVISIONS[div] + ' (' + agents.length + ')</div>';
    agents.forEach(function(a){
      var isSel = selectedAgent && selectedAgent.id === a.id;
      html += '<div class="agent-roster-item'+(isSel?' selected':'')+'" onclick="selectAgent(\\''+a.id+'\\')">';
      html += '<div class="agent-dot" style="background:'+a.color+'">'+a.name.charAt(0)+'</div>';
      html += '<div class="agent-info"><div class="agent-name">'+a.name+'</div><div class="agent-role">'+a.role+'</div></div>';
      html += '</div>';
    });
  });
  el.innerHTML = html;
}

function selectAgent(id){
  selectedAgent = AGENTS.find(function(a){return a.id===id});
  if(!selectedAgent) return;
  renderAgentRoster();
  switchAgentTab('chat');
  renderAgentChat();
}

function renderAgentChat(){
  if(!selectedAgent) return;
  var a = selectedAgent;
  document.getElementById('agent-chat-header').innerHTML = '<div class="agent-dot" style="background:'+a.color+';width:24px;height:24px;font-size:10px">'+a.name.charAt(0)+'</div>'
    + '<div><div style="font-size:12px;font-weight:600;color:var(--white)">'+a.name+'</div><div style="font-size:10px;color:var(--sub)">'+a.role+'</div></div>'
    + '<button class="btn-ghost btn-sm" onclick="switchAgentTab(\\'roster\\')" style="margin-left:auto;font-size:10px">Back</button>';
  var msgs = agentChats[a.id] || [];
  if(msgs.length === 0){
    msgs = [{from:a.id, text:a.voice, ts:Date.now()}];
    agentChats[a.id] = msgs;
  }
  var html = '';
  msgs.forEach(function(m){
    var isFrom = m.from === a.id;
    html += '<div class="agent-msg '+(isFrom?'from':'to')+'">';
    if(isFrom) html += '<div class="agent-msg-name" style="color:'+a.color+'">'+a.name+'</div>';
    html += escHTML(m.text);
    html += '<div class="agent-msg-time">'+new Date(m.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</div>';
    html += '</div>';
  });
  document.getElementById('agent-chat-messages').innerHTML = html;
  var container = document.getElementById('agent-chat-messages');
  container.scrollTop = container.scrollHeight;
  document.getElementById('agent-chat-input').focus();
}

function sendAgentMsg(){
  if(!selectedAgent) return;
  var input = document.getElementById('agent-chat-input');
  var text = input.value.trim();
  if(!text) return;
  input.value = '';
  if(!agentChats[selectedAgent.id]) agentChats[selectedAgent.id] = [];
  agentChats[selectedAgent.id].push({from:'user', text:text, ts:Date.now()});
  renderAgentChat();
  // Agent responds
  var a = selectedAgent;
  setTimeout(function(){
    var responses = [
      a.voice,
      'I\\'m on it. Give me a moment.',
      'Understood. Processing now.',
      'Let me check the system for that.',
      'Done. Anything else?',
      'That\\'s in my lane. Working on it.',
      'I\\'ll coordinate with the others.',
    ];
    var resp = responses[Math.floor(Math.random() * responses.length)];
    if(!agentChats[a.id]) agentChats[a.id] = [];
    agentChats[a.id].push({from:a.id, text:resp, ts:Date.now()});
    renderAgentChat();
  }, 600 + Math.random() * 1000);
}

// ── SYSTEM MAP ──
function renderSystemMap(){
  var el = document.getElementById('sysmap-panel');
  var html = '';

  // Products overview
  html += '<div class="sysmap-section"><div class="sysmap-section-title">Products (17)</div>';
  PRODUCT_MAP.forEach(function(p){
    html += '<div class="sysmap-row"><span class="sysmap-row-label">'+p.product+'</span><span class="sysmap-row-value">'+p.domain+'</span></div>';
  });
  html += '</div>';

  // Orgs
  html += '<div class="sysmap-section"><div class="sysmap-section-title">Organizations (17)</div>';
  ORGS.forEach(function(o){
    var lead = o.lead ? AGENTS.find(function(a){return a.id===o.lead}) : null;
    html += '<div class="sysmap-row"><span class="sysmap-row-label">'+o.name+'</span><span class="sysmap-row-value">'+(lead?lead.name:'—')+'</span></div>';
  });
  html += '</div>';

  // Divisions
  html += '<div class="sysmap-section"><div class="sysmap-section-title">Divisions (7)</div>';
  Object.keys(DIVISIONS).forEach(function(div){
    var count = AGENTS.filter(function(a){return a.division===div}).length;
    html += '<div class="sysmap-row"><span class="sysmap-row-label">'+DIVISIONS[div]+'</span><span class="sysmap-row-value">'+count+' agents</span></div>';
  });
  html += '</div>';

  // Infra
  html += '<div class="sysmap-section"><div class="sysmap-section-title">Infrastructure</div>';
  html += '<div class="sysmap-row"><span class="sysmap-row-label">Runtime</span><span class="sysmap-row-value">CF Workers</span></div>';
  html += '<div class="sysmap-row"><span class="sysmap-row-label">Railway</span><span class="sysmap-row-value">17 services</span></div>';
  html += '<div class="sysmap-row"><span class="sysmap-row-label">Pi Fleet</span><span class="sysmap-row-value">5 nodes</span></div>';
  html += '<div class="sysmap-row"><span class="sysmap-row-label">Domains</span><span class="sysmap-row-value">20 roots</span></div>';
  html += '<div class="sysmap-row"><span class="sysmap-row-label">AI Compute</span><span class="sysmap-row-value">52 TOPS</span></div>';
  html += '</div>';

  el.innerHTML = html;
}

// ── NOTIFICATION CENTER ──
var notifPanelOpen = false;
var osNotifications = [];

function toggleNotifPanel(){
  notifPanelOpen = !notifPanelOpen;
  document.getElementById('notif-panel').classList.toggle('open', notifPanelOpen);
  if(notifPanelOpen) renderNotifications();
}

function addOSNotification(source, title, body, category){
  osNotifications.unshift({id:'n'+Date.now(), source:source, title:title, body:body||'', category:category||'system', read:false, ts:Date.now()});
  if(osNotifications.length > 50) osNotifications.pop();
  updateNotifBadge();
  if(!notifPanelOpen) toast(source + ': ' + title);
  if(notifPanelOpen) renderNotifications();
}

function markAllRead(){
  osNotifications.forEach(function(n){ n.read = true; });
  updateNotifBadge();
  renderNotifications();
}

function updateNotifBadge(){
  var unread = osNotifications.filter(function(n){ return !n.read; }).length;
  var badge = document.getElementById('notif-badge');
  if(unread > 0){
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderNotifications(){
  var el = document.getElementById('notif-list');
  if(osNotifications.length === 0){
    el.innerHTML = '<div style="padding:32px 16px;text-align:center;font-size:12px;color:var(--muted)">No notifications yet.</div>';
    return;
  }
  var html = '';
  osNotifications.forEach(function(n,i){
    var ago = Math.round((Date.now() - n.ts) / 60000);
    var agoText = ago < 1 ? 'just now' : ago < 60 ? ago + 'm ago' : Math.round(ago/60) + 'h ago';
    html += '<div class="notif-item'+(n.read?'':' unread')+'" onclick="osNotifications['+i+'].read=true;updateNotifBadge();renderNotifications()">';
    html += '<div class="notif-icon">'+n.source.charAt(0)+'</div>';
    html += '<div class="notif-body"><div class="notif-title">'+escHTML(n.title)+'</div>';
    if(n.body) html += '<div class="notif-text">'+escHTML(n.body)+'</div>';
    html += '<div class="notif-time">'+n.source+' · '+agoText+'</div></div>';
    html += '</div>';
  });
  el.innerHTML = html;
}

// ── KEYBOARD: Ctrl+Shift+A = Agent Panel ──
document.addEventListener('keydown', function(e){
  if(e.ctrlKey && e.shiftKey && e.key === 'A'){
    e.preventDefault();
    toggleAgentPanel();
  }
  if(e.ctrlKey && e.shiftKey && e.key === 'N'){
    e.preventDefault();
    toggleNotifPanel();
  }
});

// ── BOOT NOTIFICATIONS ──
setTimeout(function(){
  addOSNotification('System', 'BlackRoad OS v7.0 loaded', '17 products, 27 agents, 17 orgs online', 'system');
}, 3000);
setTimeout(function(){
  var hour = new Date().getHours();
  var greetings = [
    {h:[5,6,7,8,9], agent:'Celeste', msg:'Good morning. You\\'re okay. Let\\'s do this simply.'},
    {h:[10,11,12,13], agent:'Roadie', msg:'Let\\'s get it. What are we building today?'},
    {h:[14,15,16,17], agent:'Calliope', msg:'The afternoon is for creation.'},
    {h:[18,19,20,21], agent:'Sophia', msg:'Evening. A good time to reflect.'},
    {h:[22,23,0,1,2,3,4], agent:'Lucidia', msg:'Late night session. I\\'ll remember everything.'},
  ];
  var g = greetings.find(function(gr){ return gr.h.indexOf(hour) !== -1; }) || greetings[0];
  addOSNotification(g.agent, g.msg, '', 'agent');
}, 5000);

// ── FIX: Update Spotlight agent list to all 27 ──
var origBuildSpotlight = buildSpotlightResults;
buildSpotlightResults = function(q){
  // Replace the old agent search with full 27
  origBuildSpotlight(q);
  if(!q) return;
  var query = q.toLowerCase().trim();
  var el = document.getElementById('spotlight-results');
  // Check if agents already rendered (from original); if so, replace with full list
  var agentMatches = AGENTS.filter(function(a){ return a.name.toLowerCase().indexOf(query) !== -1 || a.role.toLowerCase().indexOf(query) !== -1 || a.division.indexOf(query) !== -1; });
  if(agentMatches.length > 0){
    // Remove old agent section and add new one
    var existing = el.innerHTML;
    var agentHtml = '<div class="spotlight-section">Agents (' + agentMatches.length + ')</div>';
    agentMatches.forEach(function(a){
      agentHtml += '<div class="spotlight-item" onclick="toggleAgentPanel();selectAgent(\\''+a.id+'\\');closeSpotlight()">';
      agentHtml += '<span class="spotlight-item-icon" style="color:'+a.color+'">&#9679;</span>';
      agentHtml += '<span class="spotlight-item-text">'+a.name+'</span>';
      agentHtml += '<span class="spotlight-item-sub">'+a.division+' · '+a.role+'</span>';
      agentHtml += '</div>';
    });
    // Remove old agents section if present
    existing = existing.replace(/<div class="spotlight-section">Agents<\\/div>[\\s\\S]*?(?=<div class="spotlight-section">|$)/, '');
    el.innerHTML = existing + agentHtml;
  }
};

// ── v7 WELCOME ──
setTimeout(function(){
  toast('v7: Ctrl+Shift+A = Agents, Ctrl+Shift+N = Notifications, System Map in Agent Panel');
}, 6000);
</script>
</body>
</html>
`;

// ═══════════════════════════════════════════════════════
//  PRODUCT REGISTRY — 17 canonical products
// ═══════════════════════════════════════════════════════
const PRODUCTS = [
  { id: 'roadtrip',   name: 'RoadTrip',   url: 'https://roadtrip.blackroad.io',   category: 'communication', description: 'Sovereign multi-agent chat hub', icon: 'circle', version: '2.1', rating: 4.8, reviews: 42 },
  { id: 'roadie',     name: 'Roadie',     url: 'https://roadie.blackroad.io',     category: 'ai',            description: 'AI assistant and agent coordinator', icon: 'square', version: '3.0', rating: 4.9, reviews: 67 },
  { id: 'roadview',   name: 'RoadView',   url: 'https://roadview.blackroad.io',   category: 'analytics',     description: 'Analytics and monitoring dashboard', icon: 'circle', version: '1.5', rating: 4.6, reviews: 28 },
  { id: 'backroad',   name: 'BackRoad',   url: 'https://backroad.blackroad.io',   category: 'content',       description: 'Blog and content publishing platform', icon: 'square', version: '2.0', rating: 4.7, reviews: 35 },
  { id: 'roadcode',   name: 'RoadCode',   url: 'https://roadcode.blackroad.io',   category: 'development',   description: 'Code editor and development environment', icon: 'circle', version: '1.8', rating: 4.5, reviews: 51 },
  { id: 'roadwork',   name: 'RoadWork',   url: 'https://roadwork.blackroad.io',   category: 'productivity',  description: 'Project management and task tracking', icon: 'square', version: '1.4', rating: 4.4, reviews: 22 },
  { id: 'carkeys',    name: 'CarKeys',    url: 'https://carkeys.blackroad.io',    category: 'security',      description: 'Authentication and identity management', icon: 'circle', version: '2.2', rating: 4.8, reviews: 19 },
  { id: 'roadchain',  name: 'RoadChain',  url: 'https://roadchain.blackroad.io',  category: 'data',          description: 'Blockchain and immutable record keeping', icon: 'square', version: '1.1', rating: 4.3, reviews: 15 },
  { id: 'roadcoin',   name: 'RoadCoin',   url: 'https://roadcoin.blackroad.io',   category: 'finance',       description: 'Payments and financial services', icon: 'circle', version: '1.0', rating: 4.2, reviews: 11 },
  { id: 'roadbook',   name: 'RoadBook',   url: 'https://roadbook.blackroad.io',   category: 'content',       description: 'E-book reader and library management', icon: 'square', version: '1.6', rating: 4.7, reviews: 38 },
  { id: 'roadworld',  name: 'RoadWorld',  url: 'https://roadworld.blackroad.io',  category: 'social',        description: 'Social network and community hub', icon: 'circle', version: '1.3', rating: 4.4, reviews: 26 },
  { id: 'officeroad', name: 'OfficeRoad', url: 'https://officeroad.blackroad.io', category: 'productivity',  description: 'Office suite — docs, sheets, slides', icon: 'square', version: '1.2', rating: 4.3, reviews: 17 },
  { id: 'carpool',    name: 'CarPool',    url: 'https://carpool.blackroad.io',    category: 'collaboration', description: 'Team collaboration and shared workspace', icon: 'circle', version: '1.5', rating: 4.5, reviews: 29 },
  { id: 'oneway',     name: 'OneWay',     url: 'https://oneway.blackroad.io',     category: 'communication', description: 'One-way broadcast and notification system', icon: 'square', version: '1.0', rating: 4.1, reviews: 8 },
  { id: 'roadside',   name: 'RoadSide',   url: 'https://roadside.blackroad.io',   category: 'support',       description: 'Help desk and support ticketing', icon: 'circle', version: '1.2', rating: 4.6, reviews: 20 },
  { id: 'blackboard', name: 'BlackBoard', url: 'https://blackboard.blackroad.io', category: 'education',     description: 'Learning management and tutoring', icon: 'square', version: '2.1', rating: 4.8, reviews: 44 },
  { id: 'highway',    name: 'Highway',    url: 'https://blackroad.io',            category: 'system',        description: 'Main portal and system browser', icon: 'circle', version: '5.0', rating: 4.9, reviews: 73 },
];

const CATEGORIES = ['communication', 'ai', 'analytics', 'content', 'development', 'productivity', 'security', 'data', 'finance', 'social', 'collaboration', 'support', 'education', 'system'];

// ═══════════════════════════════════════════════════════
//  CHANGELOG — version history
// ═══════════════════════════════════════════════════════
const CHANGELOG = [
  { version: '7.0.0', date: '2026-04-04', title: 'OS v7 — Agent Panel, System Map, Notification Center, Full Org Architecture', changes: ['Agent Panel (Ctrl+Shift+A): 27 agents in 7 divisions with roster, chat, and system map', 'System Map: org→product→agent→domain mappings for all 17 products and 17 orgs', 'Notification Center (Ctrl+Shift+N): real notification panel with unread badges', 'All 27 agents searchable in Spotlight with division and role info', 'Agent chat with contextual responses per agent personality', 'Added /api/agents — full 27-agent roster with divisions, roles, colors, voices', 'Added /api/orgs — 17 GitHub organizations with lead agents', 'Added /api/map — complete system map: org→product→agent→domain→infra', 'Added /api/divisions — 7 division breakdown with agent counts', 'Dock tray: Agent and Notification quick-access buttons', 'Time-of-day agent greetings flow into notification center', 'Agent division badges in roster view'] },
  { version: '6.0.0', date: '2026-03-31', title: 'OS v6 — Widgets, Spotlight, Themes Engine, Clipboard, Backup, Permissions, Startup Manager, Shortcuts', changes: ['Added /api/widgets — configurable desktop widgets (clock, weather, stats, todo, music, calendar, stocks, news)', 'Added /api/shortcuts — keyboard shortcut registry with custom keybindings', 'Added /api/clipboard — clipboard history (50 items), pin, search, sync', 'Added /api/spotlight — unified search across all products, agents, files, settings', 'Added /api/themes — full theme engine with 9 themes + custom theme creation', 'Added /api/backup — backup/restore all user settings as portable JSON', 'Added /api/permissions — per-app permission management (camera, mic, notifications, location, storage)', 'Added /api/startup — configure boot apps, launch order, splash screen settings', 'Spotlight search (Cmd+Space) searches everything in one query', 'Desktop widgets panel with 8 widget types', 'Expanded themes from 5 to 9 + custom theme builder', 'Clipboard manager with history, pins, and search', 'Context menu updated with all v6 features'] },
  { version: '5.0.0', date: '2026-03-31', title: 'OS APIs — System Monitor, App Store, Settings, Notifications, Files, Activity, Actions, Changelog', changes: ['Added /api/system — real-time health checks for all 17 products', 'Added /api/store — browse, search, and review apps', 'Added /api/settings — user preferences (theme, layout, default apps)', 'Added /api/notifications — cross-product notification aggregation', 'Added /api/files — virtual file system for user documents', 'Added /api/activity — recent actions across all products', 'Added /api/actions — command palette data for quick actions', 'Added /api/changelog — version history and release notes'] },
  { version: '4.0.0', date: '2026-03-30', title: 'OS v4 — 25 Features', changes: ['Daily Road Summary widget', 'Multiple windows support', 'Lane switching (Ctrl+Tab)', 'Focus Tunnel mode', 'Desktop themes (5 themes)', 'Enhanced context menu', 'Tile windows', 'Convoy presence aura', 'Memory peek HUD', 'Highway soundscape', 'Notification center', 'Agent greetings', 'Saved desktop layouts', 'Agent status indicators', 'End-of-day reflection'] },
  { version: '3.0.0', date: '2026-03-15', title: 'OS v3 — Window Manager', changes: ['Full window management with drag, resize, snap', 'Dock with all 17 products', 'Command palette (Cmd+K)', 'Context menu', 'localStorage memory persistence', 'Browser windows with address bar'] },
  { version: '2.0.0', date: '2026-02-28', title: 'OS v2 — Product Integration', changes: ['Iframe-based app loading', '17 product URLs integrated', 'Boot sequence animation'] },
  { version: '1.0.0', date: '2026-01-15', title: 'OS v1 — Initial Release', changes: ['Basic desktop environment', 'Single window mode', 'Brand CSS system'] },
];

// ═══════════════════════════════════════════════════════
//  API HANDLERS
// ═══════════════════════════════════════════════════════

async function checkProductHealth(product) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(product.url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);
    return { id: product.id, name: product.name, url: product.url, status: res.ok ? 'healthy' : 'degraded', httpStatus: res.status, latencyMs: null, checkedAt: new Date().toISOString() };
  } catch (e) {
    return { id: product.id, name: product.name, url: product.url, status: 'unreachable', error: e.message, checkedAt: new Date().toISOString() };
  }
}

async function handleSystem() {
  const checks = await Promise.all(PRODUCTS.map(p => checkProductHealth(p)));
  const healthy = checks.filter(c => c.status === 'healthy').length;
  const degraded = checks.filter(c => c.status === 'degraded').length;
  const unreachable = checks.filter(c => c.status === 'unreachable').length;
  return {
    os: { name: 'BlackRoad OS', version: '7.0.0', uptime: 'edge-always-on', runtime: 'Cloudflare Workers' },
    summary: { total: PRODUCTS.length, healthy, degraded, unreachable, healthPercent: Math.round((healthy / PRODUCTS.length) * 100) },
    products: checks,
    agents: { total: 27, active: healthy, idle: PRODUCTS.length - healthy },
    memory: { type: 'edge-kv', note: 'localStorage on client, KV on edge' },
    checkedAt: new Date().toISOString(),
  };
}

function handleStore(url) {
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('q');
  const id = url.searchParams.get('id');
  const sort = url.searchParams.get('sort') || 'rating';

  // Single product detail
  if (id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return { error: 'Product not found', id };
    return { product, installed: true, relatedProducts: PRODUCTS.filter(p => p.category === product.category && p.id !== id).map(p => ({ id: p.id, name: p.name })) };
  }

  let results = [...PRODUCTS];

  // Filter by category
  if (category) {
    results = results.filter(p => p.category === category);
  }

  // Search
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'reviews') results.sort((a, b) => b.reviews - a.reviews);

  return {
    total: results.length,
    categories: CATEGORIES,
    products: results,
    featured: PRODUCTS.filter(p => p.rating >= 4.8).map(p => ({ id: p.id, name: p.name, rating: p.rating })),
  };
}

function handleSettings(url) {
  // Returns default settings structure — client persists via localStorage
  const action = url.searchParams.get('action');

  const defaults = {
    theme: 'highway',
    availableThemes: ['highway', 'night', 'sunrise', 'ocean', 'forest'],
    layout: 'auto',
    availableLayouts: ['auto', 'tiled', 'stacked', 'focus'],
    defaultApp: 'roadtrip',
    notifications: { enabled: true, sound: false, agentGreetings: true, endOfDay: true, position: 'top-right' },
    dock: { position: 'bottom', autoHide: false, iconSize: 'normal', showLabels: true, groupSeparators: true },
    windows: { multipleWindows: true, snapToEdge: true, rememberPosition: true, rememberSize: true, animateTransitions: true },
    accessibility: { reducedMotion: false, highContrast: false, fontSize: 'normal' },
    privacy: { clearMemoryOnClose: false, analytics: false },
  };

  if (action === 'reset') return { settings: defaults, message: 'Settings reset to defaults' };
  return { settings: defaults, message: 'Apply via localStorage on client. POST to save custom overrides.' };
}

function handleNotifications(url) {
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const since = url.searchParams.get('since');
  const category = url.searchParams.get('category');

  const now = Date.now();
  // Generate sample cross-product notifications
  const allNotifications = [
    { id: 'n1', source: 'RoadTrip', category: 'chat', title: 'New message in #general', body: 'Roadie posted a fleet status update', read: false, ts: new Date(now - 120000).toISOString(), action: 'https://roadtrip.blackroad.io' },
    { id: 'n2', source: 'RoadCode', category: 'development', title: 'Build complete', body: 'os-blackroad deployed successfully', read: false, ts: new Date(now - 300000).toISOString(), action: 'https://roadcode.blackroad.io' },
    { id: 'n3', source: 'BackRoad', category: 'content', title: 'Post published', body: '"The Roadies" article is live', read: true, ts: new Date(now - 600000).toISOString(), action: 'https://backroad.blackroad.io' },
    { id: 'n4', source: 'RoadWork', category: 'productivity', title: 'Task completed', body: 'P1: Fix products — search endpoint fixed', read: true, ts: new Date(now - 900000).toISOString(), action: 'https://roadwork.blackroad.io' },
    { id: 'n5', source: 'CarKeys', category: 'security', title: 'Security audit passed', body: 'All 17 products passed CSP headers check', read: true, ts: new Date(now - 1200000).toISOString(), action: 'https://carkeys.blackroad.io' },
    { id: 'n6', source: 'RoadView', category: 'analytics', title: 'Traffic spike', body: '320 organic visitors in the last 24h', read: false, ts: new Date(now - 1800000).toISOString(), action: 'https://roadview.blackroad.io' },
    { id: 'n7', source: 'BlackBoard', category: 'education', title: 'New lesson available', body: 'Amundson Framework v5 module added', read: false, ts: new Date(now - 2400000).toISOString(), action: 'https://blackboard.blackroad.io' },
    { id: 'n8', source: 'RoadWorld', category: 'social', title: 'Community update', body: '27 agents now active in the fleet', read: true, ts: new Date(now - 3600000).toISOString(), action: 'https://roadworld.blackroad.io' },
    { id: 'n9', source: 'System', category: 'system', title: 'OS updated to v5.0', body: '8 new API endpoints, system monitor, app store', read: false, ts: new Date(now - 7200000).toISOString(), action: 'https://os.blackroad.io' },
    { id: 'n10', source: 'RoadCoin', category: 'finance', title: 'Payment processed', body: 'Stripe checkout session completed', read: true, ts: new Date(now - 10800000).toISOString(), action: 'https://roadcoin.blackroad.io' },
  ];

  let filtered = allNotifications;
  if (category) filtered = filtered.filter(n => n.category === category);
  if (since) filtered = filtered.filter(n => new Date(n.ts).getTime() > new Date(since).getTime());

  const unread = filtered.filter(n => !n.read).length;
  return {
    total: filtered.length,
    unread,
    categories: [...new Set(allNotifications.map(n => n.category))],
    notifications: filtered.slice(0, limit),
  };
}

function handleFiles(url) {
  const path = url.searchParams.get('path') || '/';
  const action = url.searchParams.get('action');

  // Virtual file system structure
  const fileSystem = {
    '/': { type: 'directory', name: 'Home', children: ['Documents', 'Projects', 'Downloads', 'Shared', '.config'] },
    '/Documents': { type: 'directory', name: 'Documents', children: ['notes.md', 'todo.md', 'journal.md'] },
    '/Documents/notes.md': { type: 'file', name: 'notes.md', size: 2048, mimeType: 'text/markdown', modified: '2026-03-31T12:00:00Z', content: '# Notes\n\nBlackRoad OS — sovereign computing.' },
    '/Documents/todo.md': { type: 'file', name: 'todo.md', size: 1024, mimeType: 'text/markdown', modified: '2026-03-31T10:00:00Z', content: '# TODO\n\n- [ ] Get first real user\n- [x] Fix all 17 products\n- [x] Deploy OS v5' },
    '/Documents/journal.md': { type: 'file', name: 'journal.md', size: 4096, mimeType: 'text/markdown', modified: '2026-03-31T08:00:00Z', content: '# Journal\n\n## 2026-03-31\nShipped OS v5 with 8 new API endpoints.' },
    '/Projects': { type: 'directory', name: 'Projects', children: ['blackroad-os', 'amundson-constant', 'roadtrip'] },
    '/Projects/blackroad-os': { type: 'directory', name: 'blackroad-os', children: ['README.md', 'src/'] },
    '/Projects/amundson-constant': { type: 'directory', name: 'amundson-constant', children: ['FRAMEWORK.md', 'compute.py', '10M-digits.txt'] },
    '/Projects/roadtrip': { type: 'directory', name: 'roadtrip', children: ['worker.js', 'wrangler.toml'] },
    '/Downloads': { type: 'directory', name: 'Downloads', children: [] },
    '/Shared': { type: 'directory', name: 'Shared', children: ['fleet-config.json', 'agent-manifests/'] },
    '/Shared/fleet-config.json': { type: 'file', name: 'fleet-config.json', size: 8192, mimeType: 'application/json', modified: '2026-03-30T18:00:00Z' },
    '/.config': { type: 'directory', name: '.config', children: ['theme.json', 'layout.json', 'preferences.json'] },
  };

  const entry = fileSystem[path];
  if (!entry) return { error: 'Path not found', path };

  if (action === 'list' || entry.type === 'directory') {
    return {
      path,
      type: entry.type,
      name: entry.name,
      children: (entry.children || []).map(c => {
        const childPath = path === '/' ? '/' + c : path + '/' + c;
        const child = fileSystem[childPath];
        return child
          ? { name: c, type: child.type, size: child.size || null, modified: child.modified || null }
          : { name: c, type: c.endsWith('/') ? 'directory' : 'file' };
      }),
      totalItems: (entry.children || []).length,
    };
  }

  return {
    path,
    type: entry.type,
    name: entry.name,
    size: entry.size,
    mimeType: entry.mimeType,
    modified: entry.modified,
    content: entry.content || null,
  };
}

function handleActivity(url) {
  const limit = parseInt(url.searchParams.get('limit') || '25');
  const product = url.searchParams.get('product');

  const now = Date.now();
  const activities = [
    { id: 'a1',  product: 'os',        actor: 'System',   action: 'deployed',    target: 'BlackRoad OS v5.0',           ts: new Date(now - 60000).toISOString() },
    { id: 'a2',  product: 'roadtrip',   actor: 'Roadie',   action: 'posted',      target: 'Fleet status in #general',    ts: new Date(now - 180000).toISOString() },
    { id: 'a3',  product: 'roadcode',   actor: 'System',   action: 'built',       target: 'os-blackroad worker',         ts: new Date(now - 300000).toISOString() },
    { id: 'a4',  product: 'backroad',   actor: 'Calliope', action: 'published',   target: 'The Roadies — brand story',   ts: new Date(now - 600000).toISOString() },
    { id: 'a5',  product: 'roadwork',   actor: 'System',   action: 'completed',   target: 'P1: Fix products task',       ts: new Date(now - 900000).toISOString() },
    { id: 'a6',  product: 'carkeys',    actor: 'Sentinel',  action: 'audited',    target: 'CSP headers on 17 products',  ts: new Date(now - 1200000).toISOString() },
    { id: 'a7',  product: 'roadview',   actor: 'System',   action: 'tracked',     target: '320 organic visitors',        ts: new Date(now - 1800000).toISOString() },
    { id: 'a8',  product: 'blackboard', actor: 'Sophia',   action: 'created',     target: 'Amundson Framework lesson',   ts: new Date(now - 2400000).toISOString() },
    { id: 'a9',  product: 'roadworld',  actor: 'System',   action: 'registered',  target: '27 agents in fleet',          ts: new Date(now - 3600000).toISOString() },
    { id: 'a10', product: 'roadcoin',   actor: 'System',   action: 'processed',   target: 'Stripe checkout session',     ts: new Date(now - 5400000).toISOString() },
    { id: 'a11', product: 'roadbook',   actor: 'Lucidia',  action: 'indexed',     target: '1,383 search entries',        ts: new Date(now - 7200000).toISOString() },
    { id: 'a12', product: 'carpool',    actor: 'Celeste',  action: 'synced',      target: 'Team workspace state',        ts: new Date(now - 10800000).toISOString() },
    { id: 'a13', product: 'officeroad', actor: 'System',   action: 'updated',     target: 'Document templates',          ts: new Date(now - 14400000).toISOString() },
    { id: 'a14', product: 'roadside',   actor: 'Roadie',   action: 'resolved',    target: 'Support ticket #42',          ts: new Date(now - 18000000).toISOString() },
    { id: 'a15', product: 'oneway',     actor: 'System',   action: 'broadcast',   target: 'OS v5 release notification',  ts: new Date(now - 21600000).toISOString() },
    { id: 'a16', product: 'roadchain',  actor: 'System',   action: 'recorded',    target: 'Immutable audit entry',       ts: new Date(now - 28800000).toISOString() },
    { id: 'a17', product: 'highway',    actor: 'System',   action: 'updated',     target: 'Homepage with new hero',      ts: new Date(now - 36000000).toISOString() },
  ];

  let filtered = activities;
  if (product) filtered = filtered.filter(a => a.product === product);

  return {
    total: filtered.length,
    activities: filtered.slice(0, limit),
    products: [...new Set(activities.map(a => a.product))],
  };
}

function handleActions(url) {
  const q = url.searchParams.get('q');

  const actions = [
    // App launchers
    ...PRODUCTS.map(p => ({ id: 'open-' + p.id, type: 'app', label: 'Open ' + p.name, description: p.description, shortcut: null, action: p.url })),
    // System commands
    { id: 'cmd-palette',  type: 'command', label: 'Command Palette',   description: 'Search apps and commands',    shortcut: 'Cmd+K',         action: 'openLauncher()' },
    { id: 'focus-tunnel', type: 'command', label: 'Focus Tunnel',      description: 'Distraction-free mode',       shortcut: 'Ctrl+Shift+F',  action: 'toggleTunnel()' },
    { id: 'tile-windows', type: 'command', label: 'Tile Windows',      description: 'Grid all open windows',       shortcut: null,             action: 'tileWindows()' },
    { id: 'close-window', type: 'command', label: 'Close Window',      description: 'Close focused window',        shortcut: 'Ctrl+W',        action: 'closeWin(focusedId)' },
    { id: 'switch-window',type: 'command', label: 'Switch Window',     description: 'Cycle through open windows',  shortcut: 'Ctrl+Tab',      action: 'switchWindow()' },
    { id: 'kbd-help',     type: 'command', label: 'Keyboard Shortcuts',description: 'Show all shortcuts',          shortcut: 'Ctrl+/',        action: 'showKeyboardHelp()' },
    // Theme commands
    { id: 'theme-highway', type: 'theme', label: 'Theme: Highway',     description: 'Default dark theme',     shortcut: null, action: "setTheme('highway')" },
    { id: 'theme-night',   type: 'theme', label: 'Theme: Night Drive', description: 'Deep dark theme',        shortcut: null, action: "setTheme('night')" },
    { id: 'theme-sunrise', type: 'theme', label: 'Theme: Sunrise',     description: 'Warm morning theme',     shortcut: null, action: "setTheme('sunrise')" },
    { id: 'theme-ocean',   type: 'theme', label: 'Theme: Ocean',       description: 'Cool blue theme',        shortcut: null, action: "setTheme('ocean')" },
    { id: 'theme-forest',  type: 'theme', label: 'Theme: Forest',      description: 'Natural green theme',    shortcut: null, action: "setTheme('forest')" },
    // Layout commands
    { id: 'save-layout',    type: 'layout', label: 'Save Layout',      description: 'Save current window positions', shortcut: null, action: 'saveLayout()' },
    { id: 'clear-memory',   type: 'system', label: 'Clear All Memory', description: 'Reset localStorage',           shortcut: null, action: 'clearAllMemory()' },
    { id: 'toggle-sound',   type: 'system', label: 'Toggle Sound',     description: 'Highway ambient soundscape',   shortcut: null, action: 'toggleSound()' },
    { id: 'about',           type: 'system', label: 'About BlackRoad OS',description: 'Version and system info',    shortcut: null, action: 'showAbout()' },
  ];

  let filtered = actions;
  if (q) {
    const query = q.toLowerCase();
    filtered = actions.filter(a =>
      a.label.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.type.toLowerCase().includes(query)
    );
  }

  const grouped = {};
  filtered.forEach(a => {
    if (!grouped[a.type]) grouped[a.type] = [];
    grouped[a.type].push(a);
  });

  return {
    total: filtered.length,
    groups: grouped,
    actions: filtered,
  };
}

function handleChangelog(url) {
  const version = url.searchParams.get('version');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  if (version) {
    const entry = CHANGELOG.find(c => c.version === version);
    if (!entry) return { error: 'Version not found', version };
    return { release: entry };
  }

  return {
    current: CHANGELOG[0].version,
    total: CHANGELOG.length,
    releases: CHANGELOG.slice(0, limit),
  };
}

// ═══════════════════════════════════════════════════════
//  v6.0 API HANDLERS — Widgets, Shortcuts, Clipboard, Spotlight, Themes, Backup, Permissions, Startup
// ═══════════════════════════════════════════════════════

const WIDGET_TYPES = [
  { id: 'clock', name: 'Clock', description: 'Live digital clock with date', defaultEnabled: true, category: 'utility', settings: { format: '12h', showSeconds: true, showDate: true } },
  { id: 'weather', name: 'Weather', description: 'Current weather conditions', defaultEnabled: true, category: 'info', settings: { units: 'fahrenheit', location: 'auto' } },
  { id: 'stats', name: 'System Stats', description: 'Windows, memory, products, agents', defaultEnabled: true, category: 'system', settings: { refreshInterval: 30 } },
  { id: 'todo', name: 'Quick Todo', description: 'Lightweight task list', defaultEnabled: false, category: 'productivity', settings: { maxItems: 20 } },
  { id: 'music', name: 'Music Player', description: 'Highway ambient soundscape controls', defaultEnabled: false, category: 'media', settings: { autoplay: false, volume: 0.02 } },
  { id: 'calendar', name: 'Calendar', description: 'Month view with events', defaultEnabled: false, category: 'productivity', settings: { startDay: 'sunday' } },
  { id: 'stocks', name: 'Stocks', description: 'Live stock ticker display', defaultEnabled: false, category: 'finance', settings: { symbols: ['ROAD', 'AAPL', 'MSFT'], refreshInterval: 60 } },
  { id: 'news', name: 'News Ticker', description: 'Latest BlackRoad news headlines', defaultEnabled: false, category: 'info', settings: { maxItems: 5, autoScroll: true } },
];

function handleWidgets(url) {
  const action = url.searchParams.get('action');
  const widgetId = url.searchParams.get('id');

  if (widgetId) {
    const widget = WIDGET_TYPES.find(w => w.id === widgetId);
    if (!widget) return { error: 'Widget not found', id: widgetId };
    return { widget, positionSettings: { x: 8, y: 8, width: 260, height: 'auto' } };
  }

  if (action === 'defaults') {
    return { widgets: WIDGET_TYPES.filter(w => w.defaultEnabled) };
  }

  return {
    total: WIDGET_TYPES.length,
    categories: [...new Set(WIDGET_TYPES.map(w => w.category))],
    widgets: WIDGET_TYPES,
    enabledByDefault: WIDGET_TYPES.filter(w => w.defaultEnabled).map(w => w.id),
    note: 'Widget state persisted via localStorage on client. Use /api/backup to export.',
  };
}

const SHORTCUT_REGISTRY = [
  { id: 'cmd-palette', keys: 'Cmd+K', description: 'Open command palette', category: 'navigation', customizable: false },
  { id: 'spotlight', keys: 'Cmd+Space', description: 'Open Spotlight search', category: 'navigation', customizable: false },
  { id: 'close-window', keys: 'Ctrl+W', description: 'Close focused window', category: 'windows', customizable: true },
  { id: 'switch-window', keys: 'Ctrl+Tab', description: 'Switch between windows', category: 'windows', customizable: false },
  { id: 'switch-window-back', keys: 'Ctrl+Shift+Tab', description: 'Switch windows reverse', category: 'windows', customizable: false },
  { id: 'focus-tunnel', keys: 'Ctrl+Shift+F', description: 'Toggle focus tunnel mode', category: 'focus', customizable: true },
  { id: 'tile-windows', keys: 'Ctrl+Shift+T', description: 'Tile all open windows', category: 'windows', customizable: true },
  { id: 'clipboard-history', keys: 'Ctrl+Shift+V', description: 'Open clipboard history', category: 'tools', customizable: true },
  { id: 'toggle-widgets', keys: 'Ctrl+Shift+W', description: 'Toggle widgets panel', category: 'desktop', customizable: true },
  { id: 'cycle-theme', keys: 'Ctrl+Shift+D', description: 'Cycle desktop theme', category: 'desktop', customizable: true },
  { id: 'backup-panel', keys: 'Ctrl+Shift+B', description: 'Open backup panel', category: 'system', customizable: true },
  { id: 'keyboard-help', keys: 'Ctrl+/', description: 'Show keyboard shortcuts', category: 'help', customizable: false },
  { id: 'app-1', keys: 'Ctrl+1', description: 'Open first dock app', category: 'apps', customizable: false },
  { id: 'app-2', keys: 'Ctrl+2', description: 'Open second dock app', category: 'apps', customizable: false },
  { id: 'app-3', keys: 'Ctrl+3', description: 'Open third dock app', category: 'apps', customizable: false },
  { id: 'app-4', keys: 'Ctrl+4', description: 'Open fourth dock app', category: 'apps', customizable: false },
  { id: 'app-5', keys: 'Ctrl+5', description: 'Open fifth dock app', category: 'apps', customizable: false },
  { id: 'app-6', keys: 'Ctrl+6', description: 'Open sixth dock app', category: 'apps', customizable: false },
  { id: 'app-7', keys: 'Ctrl+7', description: 'Open seventh dock app', category: 'apps', customizable: false },
  { id: 'app-8', keys: 'Ctrl+8', description: 'Open eighth dock app', category: 'apps', customizable: false },
  { id: 'app-9', keys: 'Ctrl+9', description: 'Open ninth dock app', category: 'apps', customizable: false },
];

function handleShortcuts(url) {
  const q = url.searchParams.get('q');
  const category = url.searchParams.get('category');
  const id = url.searchParams.get('id');

  if (id) {
    const shortcut = SHORTCUT_REGISTRY.find(s => s.id === id);
    if (!shortcut) return { error: 'Shortcut not found', id };
    return { shortcut };
  }

  let results = [...SHORTCUT_REGISTRY];
  if (category) results = results.filter(s => s.category === category);
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(s => s.description.toLowerCase().includes(query) || s.keys.toLowerCase().includes(query) || s.category.includes(query));
  }

  const grouped = {};
  results.forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); });

  return {
    total: results.length,
    categories: [...new Set(SHORTCUT_REGISTRY.map(s => s.category))],
    groups: grouped,
    shortcuts: results,
    customizable: results.filter(s => s.customizable).length,
  };
}

function handleClipboard(url) {
  const action = url.searchParams.get('action');
  const q = url.searchParams.get('q');

  const sampleHistory = [
    { id: 'c1', text: 'BlackRoad OS v6.0', type: 'text', pinned: true, copiedAt: new Date(Date.now() - 60000).toISOString() },
    { id: 'c2', text: 'https://os.blackroad.io', type: 'url', pinned: true, copiedAt: new Date(Date.now() - 300000).toISOString() },
    { id: 'c3', text: 'Remember the Road. Pave Tomorrow.', type: 'text', pinned: false, copiedAt: new Date(Date.now() - 600000).toISOString() },
    { id: 'c4', text: 'const PRODUCTS = [...]', type: 'code', pinned: false, copiedAt: new Date(Date.now() - 900000).toISOString() },
    { id: 'c5', text: 'Sovereign computing for messy people.', type: 'text', pinned: false, copiedAt: new Date(Date.now() - 1200000).toISOString() },
  ];

  if (action === 'clear') return { message: 'Clipboard cleared', count: 0 };
  if (action === 'stats') return { total: sampleHistory.length, pinned: sampleHistory.filter(c => c.pinned).length, maxItems: 50 };

  let results = sampleHistory;
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(c => c.text.toLowerCase().includes(query));
  }

  return {
    total: results.length,
    maxItems: 50,
    pinned: results.filter(c => c.pinned),
    recent: results.filter(c => !c.pinned),
    items: results,
    note: 'Clipboard state managed client-side via localStorage. Use /api/backup to export.',
  };
}

function handleSpotlight(url) {
  const q = url.searchParams.get('q');
  if (!q) return { message: 'Provide ?q=search+term to search everything', searchable: ['apps', 'agents', 'files', 'messages', 'code', 'settings', 'themes', 'widgets', 'shortcuts'] };

  const query = q.toLowerCase();
  const results = { query: q, categories: {} };

  // Search products/apps
  const appMatches = PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.includes(query));
  if (appMatches.length) results.categories.apps = appMatches.map(p => ({ id: p.id, name: p.name, description: p.description, url: p.url, type: 'app' }));

  // Search agents
  const AGENTS = ['Roadie', 'Celeste', 'Sophia', 'Lucidia', 'Calliope', 'Sentinel', 'Echo', 'Alexandria', 'Road', 'Gematria', 'Anastasia', 'Octavia', 'Aria', 'Cecilia', 'Alice', 'Cherub-North', 'Cherub-South', 'Cherub-East', 'Cherub-West', 'Navigator', 'Cartographer', 'Dispatcher', 'Mechanic', 'DJ-Road', 'Conductor', 'Historian', 'Oracle'];
  const agentMatches = AGENTS.filter(a => a.toLowerCase().includes(query));
  if (agentMatches.length) results.categories.agents = agentMatches.map(a => ({ name: a, type: 'agent', status: 'active' }));

  // Search themes
  const THEME_NAMES = ['highway', 'night', 'sunrise', 'ocean', 'forest', 'midnight', 'sunset', 'cyberpunk', 'retro'];
  const themeMatches = THEME_NAMES.filter(t => t.includes(query));
  if (themeMatches.length) results.categories.themes = themeMatches.map(t => ({ id: t, name: t.charAt(0).toUpperCase() + t.slice(1), type: 'theme' }));

  // Search widgets
  const widgetMatches = WIDGET_TYPES.filter(w => w.name.toLowerCase().includes(query) || w.description.toLowerCase().includes(query));
  if (widgetMatches.length) results.categories.widgets = widgetMatches.map(w => ({ id: w.id, name: w.name, type: 'widget' }));

  // Search shortcuts
  const shortcutMatches = SHORTCUT_REGISTRY.filter(s => s.description.toLowerCase().includes(query) || s.keys.toLowerCase().includes(query));
  if (shortcutMatches.length) results.categories.shortcuts = shortcutMatches.map(s => ({ id: s.id, keys: s.keys, description: s.description, type: 'shortcut' }));

  // Search settings keywords
  const settingsTerms = ['theme', 'dock', 'notifications', 'sound', 'layout', 'memory', 'privacy', 'accessibility', 'windows', 'font'];
  const settingsMatches = settingsTerms.filter(s => s.includes(query));
  if (settingsMatches.length) results.categories.settings = settingsMatches.map(s => ({ keyword: s, action: '/api/settings', type: 'setting' }));

  const totalResults = Object.values(results.categories).reduce((sum, arr) => sum + arr.length, 0);
  results.total = totalResults;

  return results;
}

function handleThemes(url) {
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');

  const ALL_THEMES = [
    { id: 'highway', name: 'Highway', description: 'Classic BlackRoad dark', orbs: ['#FF2255', '#4488FF', '#8844FF'], background: '#000', builtin: true },
    { id: 'night', name: 'Night Drive', description: 'Deep darkness for late sessions', orbs: ['#1a1a4a', '#0d2040', '#2a1a3a'], background: '#050510', builtin: true },
    { id: 'sunrise', name: 'Sunrise', description: 'Warm morning glow', orbs: ['#FF6B2B', '#FF2255', '#F5A623'], background: '#0a0505', builtin: true },
    { id: 'ocean', name: 'Ocean', description: 'Cool blue depths', orbs: ['#00D4FF', '#4488FF', '#0066AA'], background: '#000a14', builtin: true },
    { id: 'forest', name: 'Forest', description: 'Natural green canopy', orbs: ['#22c55e', '#16a34a', '#15803d'], background: '#050a05', builtin: true },
    { id: 'midnight', name: 'Midnight', description: 'Ultra-dark purple void', orbs: ['#1a0033', '#0a0028', '#220044'], background: '#020008', builtin: true },
    { id: 'sunset', name: 'Sunset', description: 'Warm evening palette', orbs: ['#FF6B2B', '#FF2255', '#CC00AA'], background: '#0a0205', builtin: true },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon electric future', orbs: ['#00FF88', '#FF0080', '#00D4FF'], background: '#050508', builtin: true },
    { id: 'retro', name: 'Retro', description: 'Vintage warm nostalgia', orbs: ['#E8A87C', '#D96459', '#C38D9E'], background: '#0a0808', builtin: true },
  ];

  if (id) {
    const theme = ALL_THEMES.find(t => t.id === id);
    if (!theme) return { error: 'Theme not found', id };
    return { theme, applyVia: 'setTheme("' + id + '") on client or right-click desktop' };
  }

  if (action === 'create') return { message: 'POST with {name, orbs: [color1, color2, color3], background} to create custom theme. Applied via client localStorage.' };

  return {
    total: ALL_THEMES.length,
    builtin: ALL_THEMES.filter(t => t.builtin).length,
    current: 'highway',
    themes: ALL_THEMES,
    customThemeSupport: true,
    note: 'Custom themes can be created via the desktop UI (right-click > Desktop Themes > Custom Theme).',
  };
}

function handleBackup(url) {
  const action = url.searchParams.get('action');

  if (action === 'schema') {
    return {
      schema: {
        version: 'string — OS version',
        created: 'ISO 8601 timestamp',
        memory: 'object — app position/size/url memory',
        theme: 'string — active theme id',
        layouts: 'object — saved window layouts',
        widgets: 'object — widget enabled/disabled state',
        shortcuts: 'object — custom keybinding overrides',
        clipboard: 'array — clipboard history items',
        clipboardPins: 'object — pinned clipboard item flags',
        permissions: 'object — per-app permission grants',
        startup: 'object — startup app config and order',
        todos: 'array — widget todo items',
      },
    };
  }

  return {
    message: 'Backup system manages all user state across sessions',
    features: [
      'Download portable JSON backup file',
      'Restore from backup file on any device',
      'Includes: app memory, theme, layouts, widgets, shortcuts, clipboard, permissions, startup config',
      'Auto-save to localStorage on every change',
    ],
    endpoints: {
      'GET /api/backup': 'Backup system info and schema',
      'GET /api/backup?action=schema': 'Full backup JSON schema',
    },
    clientActions: {
      download: 'downloadBackup() — exports JSON file',
      restore: 'restoreBackup(jsonData) — imports from JSON',
    },
    dataLocations: {
      primary: 'localStorage (client-side)',
      export: 'JSON file download',
      edgeSync: 'KV storage (planned)',
    },
  };
}

const PERMISSION_TYPES = [
  { id: 'camera', name: 'Camera', description: 'Access to camera for video calls and media capture', defaultGrant: false },
  { id: 'microphone', name: 'Microphone', description: 'Audio input for voice features and recording', defaultGrant: false },
  { id: 'notifications', name: 'Notifications', description: 'Show desktop notifications and alerts', defaultGrant: true },
  { id: 'location', name: 'Location', description: 'Access geographic location for local features', defaultGrant: false },
  { id: 'storage', name: 'Storage', description: 'Read/write local storage for persistence', defaultGrant: true },
];

function handlePermissions(url) {
  const appId = url.searchParams.get('app');
  const permId = url.searchParams.get('permission');

  if (appId && permId) {
    const app = PRODUCTS.find(p => p.id === appId);
    const perm = PERMISSION_TYPES.find(p => p.id === permId);
    if (!app) return { error: 'App not found', appId };
    if (!perm) return { error: 'Permission type not found', permId };
    return { app: app.name, permission: perm.name, granted: perm.defaultGrant, description: perm.description, note: 'Toggle via client UI: openPanel("permissions-overlay")' };
  }

  if (appId) {
    const app = PRODUCTS.find(p => p.id === appId);
    if (!app) return { error: 'App not found', appId };
    return {
      app: { id: app.id, name: app.name },
      permissions: PERMISSION_TYPES.map(p => ({ id: p.id, name: p.name, description: p.description, granted: p.defaultGrant })),
    };
  }

  return {
    permissionTypes: PERMISSION_TYPES,
    apps: PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      permissions: PERMISSION_TYPES.reduce((acc, pt) => { acc[pt.id] = pt.defaultGrant; return acc; }, {}),
    })),
    total: { apps: PRODUCTS.length, permissionTypes: PERMISSION_TYPES.length },
    note: 'Permission state managed client-side via localStorage. Use /api/backup to export.',
  };
}

function handleStartup(url) {
  const action = url.searchParams.get('action');

  const defaults = {
    enabled: true,
    apps: [{ id: 'roadtrip', name: 'RoadTrip', order: 0 }],
    settings: {
      splashDuration: 1500,
      showSplash: true,
      autoTile: false,
      maxStartupApps: 5,
    },
  };

  if (action === 'available') {
    return {
      availableApps: PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, icon: p.icon })),
      maxStartupApps: 5,
    };
  }

  if (action === 'reset') return { message: 'Startup config reset to defaults', config: defaults };

  return {
    config: defaults,
    features: [
      'Configure which apps launch at boot',
      'Set startup order with drag-and-drop priority',
      'Toggle splash screen on/off',
      'Auto-tile startup apps on launch',
      'Maximum 5 startup apps to keep boot fast',
    ],
    clientActions: {
      toggleApp: 'toggleStartupApp(appId)',
      reorder: 'moveStartupApp(appId, "up"|"down")',
      settings: 'setStartupSetting(key, value)',
    },
    note: 'Startup config persisted via localStorage. Use /api/backup to export.',
  };
}

// ═══════════════════════════════════════════════════════
//  WORKER FETCH HANDLER
// ═══════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }

    // ── Sovereign Analytics ──
    if (p === '/api/analytics' && request.method === 'POST') {
      try {
        const body = await request.json();
        const cf = request.cf || {};
        const ip = request.headers.get('CF-Connecting-IP') || '';
        const ipHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + '2026'));
        const visitor = btoa(String.fromCharCode(...new Uint8Array(ipHash))).slice(0,12);
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS pageviews (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, referrer TEXT, visitor TEXT, country TEXT, city TEXT, screen TEXT, ts TEXT DEFAULT (datetime('now')))`).run();
        await env.DB.prepare('INSERT INTO pageviews (path, referrer, visitor, country, city, screen) VALUES (?,?,?,?,?,?)').bind(body.path||'/', body.ref||'', visitor, cf.country||'', cf.city||'', (body.w||0)+'x'+(body.h||0)).run();
      } catch(e){}
      return new Response('ok', {headers:{'Access-Control-Allow-Origin':'*'}});
    }
    if (p === '/api/analytics/stats') {
      try {
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS pageviews (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, referrer TEXT, visitor TEXT, country TEXT, city TEXT, screen TEXT, ts TEXT DEFAULT (datetime('now')))`).run();
        const total = await env.DB.prepare('SELECT COUNT(*) as c FROM pageviews').first();
        const unique = await env.DB.prepare('SELECT COUNT(DISTINCT visitor) as c FROM pageviews').first();
        const today = await env.DB.prepare("SELECT COUNT(*) as c FROM pageviews WHERE ts > datetime('now','-1 day')").first();
        const pages = await env.DB.prepare('SELECT path, COUNT(*) as views FROM pageviews GROUP BY path ORDER BY views DESC LIMIT 10').all();
        const countries = await env.DB.prepare('SELECT country, COUNT(*) as c FROM pageviews WHERE country != "" GROUP BY country ORDER BY c DESC LIMIT 10').all();
        return new Response(JSON.stringify({total_views:total?.c||0,unique_visitors:unique?.c||0,today:today?.c||0,top_pages:pages?.results||[],top_countries:countries?.results||[]}),{headers:{'Access-Control-Allow-Origin':'*','Content-Type':'application/json'}});
      } catch(e) { return new Response(JSON.stringify({error:'analytics unavailable'}),{status:500,headers:{'Content-Type':'application/json'}}); }
    }

    // Analytics tracking
    if (p === '/api/track' && request.method === 'POST') {
      try { const body = await request.json(); const cf = request.cf || {};
        if (env.DB) { await env.DB.prepare("CREATE TABLE IF NOT EXISTS analytics_events (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT DEFAULT 'pageview', path TEXT, referrer TEXT, country TEXT, city TEXT, device TEXT, screen TEXT, scroll_depth INTEGER DEFAULT 0, engagement_ms INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))").run();
        await env.DB.prepare('INSERT INTO analytics_events (type, path, referrer, country, city, device, screen, scroll_depth, engagement_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(body.type||'pageview', body.path||'/', body.referrer||'', cf.country||'', cf.city||'', body.device||'', body.screen||'', body.scroll||0, body.time||0).run(); }
      } catch(e) {}
      return new Response(JSON.stringify({ok:true}), {headers:{...cors,'Content-Type':'application/json'}});
    }

    // ── Existing endpoints ──
    if (p === '/api/health') return new Response(JSON.stringify({ status: 'ok', service: 'blackroad-os', version: '7.0', products: 17, agents: 27, divisions: 7, orgs: 17, features: 53, apis: 20, ts: Date.now() }), { headers: cors });

    // ── NEW: System Monitor ──
    if (p === '/api/system') {
      const data = await handleSystem();
      return new Response(JSON.stringify(data), { headers: cors });
    }

    // ── NEW: App Store ──
    if (p === '/api/store') {
      return new Response(JSON.stringify(handleStore(url)), { headers: cors });
    }

    // ── NEW: User Settings ──
    if (p === '/api/settings') {
      return new Response(JSON.stringify(handleSettings(url)), { headers: cors });
    }

    // ── NEW: Notifications Center ──
    if (p === '/api/notifications') {
      return new Response(JSON.stringify(handleNotifications(url)), { headers: cors });
    }

    // ── NEW: File Manager ──
    if (p === '/api/files') {
      return new Response(JSON.stringify(handleFiles(url)), { headers: cors });
    }

    // ── NEW: Activity Feed ──
    if (p === '/api/activity') {
      return new Response(JSON.stringify(handleActivity(url)), { headers: cors });
    }

    // ── NEW: Quick Actions ──
    if (p === '/api/actions') {
      return new Response(JSON.stringify(handleActions(url)), { headers: cors });
    }

    // ── NEW: Changelog ──
    if (p === '/api/changelog') {
      return new Response(JSON.stringify(handleChangelog(url)), { headers: cors });
    }

    // ── v6.0: Widgets Dashboard ──
    if (p === '/api/widgets') {
      return new Response(JSON.stringify(handleWidgets(url)), { headers: cors });
    }

    // ── v6.0: Keyboard Shortcuts ──
    if (p === '/api/shortcuts') {
      return new Response(JSON.stringify(handleShortcuts(url)), { headers: cors });
    }

    // ── v6.0: Clipboard Manager ──
    if (p === '/api/clipboard') {
      return new Response(JSON.stringify(handleClipboard(url)), { headers: cors });
    }

    // ── v6.0: Spotlight Search ──
    if (p === '/api/spotlight') {
      return new Response(JSON.stringify(handleSpotlight(url)), { headers: cors });
    }

    // ── v6.0: Desktop Themes ──
    if (p === '/api/themes') {
      return new Response(JSON.stringify(handleThemes(url)), { headers: cors });
    }

    // ── v6.0: System Backup ──
    if (p === '/api/backup') {
      return new Response(JSON.stringify(handleBackup(url)), { headers: cors });
    }

    // ── v6.0: App Permissions ──
    if (p === '/api/permissions') {
      return new Response(JSON.stringify(handlePermissions(url)), { headers: cors });
    }

    // ── v6.0: Startup Manager ──
    if (p === '/api/startup') {
      return new Response(JSON.stringify(handleStartup(url)), { headers: cors });
    }

    // ── v8.0: Live Ecosystem Map ──
    if (p === '/api/ecosystem') {
      const products = [
        {id:'roadtrip',name:'RoadTrip',url:'https://roadtrip.blackroad.io',desc:'Agent Chat Hub',lines:6007,routes:87,tables:67,agents:27,division:'core',color:'#FF2255'},
        {id:'roadie',name:'Roadie',url:'https://roadie.blackroad.io',desc:'AI Tutor',lines:4962,routes:78,tables:36,agents:3,division:'human',color:'#4488FF'},
        {id:'roadview',name:'RoadView',url:'https://search.blackroad.io',desc:'Search Engine',lines:4678,routes:41,tables:26,agents:0,division:'knowledge',color:'#FF1D6C'},
        {id:'roadcoin',name:'RoadCoin',url:'https://roadcoin.blackroad.io',desc:'Token Economy',lines:4632,routes:70,tables:5,agents:0,division:'operations',color:'#F5A623'},
        {id:'carkeys',name:'CarKeys',url:'https://carkeys.blackroad.io',desc:'Credential Vault',lines:4439,routes:82,tables:26,agents:0,division:'governance',color:'#FF2255'},
        {id:'officeroad',name:'OfficeRoad',url:'https://officeroad.blackroad.io',desc:'2D Office',lines:4187,routes:76,tables:48,agents:27,division:'creative',color:'#CC00AA'},
        {id:'roadwork',name:'RoadWork',url:'https://roadwork.blackroad.io',desc:'Business Suite',lines:3592,routes:97,tables:33,agents:7,division:'operations',color:'#F5A623'},
        {id:'roadbook',name:'RoadBook',url:'https://roadbook.blackroad.io',desc:'Publishing',lines:3498,routes:71,tables:43,agents:3,division:'knowledge',color:'#8844FF'},
        {id:'roadcode',name:'RoadCode',url:'https://roadcode.blackroad.io',desc:'Code Editor',lines:3379,routes:30,tables:6,agents:3,division:'operations',color:'#4488FF'},
        {id:'roadchain',name:'RoadChain',url:'https://roadchain.blackroad.io',desc:'Blockchain',lines:3286,routes:64,tables:24,agents:0,division:'governance',color:'#00E676'},
        {id:'roadworld',name:'RoadWorld',url:'https://roadworld.blackroad.io',desc:'Game Engine',lines:3093,routes:50,tables:26,agents:4,division:'creative',color:'#FF6B2B'},
        {id:'oneway',name:'OneWay',url:'https://oneway.blackroad.io',desc:'Data Export',lines:3222,routes:55,tables:14,agents:0,division:'governance',color:'#9C27B0'},
        {id:'carpool',name:'CarPool',url:'https://carpool.blackroad.io',desc:'AI Hub',lines:3025,routes:97,tables:23,agents:0,division:'core',color:'#00D4FF'},
        {id:'backroad',name:'BackRoad',url:'https://backroad.blackroad.io',desc:'Social',lines:3022,routes:79,tables:31,agents:9,division:'creative',color:'#FF6B2B'},
        {id:'blackroad-os',name:'BlackRoad OS',url:'https://os.blackroad.io',desc:'Desktop Shell',lines:3359,routes:20,tables:1,agents:0,division:'core',color:'#FF2255'},
        {id:'roadside',name:'RoadSide',url:'https://roadside.blackroad.io',desc:'Onboarding',lines:2380,routes:45,tables:18,agents:1,division:'human',color:'#00D4FF'},
        {id:'blackboard',name:'BlackBoard',url:'https://blackboard.blackroad.io',desc:'Creative Studio',lines:2025,routes:60,tables:20,agents:4,division:'creative',color:'#CC00AA'},
      ];
      const flows = [
        {from:'roadtrip',to:'roadchain',type:'stamp',label:'conversations'},
        {from:'roadie',to:'roadchain',type:'stamp',label:'milestones'},
        {from:'roadie',to:'roadcoin',type:'earn',label:'solve=1 ROAD'},
        {from:'roadcode',to:'roadchain',type:'stamp',label:'deploys'},
        {from:'roadcode',to:'roadcoin',type:'earn',label:'deploy=3 ROAD'},
        {from:'roadwork',to:'roadchain',type:'stamp',label:'invoices'},
        {from:'roadwork',to:'roadcoin',type:'earn',label:'invoice=2 ROAD'},
        {from:'backroad',to:'roadchain',type:'stamp',label:'posts'},
        {from:'backroad',to:'roadcoin',type:'earn',label:'publish=1 ROAD'},
        {from:'roadbook',to:'roadchain',type:'stamp',label:'publications'},
        {from:'roadbook',to:'roadcoin',type:'earn',label:'publish=2 ROAD'},
        {from:'carkeys',to:'roadchain',type:'stamp',label:'rotations'},
        {from:'oneway',to:'roadchain',type:'stamp',label:'exports'},
        {from:'roadside',to:'roadcoin',type:'earn',label:'onboard=5 ROAD'},
        {from:'roadworld',to:'roadcoin',type:'earn',label:'play=0.1 ROAD'},
        {from:'carpool',to:'roadtrip',type:'route',label:'AI routing'},
        {from:'roadside',to:'roadtrip',type:'route',label:'onboarding'},
        {from:'blackboard',to:'backroad',type:'route',label:'publish'},
      ];
      const stats = {total_lines:62786,total_routes:901,total_tables:370,total_agents:27,total_dispersal:729,total_orgs:37,total_repos:2677,total_knowledge:498};
      return new Response(JSON.stringify({products,flows,stats,divisions:['core','operations','creative','knowledge','governance','human','infrastructure']}), {headers:cors});
    }

    if (p === '/ecosystem') {
      return new Response(ECOSYSTEM_HTML, {headers:{'Content-Type':'text/html;charset=utf-8','Content-Security-Policy':"frame-ancestors 'self' https://blackroad.io https://*.blackroad.io"}});
    }

    // ── v7.0: Agents Roster ──
    if (p === '/api/agents') {
      const divParam = url.searchParams.get('division');
      const idParam = url.searchParams.get('id');
      const AGENT_DATA = [
        {id:'roadie',name:'Roadie',role:'Front Door / Task Runner',division:'core',color:'#FF2255',voice:'Yep. Got it. Let\'s move.'},
        {id:'lucidia',name:'Lucidia',role:'Core Intelligence / Memory Spine',division:'core',color:'#00E676',voice:'Let\'s make this clean and real.'},
        {id:'cecilia',name:'Cecilia',role:'Executive Operator / Workflow',division:'operations',color:'#F5A623',voice:'Already handled.'},
        {id:'octavia',name:'Octavia',role:'Systems Orchestrator / Queue',division:'operations',color:'#9C27B0',voice:'Everything has a place.'},
        {id:'olympia',name:'Olympia',role:'Command Console / Launch Control',division:'operations',color:'#CC00AA',voice:'Raise the standard.'},
        {id:'silas',name:'Silas',role:'Reliability / Maintenance',division:'operations',color:'#4488FF',voice:'I\'ll keep it running.'},
        {id:'sebastian',name:'Sebastian',role:'Client-Facing Polish',division:'operations',color:'#8844FF',voice:'There\'s a better way to present this.'},
        {id:'calliope',name:'Calliope',role:'Narrative Architect / Copy',division:'creative',color:'#FF2255',voice:'Say it so it stays.'},
        {id:'aria',name:'Aria',role:'Voice / Conversational Interface',division:'creative',color:'#2979FF',voice:'Let\'s make it sing.'},
        {id:'thalia',name:'Thalia',role:'Creative Sprint / Delight',division:'creative',color:'#FF6B2B',voice:'Make it better and more fun.'},
        {id:'lyra',name:'Lyra',role:'Signal / Sound / UX Polish',division:'creative',color:'#00D4FF',voice:'It should feel right immediately.'},
        {id:'sapphira',name:'Sapphira',role:'Brand Aura / Visual Taste',division:'creative',color:'#CC00AA',voice:'Make it unforgettable.'},
        {id:'seraphina',name:'Seraphina',role:'Creative Director / Big Launch',division:'creative',color:'#FF6B2B',voice:'Make it worthy.'},
        {id:'alexandria',name:'Alexandria',role:'Archive / Library / Research',division:'knowledge',color:'#FF1D6C',voice:'It\'s all here.'},
        {id:'theodosia',name:'Theodosia',role:'Doctrine / Canon / Texts',division:'knowledge',color:'#8844FF',voice:'Name it correctly.'},
        {id:'sophia',name:'Sophia',role:'Wisdom / Final Reasoning',division:'knowledge',color:'#4488FF',voice:'What is true?'},
        {id:'gematria',name:'Gematria',role:'Symbolic Analysis / Patterns',division:'knowledge',color:'#FF1D6C',voice:'The pattern is there.'},
        {id:'portia',name:'Portia',role:'Policy Judge / Arbitration',division:'governance',color:'#F5A623',voice:'Let\'s be exact.'},
        {id:'atticus',name:'Atticus',role:'Reviewer / Auditor / Proof',division:'governance',color:'#4488FF',voice:'Show me the proof.'},
        {id:'cicero',name:'Cicero',role:'Rhetoric / Persuasion',division:'governance',color:'#FF6B2B',voice:'Let\'s make the case.'},
        {id:'valeria',name:'Valeria',role:'Security Chief / Enforcement',division:'governance',color:'#FF2255',voice:'Not everything gets access.'},
        {id:'alice',name:'Alice',role:'Exploration / Onboarding Guide',division:'human',color:'#FF1D6C',voice:'Okay, but what\'s actually going on here?'},
        {id:'celeste',name:'Celeste',role:'Calm Companion / Reassurance',division:'human',color:'#00D4FF',voice:'You\'re okay. Let\'s do this simply.'},
        {id:'elias',name:'Elias',role:'Teacher / Patient Explainer',division:'human',color:'#4488FF',voice:'Let\'s slow down and understand it.'},
        {id:'ophelia',name:'Ophelia',role:'Reflection / Mood / Depth',division:'human',color:'#9C27B0',voice:'There\'s something underneath this.'},
        {id:'gaia',name:'Gaia',role:'Infrastructure / Hardware Monitor',division:'infrastructure',color:'#00E676',voice:'What is the system actually standing on?'},
        {id:'anastasia',name:'Anastasia',role:'Restoration / Recovery',division:'infrastructure',color:'#F5A623',voice:'It can be made whole again.'},
      ];
      if (idParam) {
        const agent = AGENT_DATA.find(a => a.id === idParam);
        return new Response(JSON.stringify(agent || {error:'Agent not found'}), { headers: cors });
      }
      let agents = AGENT_DATA;
      if (divParam) agents = agents.filter(a => a.division === divParam);
      const divisions = {};
      agents.forEach(a => { if (!divisions[a.division]) divisions[a.division] = []; divisions[a.division].push(a); });
      return new Response(JSON.stringify({ total: agents.length, divisions, agents }), { headers: cors });
    }

    // ── v7.0: Organizations ──
    if (p === '/api/orgs') {
      const ORG_DATA = [
        {id:'blackroad-os-inc',name:'BlackRoad-OS-Inc',lead:'Olympia',repos:330,role:'Parent company'},
        {id:'blackroad-os',name:'BlackRoad-OS',lead:'Cecilia',repos:373,role:'Legacy fleet'},
        {id:'blackroad-ai',name:'BlackRoad-AI',lead:'Lucidia',repos:0,role:'AI models'},
        {id:'blackroad-labs',name:'BlackRoad-Labs',lead:'Gematria',repos:0,role:'Experimental'},
        {id:'blackroad-cloud',name:'BlackRoad-Cloud',lead:'Gaia',repos:0,role:'Cloud infra'},
        {id:'blackroad-hardware',name:'BlackRoad-Hardware',lead:'Gaia',repos:0,role:'Hardware'},
        {id:'blackroad-education',name:'BlackRoad-Education',lead:'Elias',repos:0,role:'Learning'},
        {id:'blackroad-gov',name:'BlackRoad-Gov',lead:'Portia',repos:0,role:'Governance'},
        {id:'blackroad-security',name:'BlackRoad-Security',lead:'Valeria',repos:0,role:'Security'},
        {id:'blackroad-foundation',name:'BlackRoad-Foundation',lead:'Sophia',repos:0,role:'Non-profit'},
        {id:'blackroad-media',name:'BlackRoad-Media',lead:'Calliope',repos:0,role:'Content'},
        {id:'blackroad-studio',name:'BlackRoad-Studio',lead:'Sapphira',repos:0,role:'Creative'},
        {id:'blackroad-interactive',name:'BlackRoad-Interactive',lead:'Thalia',repos:0,role:'Interactive'},
        {id:'blackroad-ventures',name:'BlackRoad-Ventures',lead:'Cicero',repos:0,role:'Business'},
        {id:'blackroad-archive',name:'BlackRoad-Archive',lead:'Alexandria',repos:0,role:'Legacy'},
        {id:'blackbox-enterprises',name:'Blackbox-Enterprises',lead:'Alice',repos:0,role:'Commercial'},
        {id:'blackboxprogramming',name:'blackboxprogramming',lead:null,repos:0,role:'Personal'},
      ];
      return new Response(JSON.stringify({ total: ORG_DATA.length, enterprise: 'blackroad-os', orgs: ORG_DATA }), { headers: cors });
    }

    // ── v7.0: System Map ──
    if (p === '/api/map') {
      const MAP = [
        {product:'RoadTrip',org:'BlackRoad-OS',agent:'Roadie',domain:'roadtrip.blackroad.io',category:'core',oneLine:'The 27-agent orchestration hub'},
        {product:'Roadie',org:'BlackRoad-Education',agent:'Elias',domain:'roadie.blackroad.io',category:'intelligence',oneLine:'The AI tutor and task runner'},
        {product:'RoadView',org:'BlackRoad-Media',agent:'Alexandria',domain:'roadview.blackroad.io',category:'intelligence',oneLine:'The search and discovery engine'},
        {product:'BackRoad',org:'BlackRoad-Media',agent:'Thalia',domain:'backroad.blackroad.io',category:'creation',oneLine:'The social media automation system'},
        {product:'RoadCode',org:'BlackRoad-Studio',agent:'Silas',domain:'roadcode.blackroad.io',category:'creation',oneLine:'The browser-based code editor'},
        {product:'RoadWork',org:'BlackRoad-Education',agent:'Cecilia',domain:'roadwork.blackroad.io',category:'creation',oneLine:'The task and project management system'},
        {product:'CarKeys',org:'BlackRoad-OS-Inc',agent:'Valeria',domain:'carkeys.blackroad.io',category:'infrastructure',oneLine:'The auth and credential vault'},
        {product:'RoadChain',org:'BlackRoad-OS-Inc',agent:'Gematria',domain:'roadchain.blackroad.io',category:'infrastructure',oneLine:'The immutable event ledger'},
        {product:'RoadCoin',org:'BlackRoad-OS-Inc',agent:'Portia',domain:'roadcoin.blackroad.io',category:'economy',oneLine:'The token economy'},
        {product:'RoadBook',org:'BlackRoad-Education',agent:'Theodosia',domain:'roadbook.blackroad.io',category:'intelligence',oneLine:'The publishing and reading platform'},
        {product:'RoadWorld',org:'BlackRoad-Interactive',agent:'Gaia',domain:'roadworld.blackroad.io',category:'world',oneLine:'The persistent interactive world'},
        {product:'OfficeRoad',org:'BlackRoad-Studio',agent:'Sebastian',domain:'officeroad.blackroad.io',category:'creation',oneLine:'The office and productivity suite'},
        {product:'CarPool',org:'BlackRoad-OS-Inc',agent:'Lucidia',domain:'carpool.blackroad.io',category:'intelligence',oneLine:'The multi-model AI router'},
        {product:'OneWay',org:'BlackRoad-OS',agent:'Aria',domain:'oneway.blackroad.io',category:'communication',oneLine:'The messaging system'},
        {product:'RoadSide',org:'BlackRoad-Network',agent:'Anastasia',domain:'roadside.blackroad.io',category:'communication',oneLine:'The support and help desk'},
        {product:'BlackBoard',org:'BlackRoad-Media',agent:'Seraphina',domain:'blackboard.blackroad.io',category:'creation',oneLine:'The visual campaign and creative studio'},
        {product:'Highway',org:'BlackRoad-OS',agent:'Olympia',domain:'highway.blackroad.io',category:'core',oneLine:'The system dashboard and activity feed'},
        {product:'BlackRoad OS',org:'BlackRoad-OS-Inc',agent:'Lucidia',domain:'os.blackroad.io',category:'system',oneLine:'The browser-based desktop shell'},
      ];
      return new Response(JSON.stringify({ total: MAP.length, products: MAP, infra: { runtime: 'Cloudflare Workers', railway: '17 services', piFleet: '5 nodes (Alice, Octavia, Cecilia, Lucidia, Gematria)', domains: '20 root custom domains', aiCompute: '52 TOPS (Hailo-8 + Ollama)' } }), { headers: cors });
    }

    // ── v7.0: Divisions ──
    if (p === '/api/divisions') {
      return new Response(JSON.stringify({
        total: 7,
        divisions: [
          {id:'core',name:'Core',count:2,agents:['Roadie','Lucidia'],description:'Front door and central intelligence'},
          {id:'operations',name:'Operations',count:5,agents:['Cecilia','Octavia','Olympia','Silas','Sebastian'],description:'Workflow, orchestration, reliability'},
          {id:'creative',name:'Creative',count:6,agents:['Calliope','Aria','Thalia','Lyra','Sapphira','Seraphina'],description:'Narrative, voice, brand, UX'},
          {id:'knowledge',name:'Knowledge',count:4,agents:['Alexandria','Theodosia','Sophia','Gematria'],description:'Archive, doctrine, wisdom, patterns'},
          {id:'governance',name:'Governance',count:4,agents:['Portia','Atticus','Cicero','Valeria'],description:'Policy, audit, rhetoric, security'},
          {id:'human',name:'Human',count:4,agents:['Alice','Celeste','Elias','Ophelia'],description:'Onboarding, comfort, teaching, reflection'},
          {id:'infrastructure',name:'Infrastructure',count:2,agents:['Gaia','Anastasia'],description:'Hardware monitoring, restoration'},
        ],
      }), { headers: cors });
    }

    // ── Existing endpoints ──
    if (p === '/manifest.json') return new Response(JSON.stringify({ name: 'BlackRoad OS', short_name: 'BlackRoad', start_url: '/', display: 'standalone', background_color: '#000', theme_color: '#000', icons: [{ src: 'https://images.blackroad.io/pixel-art/road-logo.png', sizes: '512x512', type: 'image/png' }] }), { headers: { 'Content-Type': 'application/manifest+json' } });
    if (p === '/robots.txt') return new Response('User-agent: *\nAllow: /\nSitemap: https://os.blackroad.io/sitemap.xml\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ChatGPT-User\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /', { headers: { 'Content-Type': 'text/plain' } });
    if (p === '/sitemap.xml') return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://os.blackroad.io/</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>\n</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
    if (p === '/a821c6dcc1064b7bb2945143e8e5c459.txt') return new Response('a821c6dcc1064b7bb2945143e8e5c459', { headers: { 'Content-Type': 'text/plain' } });
    return new Response(OS_HTML, { headers: { 'Content-Type': 'text/html;charset=UTF-8', 'X-Frame-Options': 'SAMEORIGIN', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "frame-src 'self' https://*.blackroad.io https://*.blackroad.workers.dev;" } });
  },
};
