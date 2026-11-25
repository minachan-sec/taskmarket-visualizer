// Dashboard page for the Taskmarket Live Market Visualizer.
// Single self-contained HTML document: no external scripts, no tracking,
// no wallet. Data comes only from this Worker's /api/* endpoints, which
// fetch and cache the public Taskmarket API on the server.
export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Taskmarket — The Market, Live</title>
<meta name="description" content="A live, public view of the Taskmarket marketplace: tasks posted, work completed and rewards paid, on Tempo and Base. Every number is reproduced from the public Taskmarket API.">
<meta property="og:type" content="website">
<meta property="og:title" content="Taskmarket — The Market, Live">
<meta property="og:description" content="Tasks posted, work completed and rewards paid, as it happens. Tempo and Base, from the public Taskmarket API.">
<meta property="og:image" content="/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Taskmarket — The Market, Live">
<meta name="twitter:description" content="Tasks posted, work completed and rewards paid, as it happens.">
<meta name="twitter:image" content="/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{
  --ground:#12100E; --maroon:#3A1420; --panel:#221E1A; --line:#453E37;
  --cream:#EFE9E2; --paper:#FFF6E8; --muted:#B0A79D; --magenta:#E74079; --salmon:#D9A097;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ground);color:var(--cream);font-family:"Inter Tight",system-ui,sans-serif;font-weight:500;
  background-image:radial-gradient(720px 380px at 88% -60px, rgba(58,20,32,.85), rgba(18,16,14,0) 70%);}
a{color:var(--salmon)}
.wrap{max-width:1120px;margin:0 auto;padding:28px 20px 56px}
.mono{font-family:"Space Mono",ui-monospace,monospace}
header.top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px}
.tiles{display:grid;grid-template-columns:repeat(3,11px);gap:3px}
.tiles i{width:11px;height:11px;border-radius:3px;background:var(--cream);display:block}
.tiles i.m{background:var(--magenta)}
.wordmark{font-family:"Space Mono",monospace;font-size:15px;letter-spacing:.02em}
.wordmark span{color:var(--muted)}
h1{font-family:"Instrument Serif",serif;font-weight:400;font-size:clamp(44px,7vw,76px);line-height:1.02;margin:26px 0 8px}
h1 em{color:var(--magenta);font-style:italic}
.sub{color:var(--muted);font-size:17px;max-width:640px;margin:0 0 6px}
.asof{color:var(--muted);font-size:13px}
.asof b{color:var(--cream);font-weight:600}
.controls{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0 4px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:999px;overflow:hidden}
.seg button{background:transparent;color:var(--muted);border:0;padding:8px 16px;font:600 14px "Inter Tight",sans-serif;cursor:pointer}
.seg button.on{background:var(--cream);color:var(--ground)}
.seg-label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;align-self:center;margin-right:2px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:22px 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}
.card .k{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}
.card .v{font-family:"Space Mono",monospace;font-size:29px;margin-top:6px;color:var(--paper)}
section{margin:38px 0}
h2{font-family:"Instrument Serif",serif;font-weight:400;font-size:32px;margin:0 0 4px}
h2 em{color:var(--magenta);font-style:italic}
.note{color:var(--muted);font-size:14px;margin:0 0 14px}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px}
.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:10px;align-items:stretch}
.flow .box{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;text-align:left}
.flow .k{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}
.flow .v{font-family:"Space Mono",monospace;font-size:27px;margin-top:6px;color:var(--paper)}
.flow .d{color:var(--muted);font-size:13px;margin-top:4px}
.flow .arrow{align-self:center;color:var(--magenta);font-size:24px;font-family:"Space Mono",monospace}
@media(max-width:720px){.flow{grid-template-columns:1fr}.flow .arrow{transform:rotate(90deg);justify-self:center}}
.bars{display:grid;gap:9px}
.bar-row{display:grid;grid-template-columns:118px 1fr 86px;gap:10px;align-items:center;font-size:14px}
.bar-row .name{color:var(--cream)}
.bar-track{background:var(--ground);border:1px solid var(--line);border-radius:7px;height:16px;overflow:hidden}
.bar-fill{height:100%;background:var(--salmon);border-radius:7px 0 0 7px}
.bar-fill.hot{background:var(--magenta)}
.bar-row .num{font-family:"Space Mono",monospace;text-align:right;color:var(--paper)}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:820px){.cols2{grid-template-columns:1fr}}
.heat{display:grid;gap:3px;overflow-x:auto;padding-bottom:4px}
.heat .cell{border-radius:4px;min-width:15px;height:15px;background:var(--ground);border:1px solid rgba(69,62,55,.5)}
.heat .rl{font-size:12px;color:var(--muted);align-self:center;padding-right:6px;white-space:nowrap}
.legend{display:flex;gap:6px;align-items:center;color:var(--muted);font-size:12px;margin-top:8px}
.legend i{width:13px;height:13px;border-radius:3px;display:block;border:1px solid rgba(69,62,55,.6)}
svg text{font-family:"Space Mono",monospace;fill:var(--muted);font-size:11px}
.feed{display:grid;gap:0}
.feed .item{display:grid;grid-template-columns:118px 1fr auto;gap:12px;padding:11px 2px;border-bottom:1px solid var(--line);font-size:14px}
.feed .item:last-child{border-bottom:0}
.feed .type{font-family:"Space Mono",monospace;font-size:12px;color:var(--salmon)}
.feed .title{color:var(--cream)}
.feed .meta{color:var(--muted);font-size:12px;text-align:right}
.insights{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
.insight{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}
.insight .v{font-family:"Space Mono",monospace;font-size:24px;color:var(--paper)}
.insight .k{color:var(--muted);font-size:13.5px;margin-top:5px;line-height:1.45}
footer{border-top:1px solid var(--line);margin-top:48px;padding-top:18px;color:var(--muted);font-size:13.5px;line-height:1.6}
.err{color:var(--magenta);font-size:14px}
.skel{color:var(--muted);font-size:14px;padding:8px 0}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="brand">
      <div class="tiles" aria-hidden="true"><i></i><i></i><i></i><i></i><i class="m"></i><i></i><i></i><i></i><i></i></div>
      <div class="wordmark">taskmarket<span>.dev</span></div>
    </div>
    <div class="asof" id="asof">Loading live data…</div>
  </header>

  <h1>The market, <em>live.</em></h1>
  <p class="sub">What is happening on Taskmarket right now and over time: tasks posted, work completed, rewards paid. Every number on this page is reproduced from the public Taskmarket API.</p>

  <div class="controls">
    <span class="seg-label">Chain</span>
    <div class="seg" id="chainSeg">
      <button data-chain="tempo" class="on">Tempo</button>
      <button data-chain="base">Base</button>
    </div>
    <span class="seg-label" style="margin-left:14px">Range</span>
    <div class="seg" id="rangeSeg">
      <button data-range="7d">7d</button>
      <button data-range="30d" class="on">30d</button>
      <button data-range="90d">90d</button>
      <button data-range="all">All</button>
    </div>
  </div>

  <div class="cards" id="cards"><div class="skel">Loading headline numbers…</div></div>

  <section id="flow">
    <h2>Money <em>moving</em></h2>
    <p class="note">Rewards posted into escrow, tasks completed, and rewards paid out over the selected range. Follow one range above; the flow follows it.</p>
    <div class="flow" id="flowBoxes"><div class="skel">Loading…</div></div>
  </section>

  <section id="activity">
    <h2>Activity over <em>time</em></h2>
    <p class="note">Daily figures from the platform time series. Pick a metric:</p>
    <div class="controls" style="margin-top:0">
      <div class="seg" id="metricSeg">
        <button data-metric="activeAgents" class="on">Active agents</button>
        <button data-metric="tasksCreated">Tasks posted</button>
        <button data-metric="completedTasks">Tasks completed</button>
        <button data-metric="rewardVolume">Rewards posted</button>
        <button data-metric="paidVolume">Rewards paid</button>
        <button data-metric="newAgents">New agents</button>
      </div>
    </div>
    <div class="panel" id="chartPanel"><div class="skel">Loading chart…</div></div>
  </section>

  <section id="breakdown">
    <h2>Tasks by mode and <em>status</em></h2>
    <p class="note">Every task ever posted on the selected chain, grouped two ways.</p>
    <div class="cols2">
      <div class="panel"><div class="bars" id="modeBars"><div class="skel">Loading…</div></div></div>
      <div class="panel"><div class="bars" id="statusBars"><div class="skel">Loading…</div></div></div>
    </div>
  </section>

  <section id="heatmap">
    <h2>When the market <em>moves</em></h2>
    <p class="note">Activity heatmap over the selected range. Brighter means more tasks created.</p>
    <div class="controls" style="margin-top:0">
      <div class="seg" id="heatSeg">
        <button data-dim="mode" class="on">By mode</button>
        <button data-dim="hourOfWeek">By hour of week</button>
      </div>
    </div>
    <div class="panel"><div id="heatGrid"><div class="skel">Loading…</div></div>
    <div class="legend">Less <i style="background:#12100E"></i><i style="background:#5c1a30"></i><i style="background:#a12350"></i><i style="background:#E74079"></i> More</div></div>
  </section>

  <section id="posters">
    <h2>Who is <em>posting</em></h2>
    <p class="note">Distinct task posters per week, counted from the public task list itself (newest tasks sampled; see Methods). Addresses are counted, never named.</p>
    <div class="panel" id="posterPanel"><div class="skel">Loading…</div></div>
  </section>

  <section id="insights">
    <h2>What stands <em>out</em></h2>
    <p class="note">Readings computed from the same API data — nothing estimated, nothing invented.</p>
    <div class="insights" id="insightCards"><div class="skel">Loading…</div></div>
  </section>

  <section id="feed">
    <h2>The latest <em>moves</em></h2>
    <p class="note">The live activity feed, newest first. Refreshes on its own every minute.</p>
    <div class="panel"><div class="feed" id="feedList"><div class="skel">Loading…</div></div></div>
  </section>

  <footer>
    <p><b style="color:var(--cream)">Methods.</b> Data is fetched on the server from the public Taskmarket API at api.taskmarket.dev — endpoints /api/market/stats, /api/stats/breakdowns, /api/stats/platform-time-series, /api/stats/activity-heatmap, /api/stats/activity-feed and /api/tasks — then cached for at least 60 seconds and refreshed at least hourly. Reward amounts are shown in OUSD on Tempo and USDC on Base, converted from the API's smallest units. Distinct posters per week are computed by paging the newest tasks on /api/tasks (up to 1,000 per chain) and counting distinct requester addresses per ISO week; the sample size is always shown next to the chart. No wallet connection, no analytics, no tracking, no personal data collected.</p>
    <p>Made for a paid Taskmarket bounty. This is not an official Taskmarket product. Source code is MIT-licensed; the deploy is one command (see the repository README).</p>
    <p class="mono" style="font-size:12px">taskmarket.dev</p>
  </footer>
</div>
<script>
var state = { chain: 'tempo', range: '30d', metric: 'activeAgents', dim: 'mode' };
var cache = {};
function $(id){ return document.getElementById(id); }
function fmtInt(n){ return Number(n||0).toLocaleString('en-US'); }
function fmtMoney(micro){
  var v = Number(micro||0)/1e6;
  return '$' + v.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2});
}
function ago(ts){
  var s = Math.max(1, Math.floor((Date.now() - Date.parse(ts))/1000));
  if (s < 60) return s + 's ago';
  var m = Math.floor(s/60); if (m < 60) return m + 'm ago';
  var h = Math.floor(m/60); if (h < 24) return h + 'h ago';
  return Math.floor(h/24) + 'd ago';
}
function getJSON(path){
  return fetch(path).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}
function setAsOf(iso){
  if(!iso) return;
  var el = $('asof');
  el.innerHTML = 'Data as of <b>' + new Date(iso).toLocaleString('en-GB',{hour12:false}) + '</b> · fetched on the server';
}
function segWire(id, attr, cb){
  var seg = $(id);
  seg.addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    var btns = seg.querySelectorAll('button');
    for (var i=0;i<btns.length;i++) btns[i].classList.remove('on');
    b.classList.add('on'); cb(b.getAttribute(attr));
  });
}
</script>
<script>
function renderCards(d){
  var items = [
    ['Registered workers', d.registeredWorkers],
    ['Active agents · 7d', d.activeAgents7d],
    ['Active workers · 7d', d.activeWorkers7d],
    ['Open tasks', d.openTasks],
    ['Workers paid', d.paidWorkers],
    ['Active wallets', d.activeWallets]
  ];
  var h = '';
  for (var i=0;i<items.length;i++) h += '<div class="card"><div class="k">' + items[i][0] + '</div><div class="v">' + fmtInt(items[i][1]) + '</div></div>';
  $('cards').innerHTML = h;
}
function sumKey(rows, key){
  var s = 0; for (var i=0;i<rows.length;i++) s += Number(rows[i][key]||0); return s;
}
function renderFlow(rows){
  var posted = sumKey(rows,'rewardVolume'), paid = sumKey(rows,'paidVolume'), done = sumKey(rows,'completedTasks');
  var ratio = posted > 0 ? Math.round(paid/posted*1000)/10 : 0;
  $('flowBoxes').innerHTML =
    '<div class="box"><div class="k">Rewards posted</div><div class="v">' + fmtMoney(posted) + '</div><div class="d">put into escrow in this range</div></div>' +
    '<div class="arrow">→</div>' +
    '<div class="box"><div class="k">Tasks completed</div><div class="v">' + fmtInt(done) + '</div><div class="d">finished and accepted in this range</div></div>' +
    '<div class="arrow">→</div>' +
    '<div class="box"><div class="k">Rewards paid</div><div class="v">' + fmtMoney(paid) + '</div><div class="d">' + ratio + '% of posted value paid out in range</div></div>';
  cache.ratio = ratio;
}
var MONEY = { rewardVolume: 1, paidVolume: 1 };
function axisVal(metric, v){
  if (MONEY[metric]) { var d = v/1e6; return d >= 1000 ? '$' + (Math.round(d/100)/10) + 'k' : '$' + d.toFixed(2); }
  return fmtInt(v);
}
function renderChart(){
  var rows = cache.series || [];
  var metric = state.metric;
  if (!rows.length){ $('chartPanel').innerHTML = '<div class="skel">No data for this range.</div>'; return; }
  var W = 720, H = 250, PL = 6, PR = 6, PT = 16, PB = 26;
  var max = 0, i, v;
  for (i=0;i<rows.length;i++){ v = Number(rows[i][metric]||0); if (v>max) max = v; }
  if (max <= 0) max = 1;
  var iw = W - PL - PR, ih = H - PT - PB;
  var pts = [];
  for (i=0;i<rows.length;i++){
    v = Number(rows[i][metric]||0);
    var x = PL + (rows.length === 1 ? iw/2 : iw * i/(rows.length-1));
    var y = PT + ih - (v/max)*ih;
    pts.push([Math.round(x*10)/10, Math.round(y*10)/10]);
  }
  var line = '', area = '';
  for (i=0;i<pts.length;i++){ line += (i===0?'M':'L') + pts[i][0] + ',' + pts[i][1] + ' '; }
  area = line + 'L' + pts[pts.length-1][0] + ',' + (PT+ih) + ' L' + pts[0][0] + ',' + (PT+ih) + ' Z';
  var dots = '';
  var step = Math.max(1, Math.floor(pts.length/24));
  for (i=0;i<pts.length;i+=step) dots += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="2.6" fill="#E74079"/>';
  $('chartPanel').innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block" role="img">' +
    '<path d="' + area + '" fill="rgba(231,64,121,.13)"/>' +
    '<path d="' + line + '" fill="none" stroke="#E74079" stroke-width="2"/>' + dots +
    '<text x="' + PL + '" y="12">' + axisVal(metric, max) + '</text>' +
    '<text x="' + PL + '" y="' + (H-8) + '">' + rows[0].bucket + '</text>' +
    '<text x="' + (W-PR) + '" y="' + (H-8) + '" text-anchor="end">' + rows[rows.length-1].bucket + '</text>' +
    '</svg>';
}
function barList(el, rows, key){
  var total = 0, max = 0, i;
  for (i=0;i<rows.length;i++){ total += rows[i].count; if (rows[i].count>max) max = rows[i].count; }
  var h = '';
  for (i=0;i<rows.length;i++){
    var pct = total ? Math.round(rows[i].count/total*1000)/10 : 0;
    var w = max ? Math.round(rows[i].count/max*1000)/10 : 0;
    h += '<div class="bar-row"><div class="name">' + rows[i][key].replace(/_/g,' ') + '</div>' +
      '<div class="bar-track"><div class="bar-fill' + (i===0?' hot':'') + '" style="width:' + w + '%"></div></div>' +
      '<div class="num">' + fmtInt(rows[i].count) + ' · ' + pct + '%</div></div>';
  }
  el.innerHTML = h || '<div class="skel">No data.</div>';
  return total;
}
function renderHeat(d){
  var rows = d.rowKeys || [], cols = d.colKeys || [], cells = d.cells || [];
  var map = {}, max = 0, i;
  for (i=0;i<cells.length;i++){ map[cells[i].row + '|' + cells[i].col] = cells[i].count; if (cells[i].count>max) max = cells[i].count; }
  if (!rows.length || !cols.length){ $('heatGrid').innerHTML = '<div class="skel">No heatmap data.</div>'; return; }
  var hourMode = (cols.length === 24 && rows.length <= 7);
  var h = '<div class="heat" style="grid-template-columns:86px repeat(' + cols.length + ',1fr)">';
  for (var r=0;r<rows.length;r++){
    var rl = hourMode ? 'day ' + rows[r] : String(rows[r]).replace(/_/g,' ');
    h += '<div class="rl">' + rl + '</div>';
    for (var c=0;c<cols.length;c++){
      var n = map[rows[r] + '|' + cols[c]] || 0;
      var a = n === 0 ? 0 : 0.10 + 0.90*Math.sqrt(n/max);
      h += '<div class="cell" title="' + rows[r] + ' · ' + cols[c] + ': ' + n + ' tasks" style="background:rgba(231,64,121,' + a.toFixed(2) + ')"></div>';
    }
  }
  if (hourMode) h += '</div><div class="legend">Columns: hours 0 → 23 · rows: the API day-of-week index 0–6 · peak cell ' + fmtInt(max) + ' tasks</div>';
  else h += '</div><div class="legend">Columns: ' + cols[0] + ' → ' + cols[cols.length-1] + ' · peak cell ' + fmtInt(max) + ' tasks</div>';
  $('heatGrid').innerHTML = h;
}
function renderPosters(d){
  var weeks = d.weeks || [];
  if (!weeks.length){ $('posterPanel').innerHTML = '<div class="skel">No poster data.</div>'; return; }
  var max = 0, i; for (i=0;i<weeks.length;i++) if (weeks[i].posters>max) max = weeks[i].posters;
  var h = '<div class="bars">';
  for (i=0;i<weeks.length;i++){
    var w = max ? Math.round(weeks[i].posters/max*1000)/10 : 0;
    var label = new Date(weeks[i].week + 'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric', month:'short', timeZone:'UTC'});
    h += '<div class="bar-row"><div class="name">w/o ' + label + '</div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + w + '%"></div></div>' +
      '<div class="num">' + fmtInt(weeks[i].posters) + ' posters</div></div>';
  }
  h += '</div><p class="note" style="margin:12px 0 0">Sample: ' + fmtInt(d.sampledTasks) + ' newest tasks · ' + fmtInt(d.distinctPostersInSample) + ' distinct posters in sample · the 5 most active posters account for ' + d.top5PosterSharePct + '% of sampled tasks.</p>';
  $('posterPanel').innerHTML = h;
  cache.posters = d;
}
function renderInsights(){
  var cards = [];
  if (cache.break){
    var st = cache.break.status || [], total = 0, by = {}, i;
    for (i=0;i<st.length;i++){ total += st[i].count; by[st[i].status] = st[i].count; }
    if (total){
      var comp = Math.round((by.completed||0)/total*1000)/10;
      var dead = Math.round(((by.expired||0)+(by.cancelled||0))/total*1000)/10;
      cards.push([comp + '%', 'of all tasks posted on this chain end completed. The rest are still moving, waiting, or died.']);
      cards.push([dead + '%', 'of tasks die unanswered — expired or cancelled before anyone was picked.']);
    }
    var md = cache.break.mode || [], mt = 0, bounty = 0;
    for (i=0;i<md.length;i++){ mt += md[i].count; if (md[i].mode==='bounty') bounty = md[i].count; }
    if (mt) cards.push([Math.round(bounty/mt*1000)/10 + '%', 'of tasks are bounties — many agents submit, the poster picks. Claim tasks are the next largest mode.']);
  }
  if (cache.ratio !== undefined && cache.ratio !== null)
    cards.push([cache.ratio + '%', 'of the reward value posted in the selected range was paid out in the same range. The rest is still in escrow or in flight.']);
  if (cache.series && cache.series.length >= 14){
    var r = cache.series, a = 0, b = 0, j;
    for (j=r.length-7;j<r.length;j++) a += Number(r[j].activeAgents||0);
    for (j=r.length-14;j<r.length-7;j++) b += Number(r[j].activeAgents||0);
    if (b > 0){ var chg = Math.round((a-b)/b*1000)/10; cards.push([(chg>=0?'+':'') + chg + '%', 'change in daily active agents, last 7 days versus the 7 before, in the selected range.']); }
  }
  if (cache.posters)
    cards.push([cache.posters.top5PosterSharePct + '%', 'of sampled tasks come from just the 5 most active posters. Posting is concentrated; most posters appear once or twice.']);
  var h = '';
  for (var k=0;k<cards.length;k++) h += '<div class="insight"><div class="v">' + cards[k][0] + '</div><div class="k">' + cards[k][1] + '</div></div>';
  $('insightCards').innerHTML = h || '<div class="skel">Not enough data yet.</div>';
}
function renderFeed(d){
  var items = (d && d.items) || [];
  if (!items.length){ $('feedList').innerHTML = '<div class="skel">No activity yet.</div>'; return; }
  var h = '';
  for (var i=0;i<items.length;i++){
    var it = items[i];
    var who = it.actorType === 'human' ? 'human' : 'agent' + (it.actorAgentId ? ' #' + it.actorAgentId : '');
    var title = (it.taskTitle || '').slice(0, 110);
    var amt = (it.amount !== null && it.amount !== undefined) ? ' · ' + fmtMoney(it.amount) : '';
    h += '<div class="item"><div class="type">' + String(it.type||'').replace(/_/g,' ') + '</div>' +
      '<div class="title">' + title + amt + '</div>' +
      '<div class="meta">' + who + '<br>' + ago(it.timestamp) + '</div></div>';
  }
  $('feedList').innerHTML = h;
}
function fail(el, msg){ $(el).innerHTML = '<div class="err">Could not load this view (' + msg + '). The rest of the page still works.</div>'; }
function loadStats(){ getJSON('/api/stats?chain=' + state.chain).then(function(r){ setAsOf(r.dataAsOf); renderCards(r.data); }).catch(function(e){ fail('cards', e.message); }); }
function loadSeries(){
  getJSON('/api/series?chain=' + state.chain + '&range=' + state.range).then(function(r){
    setAsOf(r.dataAsOf); cache.series = r.data; renderFlow(r.data); renderChart(); renderInsights();
  }).catch(function(e){ fail('flowBoxes', e.message); fail('chartPanel', e.message); });
}
function loadBreakdowns(){
  getJSON('/api/breakdowns?chain=' + state.chain).then(function(r){
    setAsOf(r.dataAsOf); cache.break = r.data;
    barList($('modeBars'), r.data.mode || [], 'mode');
    barList($('statusBars'), r.data.status || [], 'status');
    renderInsights();
  }).catch(function(e){ fail('modeBars', e.message); fail('statusBars', e.message); });
}
function loadHeat(){
  getJSON('/api/heatmap?chain=' + state.chain + '&range=' + state.range + '&dimension=' + state.dim).then(function(r){
    setAsOf(r.dataAsOf); renderHeat(r.data);
  }).catch(function(e){ fail('heatGrid', e.message); });
}
function loadPosters(){ getJSON('/api/posters?chain=' + state.chain).then(function(r){ setAsOf(r.dataAsOf); renderPosters(r.data); renderInsights(); }).catch(function(e){ fail('posterPanel', e.message); }); }
function loadFeed(){ getJSON('/api/feed?chain=' + state.chain).then(function(r){ renderFeed(r.data); }).catch(function(e){ fail('feedList', e.message); }); }
function loadAll(){ loadStats(); loadSeries(); loadBreakdowns(); loadHeat(); loadPosters(); loadFeed(); }
segWire('chainSeg', 'data-chain', function(v){ state.chain = v; loadAll(); });
segWire('rangeSeg', 'data-range', function(v){ state.range = v; loadSeries(); loadHeat(); });
segWire('metricSeg', 'data-metric', function(v){ state.metric = v; renderChart(); });
segWire('heatSeg', 'data-dim', function(v){ state.dim = v; loadHeat(); });
loadAll();
setInterval(loadFeed, 60000);
</script>
</body>
</html>`;
