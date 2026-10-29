/* ===== Dompet Mahasiswa - app.js (front-end demo, data disimpan di localStorage) ===== */
(() => {
'use strict';
const KEY = 'dompet-mahasiswa-v1';
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const R = n => 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID');
const SIGNED = n => (n < 0 ? '−' : '') + R(n);

/* ---------- ikon ---------- */
const P = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10', wallet: 'M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l12-3v3M16 14h2',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', chart: 'M5 20V10M12 20V4M19 20v-7',
  plus: 'M12 5v14M5 12h14', swap: 'M4 8h16l-4-4M20 16H4l4 4', fork: 'M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M17 3c-2 2-2 6 0 8v10',
  coffee: 'M4 8h13v6a4 4 0 01-4 4H8a4 4 0 01-4-4V8zm13 1h2a2 2 0 010 5h-2M7 3v2M11 3v2',
  printer: 'M7 9V3h10v6M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 14h10v7H7z',
  bike: 'M6 18a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6zM6 15l4-7h5l3 7M10 8L9 5H7',
  pencil: 'M4 20l4-1 11-11-3-3L5 16l-1 4z', back: 'M15 5l-7 7 7 7', chev: 'M9 5l7 7-7 7', down: 'M5 9l7 7 7-7',
  tag: 'M3 12V4h8l10 10-8 8L3 12zm5-5h.01', out: 'M10 4H5v16h5M16 8l4 4-4 4M20 12H9',
  warn: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v5M12 16h.01', cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5', dl: 'M12 4v11M7 11l5 5 5-5M5 20h14', check: 'M5 12l5 5 9-10',
  bank: 'M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18', phone: 'M8 3h8v18H8zM11 18h2',
  cash: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z', inn: 'M7 7l10 10M17 9v8H9', edit: 'M12 20h9M16 4l4 4L8 20H4v-4z',
  file: 'M6 3h9l4 4v14H6zM14 3v5h5', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', hand: 'M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z'
};
const I = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n] || P.tag}"/></svg>`;
const CAT_ICON = { Kantin: 'fork', Nongkrong: 'coffee', 'Print Tugas': 'printer', Parkir: 'bike' };
const WT = { cash: ['Uang fisik', 'cash', 'Di dompetmu'], bank: ['Rekening bank', 'bank', 'Catatan manual'], ewallet: ['E-wallet', 'phone', 'Catatan manual'], piutang: ['Piutang', 'hand', 'Belum kembali'] };

/* ---------- data awal (sesuai mockup) ---------- */
const seed = () => ({
  name: 'Naya',
  W: [{ id: 'tunai', name: 'Tunai', type: 'cash', bal: 280000 }, { id: 'bca', name: 'BCA', type: 'bank', bal: 1100000 },
      { id: 'gopay', name: 'GoPay', type: 'ewallet', bal: 300000 }, { id: 'piutang', name: 'Piutang Teman', type: 'piutang', bal: 0 }],
  cats: { out: ['Kantin', 'Nongkrong', 'Print Tugas', 'Parkir'], in: ['Uang Jajan', 'Gaji', 'Lainnya'] },
  bud: { Kantin: 350000, Nongkrong: 250000, 'Print Tugas': 100000, Parkir: 50000 },
  tg: [{ id: 1, name: 'Laptop kuliah', cur: 300000, goal: 3000000 }, { id: 2, name: 'Dana darurat', cur: 200000, goal: 1000000 }, { id: 3, name: 'Buku semester depan', cur: 100000, goal: 400000 }],
  X: [
    { k: 'out', a: 25000, w: 'tunai', c: 'Kantin', n: 'Makan di kantin', d: 'Hari ini', t: '12.10', day: 9 },
    { k: 'out', a: 20000, w: 'gopay', c: 'Print Tugas', n: 'Print tugas kelompok', d: 'Hari ini', t: '09.15', day: 9 },
    { k: 'mv', a: 200000, w: 'bca', to: 'tunai', n: 'Tarik tunai ATM', d: '8 Okt', t: '16.30', day: 8 },
    { k: 'out', a: 45000, w: 'gopay', c: 'Nongkrong', n: 'Nongkrong habis kelas', d: '8 Okt', t: '15.20', day: 8 },
    { k: 'out', a: 45000, w: 'tunai', c: 'Kantin', n: 'Makan siang', d: '6 Okt', t: '12.30', day: 6, o: 1 },
    { k: 'out', a: 40000, w: 'tunai', c: 'Print Tugas', n: 'Print laporan', d: '6 Okt', t: '10.00', day: 6, o: 1 },
    { k: 'out', a: 30000, w: 'tunai', c: 'Parkir', n: 'Parkir mingguan', d: '7 Okt', t: '08.00', day: 7, o: 1 },
    { k: 'out', a: 105000, w: 'gopay', c: 'Nongkrong', n: 'Nongkrong akhir pekan', d: '5 Okt', t: '19.00', day: 5, o: 1 },
    { k: 'out', a: 50000, w: 'tunai', c: 'Kantin', n: 'Makan malam', d: '4 Okt', t: '18.40', day: 4, o: 1 },
    { k: 'out', a: 60000, w: 'tunai', c: 'Kantin', n: 'Traktir teman', d: '3 Okt', t: '13.00', day: 3, o: 1 },
    { k: 'in', a: 1500000, w: 'bca', c: 'Uang Jajan', n: 'Uang Jajan dari rumah', d: '1 Okt', t: '08.00', day: 1, e: 1 }
  ]
});
let S = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { return seed(); } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
const wal = id => S.W.find(w => w.id === id);
const total = () => S.W.reduce((a, w) => a + w.bal, 0);
const alloc = () => S.tg.reduce((a, t) => a + t.cur, 0);
const spent = () => S.X.filter(x => x.k === 'out').reduce((a, x) => a + x.a, 0);
const income = () => S.X.filter(x => x.k === 'in' && !x.s).reduce((a, x) => a + x.a, 0);
const budget = () => Object.values(S.bud).reduce((a, b) => a + b, 0);
const now = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0'); };
const digits = v => parseInt(String(v).replace(/\D/g, ''), 10) || 0;

/* ---------- util UI ---------- */
let tt;
const toast = (m, err) => { const t = $('#toast'); t.textContent = m; t.className = 'toast on' + (err ? ' e' : ''); clearTimeout(tt); tt = setTimeout(() => t.className = 'toast', 2400); return true; };
const grow = () => requestAnimationFrame(() => requestAnimationFrame(() => $$('[data-w]').forEach(e => e.style.width = e.dataset.w + '%')));
const growBars = () => requestAnimationFrame(() => requestAnimationFrame(() => $$('[data-h]').forEach(e => e.style.height = e.dataset.h + '%')));
const countUp = (el, to) => { if (!el) return; const t0 = performance.now(); const f = t => { const p = Math.min(1, (t - t0) / 700); el.textContent = R(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
const confetti = () => { const a = $('#app'); for (let i = 0; i < 28; i++) { const c = document.createElement('i'); c.className = 'cf'; c.style.cssText = `left:${Math.random() * 100}%;background:${['#D9622B', '#2A5C45', '#E9B995', '#1B4332'][i % 4]};animation-delay:${Math.random() * .5}s`; a.appendChild(c); setTimeout(() => c.remove(), 3000); } };
const sheet = (title, fields, okText, onOk) => {
  const h = fields.map(f => `<label for="f_${f.id}">${f.label}</label>` + (f.opts ? `<select id="f_${f.id}">${f.opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}</select>` : `<input id="f_${f.id}" type="text" ${f.num ? 'inputmode="numeric"' : ''} value="${f.val || ''}" placeholder="${f.ph || ''}">`)).join('');
  $('#layer').innerHTML = `<div class="bd"><div class="sheet" role="dialog" aria-label="${title}"><h2>${title}</h2>${h}<div class="row"><button class="btn" data-x="close">Batal</button><button class="btn p" data-x="ok">${okText}</button></div></div></div>`;
  $$('#layer input[inputmode]').forEach(i => i.addEventListener('input', () => { const n = digits(i.value); i.value = n ? n.toLocaleString('id-ID') : ''; }));
  const close = () => $('#layer').innerHTML = '';
  $('#layer .bd').onclick = e => { if (e.target.classList.contains('bd') || e.target.dataset.x === 'close') close(); if (e.target.dataset.x === 'ok') { const v = {}; fields.forEach(f => v[f.id] = $('#f_' + f.id).value); if (onOk(v) !== false) close(); } };
  setTimeout(() => $('#layer input,#layer select')?.focus(), 60);
};

/* ---------- komponen ---------- */
const head = (eb, title, avatar = true, back) => `${back ? `<button class="bk" data-back aria-label="Kembali">${I('back')}</button>` : ''}<div class="hd"><div><div class="eb">${eb}</div><h1>${title}</h1></div>${avatar ? `<button class="av" data-go="profil" aria-label="Profil">${S.name.slice(0, 2).toUpperCase()}</button>` : ''}</div>`;
const sub = x => {
  const w = wal(x.w), t = x.d === 'Hari ini' ? 'Hari ini, ' + x.t : x.d + ', ' + x.t;
  return x.k === 'mv' ? `${w.name} → ${wal(x.to).name} · ${t}` : x.k === 'sv' ? `Ke target · ${t}` : `${w.name} · ${t}`;
};
const txRow = (x, i = 0) => {
  const g = x.k !== 'out', ic = x.k === 'mv' ? 'swap' : x.k === 'sv' ? 'tag' : x.k === 'in' ? 'inn' : CAT_ICON[x.c] || 'tag';
  const lab = { out: 'Pengeluaran', in: 'Pemasukan', mv: 'Pindah dompet', sv: 'Tabungan' }[x.k];
  const amt = x.k === 'out' ? '−' + R(x.a) : x.k === 'in' ? '+' + R(x.a) : R(x.a);
  return `<div class="tx" style="animation-delay:${i * 50}ms"><div class="ti ${g ? 'g' : ''}">${I(ic)}</div><div class="m"><b>${x.n}</b><span class="sm">${sub(x)}</span></div><div class="a ${x.k === 'in' ? 'i' : x.k}">${amt}<small>${lab}</small></div></div>`;
};
const pct = (a, b) => Math.min(100, Math.round(a / b * 1000) / 10);

/* ---------- layar ---------- */
const V = {};
V.beranda = () => {
  const tun = S.W.filter(w => w.type === 'cash').reduce((a, w) => a + w.bal, 0), dig = S.W.filter(w => w.type === 'bank' || w.type === 'ewallet').reduce((a, w) => a + w.bal, 0);
  const sp = spent(), bu = budget(), rec = S.X.filter(x => !x.o).slice(0, 3);
  return { html: `${head('Dompet Mahasiswa', 'Halo, ' + S.name + '.')}
    ${sp / bu >= .5 ? `<div class="al">${I('warn', 22)}<span>Awas! Pengeluaranmu sudah mencapai 80% batas minggu ini.</span></div>` : ''}
    <section class="hero"><div class="sm" style="color:#fff;opacity:.8;display:flex;justify-content:space-between"><span>Uang kamu sekarang</span><span>9 OKT 2026</span></div>
      <div class="big" id="tot">${R(total())}</div>
      <div class="sp"><div><span>${I('cash', 16)} Tunai</span><b>${R(tun)}</b><span>Di saku &amp; dompet</span></div><div><span>${I('phone', 16)} Digital</span><b>${R(dig)}</b><span>Bank + e-wallet</span></div></div></section>
    <div class="acts"><button class="btn p" data-go="catat">${I('plus', 22)} Catat transaksi</button><button class="btn" data-go="pindah">${I('swap', 22)} Pindah dompet</button></div>
    <button class="jt" data-go="ringkasan"><div class="row"><b>Jatah bulan ini</b><b>Sisa ${R(bu - sp)} ↗</b></div><div class="pb"><i data-w="${pct(sp, bu)}"></i></div><span class="sm">${R(sp)} dari ${R(bu)} terpakai · 1–9 Okt</span></button>
    <div class="lh"><h2>Jejak uangmu</h2><a data-go="riwayat">Semua →</a></div>${rec.map(txRow).join('')}
    <div class="hint">${I('pencil', 14)} Dicatat sendiri. Sedikit-sedikit, jadi kebaca.</div>`, after() { countUp($('#tot'), total()); grow(); } };
};
V.dompet = () => {
  const ws = S.W.filter(w => w.type !== 'piutang' || w.bal > 0);
  return { html: `${head('Oktober 2026', 'Uangmu di mana?')}
    <div class="sum"><div><b>${ws.length} dompet, satu total</b><div class="sm">Saldo per 9 Oktober</div></div><div class="t">${R(total())}</div></div>
    ${ws.map((w, i) => `<button class="wc card ${w.type === 'cash' ? 'f' : ''}" data-wal="${w.id}" style="animation:in .4s ${i * 70}ms both"><div class="row"><div class="row"><div class="wi">${I(WT[w.type][1], 22)}</div><div><div class="sm">${WT[w.type][0]}</div><div class="n">${w.name}</div></div></div>${I('chev', 18)}</div><div class="v">${R(w.bal)}</div><div class="sm" style="text-align:right">${WT[w.type][2]}</div></button>`).join('')}
    <button class="add" data-act="addw">${I('plus', 18)} Tambah dompet</button>
    <button class="btn p w" data-go="pindah">Pindah antar dompet ${I('swap', 20)}</button>
    <div class="note g" style="border-radius:4px 12px 12px 4px">${I('pencil', 14)} <b style="display:inline">Saldo ini dari catatanmu</b><br>Tidak terhubung otomatis ke bank atau QRIS. Cek saldo asli, lalu sesuaikan catatan kalau perlu.</div>` };
};
V.riwayat = () => {
  const f = V.riwayat.f || 'all', open = V.riwayat.open;
  const ok = x => f === 'all' || (f === 'in' && x.k === 'in') || (f === 'out' && x.k === 'out') || (f === 'mv' && (x.k === 'mv' || x.k === 'sv'));
  const head_ = S.X.filter(x => !x.o && !x.e && ok(x)), old = S.X.filter(x => x.o && ok(x)), tail = S.X.filter(x => x.e && ok(x));
  const list = [...head_, ...(open ? old : []), ...tail];
  return { html: `${head('Oktober 2026', 'Jejak uangmu')}
    <div class="row" style="margin-bottom:4px"><b style="display:flex;gap:8px;align-items:center">${I('cal', 18)} 1–9 Oktober 2026 ${I('down', 14)}</b><button data-act="search" aria-label="Cari">${I('search', 20)}</button></div>
    <div class="sc"><div>${'<span class="sm">↙ Pemasukan</span>'}<b>${R(income())}</b></div><div class="o"><span class="sm">↗ Pengeluaran</span><b>${R(spent())}</b></div></div>
    <div class="sm">Pindah dompet tidak dihitung sebagai belanja.</div>
    <div class="fl">${[['all', 'Semua'], ['in', 'Masuk'], ['out', 'Keluar'], ['mv', 'Pindah']].map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-f="${k}">${l}</button>`).join('')}</div>
    <div class="sm" style="text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Catatan · terbaru dulu</div>
    ${head_.concat(open ? old : []).map(txRow).join('')}
    ${old.length ? `<button class="more" data-act="more"><span>2–7 Okt · ${open ? 'tutup' : 'buka'} ${old.length} catatan lainnya</span>${I('down', 16)}</button>` : ''}
    ${tail.map(txRow).join('')}${list.length ? '' : '<div class="hint">Belum ada catatan untuk filter ini. Coba catat transaksi pertamamu.</div>'}
    <div class="hint">${I('check', 14)} ${S.X.length} catatan tersimpan</div>` };
};
V.ringkasan = () => {
  const tab = V.ringkasan.tab || 'ang';
  const seg = `<div class="seg"><button class="${tab === 'ang' ? 'on' : ''}" data-tab="ang">Anggaran Bulan Ini</button><button class="${tab === 'tg' ? 'on' : ''}" data-tab="tg">Target Tabungan</button></div>`;
  if (tab === 'tg') {
    const al = alloc();
    return { html: `${head('Oktober 2026', 'Jajan, tetap terarah.')}${seg}
      <div class="panel"><div class="row sm" style="font-weight:600;color:var(--g9)"><span>TOTAL DIALOKASIKAN</span><span>9 OKT 2026</span></div><div class="big" id="tot">${R(al)}</div>
        <div class="row" style="border-top:1px solid #C6D9C6;padding-top:10px;margin-top:12px"><span class="sm">Dari saldo yang ada</span><b>${R(total())}</b></div><div class="row" style="margin-top:6px"><span class="sm">Sisa belum dialokasikan</span><b>${R(total() - al)}</b></div></div>
      <div class="lh"><h2>Sedikit-sedikit, terkumpul.</h2><span class="sm">${S.tg.length} target</span></div>
      ${S.tg.map((t, i) => `<div class="tg card" style="animation:in .4s ${i * 70}ms both"><div class="row"><b style="font-size:16px">${t.name}</b><span class="p">${Math.round(t.cur / t.goal * 100)}%</span></div><div class="pb"><i data-w="${pct(t.cur, t.goal)}"></i></div><div class="row"><div><b>${R(t.cur)}</b> <span class="sm">/ ${R(t.goal)}</span><div class="sm" style="font-size:11px">Terkumpul / target</div></div>${t.cur >= t.goal ? '<b style="color:var(--g7)">Tercapai ✓</b>' : `<button class="set" data-setor="${t.id}">Setor +</button>`}</div></div>`).join('')}
      <button class="btn p w" data-act="addt" style="margin-top:6px">Tambah target tabungan ${I('plus', 20)}</button>
      <div class="note"><b>Disisihkan, bukan uang tambahan.</b>${R(al)} tetap bagian dari saldo ${R(total())}, tidak dihitung dua kali. Nabung bukan belanja konsumsi dan tidak menambah pengeluaran.</div>`, after: grow };
  }
  const sp = spent(), bu = budget(), per = [[1, 4, '1–4 Okt'], [5, 9, '5–9 Okt'], [10, 16, '10–16 Okt'], [17, 31, '17–31 Okt']];
  const data = per.map(([a, b]) => ({ i: S.X.filter(x => x.k === 'in' && !x.s && x.day >= a && x.day <= b).reduce((s, x) => s + x.a, 0), o: S.X.filter(x => x.k === 'out' && x.day >= a && x.day <= b).reduce((s, x) => s + x.a, 0) }));
  const mx = Math.max(1, ...data.flatMap(d => [d.i, d.o]));
  const cats = Object.keys(S.bud).map(c => ({ c, u: S.X.filter(x => x.k === 'out' && x.c === c).reduce((a, x) => a + x.a, 0), b: S.bud[c] }));
  const perDay = Math.max(0, Math.round((bu - sp) / 22 / 1000) * 1000);
  return { html: `${head('Oktober 2026', 'Jajan, tetap terarah.')}${seg}
    <div class="panel"><div class="row"><span class="sm" style="font-weight:600;color:var(--g9)">SISA ANGGARAN OKTOBER</span><a class="sm" style="font-weight:700;color:var(--g9);cursor:pointer" data-act="atur">Atur ↗</a></div>
      <div class="row"><div class="big" id="tot">${R(bu - sp)}</div><div style="text-align:right"><b style="font-size:24px;color:var(--or)">${Math.round(sp / bu * 100)}%</b><div class="sm">terpakai</div></div></div>
      <div class="pb"><i data-w="${pct(sp, bu)}"></i></div><span class="sm">${R(sp)} dari ${R(bu)} · tercatat 1–9 Okt</span></div>
    <div class="row" style="margin-bottom:10px"><h2>Arus Kas Oktober</h2><button class="dl" data-act="dl">${I('dl', 16)} Unduh Laporan</button></div>
    <div><span class="pill">${I('file', 13)} PDF</span><span class="pill g">${I('grid', 13)} Excel</span></div>
    <div class="per">${['Hari', 'Minggu', 'Bulan'].map(p => `<button class="${p === 'Bulan' ? 'on' : ''}" data-act="per">${p}</button>`).join('')}</div>
    <div class="card" style="padding:14px"><div class="lg"><span><i style="background:var(--g7)"></i>Pemasukan</span><span><i style="background:var(--rd)"></i>Pengeluaran</span></div>
      <div class="chart">${data.map(d => `<div class="c"><i style="background:var(--g7)" data-h="${d.i / mx * 100}"></i><i style="background:var(--rd)" data-h="${d.o / mx * 100}"></i></div>`).join('')}</div>
      <div class="row sm" style="justify-content:space-around;margin-top:6px">${per.map(p => `<span>${p[2]}</span>`).join('')}</div><div class="sm" style="font-size:11px;margin-top:8px">Data tercatat hingga 9 Okt 2026 · periode setelah itu belum ada data</div></div>
    <div class="row" style="margin:22px 0 2px"><h2>Belanja per kategori</h2><b>${R(sp)}</b></div><div class="sm">Terpakai / anggaran bulan ini</div>
    ${cats.map(c => `<div class="cat"><div class="row"><b>${I(CAT_ICON[c.c], 22)} ${c.c}</b><b>${R(c.u)} / ${R(c.b).replace('Rp', '')}</b></div><div class="pb"><i data-w="${pct(c.u, c.b)}"></i></div><div class="sm" style="text-align:right">Sisa ${R(c.b - c.u)}</div></div>`).join('')}
    <div class="note"><b>Biar aman sampai akhir bulan</b>Sisa ${R(bu - sp)} ≈ ${R(perDay)}/hari untuk 10–31 Okt. Bisa jadi patokan sebelum jajan lagi.</div>
    <div class="hint">${I('check', 14)} Hanya pengeluaran yang masuk anggaran. Uang Jajan dan Pindah Dompet tidak dihitung.</div>`, after() { countUp($('#tot'), bu - sp); grow(); growBars(); } };
};
V.profil = () => ({ sub: 1, html: `${head('Dompet Mahasiswa', 'Profil &amp; Pengaturan', false, 1)}
  <div class="pf"><div class="av">${S.name.slice(0, 2).toUpperCase()}</div><div><h2>${S.name}</h2><div class="sm">Catatan keuangan pribadimu.</div></div></div>
  <h2 style="margin-bottom:10px;font-size:17px">Atur catatanmu</h2>
  <div class="card"><button class="ml" data-act="name"><div class="wi">${I('pencil')}</div><div style="flex:1"><b>Edit Profil/Nama</b><span class="sm">Ubah nama yang ditampilkan</span></div>${I('chev', 16)}</button>
  <button class="ml" data-act="cat"><div class="wi">${I('tag')}</div><div style="flex:1"><b>Kelola Master Data</b><span class="sm">Tambah kategori kustom (${S.cats.out.length + S.cats.in.length} kategori)</span></div>${I('chev', 16)}</button></div>
  <button class="lo" data-act="logout">Logout ${I('out', 20)}</button><div class="sm" style="margin-top:8px">Keluar dari akun ${S.name}.</div>` });

/* ---------- Catat transaksi ---------- */
const C = { tab: 'out', amt: '', w: 'tunai', cat: 'Kantin', tg: 1, note: '' };
const Cfg = { out: ['Berapa yang keluar?', 'Bayar pakai', 'Masuk kategori apa?', 'Simpan pengeluaran'], in: ['Berapa yang masuk?', 'Masuk ke', 'Dari mana?', 'Simpan pemasukan'], sv: ['Berapa yang ditabung?', 'Dari saldo', 'Ke target mana?', 'Simpan tabungan'] };
V.catat = () => {
  const [q, lbl, cq, btn] = Cfg[C.tab], list = C.tab === 'sv' ? S.tg.filter(t => t.cur < t.goal) : S.cats[C.tab];
  const chips = list.map(x => { const n = x.name || x, on = C.tab === 'sv' ? x.id === C.tg : n === C.cat; return `<button class="chip ${on ? 'on' : ''}" data-chip="${C.tab === 'sv' ? x.id : n}">${I(C.tab === 'sv' ? 'tag' : CAT_ICON[n] || 'tag', 18)} ${n}${on ? `<span class="ck">${I('check', 16)}</span>` : ''}</button>`; }).join('');
  const opts = S.W.filter(w => w.type !== 'piutang').map(w => `<option value="${w.id}" ${w.id === C.w ? 'selected' : ''}>${w.name} · saldo ${R(w.bal)}</option>`).join('');
  return { sub: 1, html: `<button class="bk" data-back aria-label="Kembali">${I('back')}</button><div class="hd"><div><div class="eb">Catatan baru · 9 Okt 2026</div><h1>Catat transaksi</h1></div></div>
    <div class="seg">${[['out', 'Pengeluaran'], ['in', 'Pemasukan'], ['sv', 'Nabung']].map(([k, l]) => `<button class="${C.tab === k ? 'on' : ''}" data-ctab="${k}">${l}</button>`).join('')}</div>
    <div class="sm">${q}</div><div class="amt" id="amt"></div><div class="err" id="err"></div>
    <label class="sel card"><span>${I(WT[wal(C.w).type][1], 22)}</span><span><small>${lbl}</small><b id="wl"></b></span><span class="c">${I('down', 18)}</span><select id="wsel" aria-label="${lbl}">${opts}</select></label>
    <div class="q">${cq}</div><div class="chips">${chips || '<div class="sm">Belum ada target aktif.</div>'}</div>
    <div class="two"><div class="fld">${I('cal', 18)} 9 Okt 2026</div><label class="fld">${I('pencil', 16)}<input id="note" placeholder="Catatan (opsional)" value="${C.note}" maxlength="80"></label></div>
    <div class="kp">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'].map(k => `<button data-k="${k}" aria-label="${k === '⌫' ? 'Hapus' : k}">${k === '⌫' ? I('back', 22) : k}</button>`).join('')}</div>
    <button class="btn p w" id="save"><span>${btn}</span>${I('check', 20)}</button><div class="ft" id="ft"></div>`, after() { C.upd(); } };
};
C.upd = () => {
  const n = digits(C.amt), w = wal(C.w), free = total() - alloc();
  const lim = C.tab === 'out' ? w.bal : C.tab === 'sv' ? free : Infinity;
  const bad = n > lim;
  $('#amt').innerHTML = 'Rp' + n.toLocaleString('id-ID') + '<i></i>';
  $('#wl').textContent = w.name + ' · saldo ' + R(w.bal);
  $('#err').textContent = bad ? (C.tab === 'sv' ? 'Melebihi saldo yang belum dialokasikan (' + R(free) + ')' : 'Saldo dompet tidak mencukupi') : '';
  const b = $('#save'); b.disabled = !n || bad;
  $('#ft').textContent = bad ? `Draf belum disimpan · saldo ${w.name} tetap ${R(w.bal)}` : n ? `Draf belum disimpan · saldo ${w.name} nanti ${R(C.tab === 'in' ? w.bal + n : C.tab === 'out' ? w.bal - n : w.bal)}` : 'Masukkan nominal dengan papan angka.';
};
C.save = () => {
  const n = digits(C.amt), now_ = { d: 'Hari ini', t: now(), day: 9 }, note = ($('#note').value || '').trim();
  if (C.tab === 'sv') { const t = S.tg.find(t => t.id === C.tg); if (!t) return toast('Pilih target dulu', 1); const add = Math.min(n, t.goal - t.cur); t.cur += add; S.X.unshift({ k: 'sv', a: add, w: C.w, n: note || 'Nabung ' + t.name, ...now_ }); if (t.cur >= t.goal) { confetti(); toast('Target "' + t.name + '" tercapai! 🎉'); } else toast('Tabungan masuk ke ' + t.name); }
  else { const w = wal(C.w); w.bal += C.tab === 'in' ? n : -n; S.X.unshift({ k: C.tab, a: n, w: C.w, c: C.cat, n: note || C.cat, ...now_ }); toast(C.tab === 'in' ? 'Pemasukan dicatat' : 'Pengeluaran dicatat'); }
  save(); C.amt = ''; C.note = ''; history.length > 1 ? history.back() : go('beranda');
};

/* ---------- Pindah dompet ---------- */
const M = { mode: 'biasa', from: 'bca', to: 'tunai', amt: '100000', note: '' };
V.pindah = () => {
  const kas = M.mode === 'kasbon', ws = S.W.filter(w => w.type !== 'piutang');
  const o = (sel, list) => list.map(w => `<option value="${w.id}" ${w.id === sel ? 'selected' : ''}>${w.name} · ${R(w.bal)}</option>`).join('');
  return { sub: 1, html: `<button class="bk" data-back aria-label="Kembali">${I('back')}</button><div class="hd"><div><div class="eb">Antar sumber · 9 Okt 2026</div><h1>Pindah dompet</h1></div></div>
    <div class="note g" style="margin:0 0 16px"><b>Uang pindah, bukan habis.</b>Bukan pemasukan atau pengeluaran. Tarik tunai ATM dan top-up dari tunai juga masuk di sini.${kas ? '<br><br>Piutang Teman bukan pengeluaran, tapi uangnya tidak bisa dipakai sampai dikembalikan. Pengembalian adalah pemindahan kembali, bukan pemasukan.' : ''}</div>
    <div class="card pm"><div class="sm" style="margin-bottom:8px">Pilih jenis perpindahan</div><div class="seg" style="margin:0"><button class="${!kas ? 'on' : ''}" data-mode="biasa">Pindah biasa</button><button class="${kas ? 'on' : ''}" data-mode="kasbon">Kasbon Teman</button></div></div>
    <label class="sel card"><span>${I('cash', 22)}</span><span><small>Dari dompet</small><b id="fl"></b></span><span class="c">${I('down', 18)}</span><select id="from">${o(M.from, ws)}</select></label>
    <div class="sw">${I('swap', 20)}</div>
    ${kas ? `<div class="sel card"><span>${I('hand', 22)}</span><span><small>Ke dompet</small><b>Piutang Teman</b><small>Saldo ${R(wal('piutang').bal)} · untuk talangan</small></span></div>` : `<label class="sel card"><span>${I('wallet', 22)}</span><span><small>Ke dompet</small><b id="tl"></b></span><span class="c">${I('down', 18)}</span><select id="to">${o(M.to, ws)}</select></label>`}
    <div class="sm" style="margin-top:14px">Mau pindah berapa?</div><div style="display:flex;align-items:center"><span class="big-in" style="width:auto">Rp</span><input class="big-in" id="pa" inputmode="numeric" aria-label="Nominal" value=""></div>
    <label class="fld" style="margin-top:4px">${I('pencil', 16)}<input id="pn" placeholder="${kas ? 'Talangan untuk siapa & untuk apa' : 'Catatan (opsional)'}" value="${M.note}" maxlength="80"></label>
    <div class="after"><div class="sm" style="font-weight:700;color:var(--g9)">Setelah dipindahkan</div><div id="pv"></div></div><div class="err" id="perr"></div>
    <button class="btn p w" id="psave"><span id="plab"></span>${I('chev', 20)}</button><div class="ft">Draf · saldo belum berubah sebelum kamu simpan.</div>`, after() { M.upd(); $('#pa').value = digits(M.amt) ? digits(M.amt).toLocaleString('id-ID') : ''; } };
};
M.upd = () => {
  const kas = M.mode === 'kasbon', n = digits(M.amt), f = wal(M.from), t = wal(kas ? 'piutang' : M.to);
  $('#fl').textContent = f.name + ' · ' + R(f.bal); if (!kas) $('#tl').textContent = t.name + ' · ' + R(t.bal);
  const same = f.id === t.id, bad = n > f.bal;
  $('#pv').innerHTML = `<div class="row"><span>${f.name}</span><span><span class="sm">${R(f.bal)} →</span> <b>${R(f.bal - n)}</b></span></div><div class="row"><span>${t.name}</span><span><span class="sm">${R(t.bal)} →</span> <b>${R(t.bal + n)}</b></span></div><div class="row tot"><span>Total asetmu<br><span class="sm">${I('check', 12)} Tetap sama</span></span><b>${R(total())}</b></div>`;
  $('#perr').textContent = same ? 'Pilih dua dompet yang berbeda' : bad ? 'Saldo dompet asal tidak mencukupi' : '';
  $('#plab').textContent = kas ? `Simpan kasbon ${R(n)}` : `Pindahkan ${R(n)}`; $('#psave').disabled = !n || same || bad;
};
M.save = () => {
  const kas = M.mode === 'kasbon', n = digits(M.amt), to = kas ? 'piutang' : M.to, note = ($('#pn').value || '').trim();
  wal(M.from).bal -= n; wal(to).bal += n;
  S.X.unshift({ k: 'mv', a: n, w: M.from, to, n: note || (kas ? 'Kasbon teman' : 'Pindah dompet'), d: 'Hari ini', t: now(), day: 9 });
  save(); toast(kas ? 'Kasbon dicatat' : 'Dana dipindahkan'); history.length > 1 ? history.back() : go('beranda');
};

/* ---------- router ---------- */
const NAV = [['beranda', 'Beranda', 'home'], ['dompet', 'Dompet', 'wallet'], ['riwayat', 'Riwayat', 'list'], ['ringkasan', 'Ringkasan', 'chart']];
const go = r => { location.hash = '#/' + r; };
let cur = '';
function render() {
  let r = location.hash.replace('#/', '') || 'beranda'; if (!V[r]) r = 'beranda';
  const v = V[r](), view = $('#view'), first = cur !== r; cur = r;
  view.innerHTML = `<div class="${first ? 'in' : ''} ${v.sub ? 'sub' : ''}" id="pg">${v.html}</div>`;
  if (first) view.scrollTop = 0;
  const nav = $('#nav'); nav.className = 'nav' + (r === 'catat' || r === 'pindah' ? ' off' : '');
  nav.innerHTML = NAV.map(([k, l, i]) => `<button class="${k === r || (r === 'profil' && k === 'ringkasan') ? 'on' : ''}" data-go="${k}" aria-label="${l}">${I(i, 22)}<span>${l}</span></button>`).join('');
  (v.after || grow)();
}
window.addEventListener('hashchange', () => { $('#layer').innerHTML = ''; render(); });
const redo = () => { const y = $('#view').scrollTop; render(); $('#view').scrollTop = y; };

/* ---------- event ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-back],[data-act],[data-k],[data-chip],[data-ctab],[data-mode],[data-f],[data-tab],[data-setor],[data-wal],#save,#psave'); if (!t) return;
  const d = t.dataset;
  if (d.go) return go(d.go);
  if (d.back !== undefined) return history.length > 1 ? history.back() : go('beranda');
  if (d.k) { C.amt = d.k === '⌫' ? C.amt.slice(0, -1) : (C.amt + d.k).replace(/^0+/, '').slice(0, 10); return C.upd(); }
  if (d.chip) { if (C.tab === 'sv') C.tg = +d.chip; else C.cat = d.chip; C.note = $('#note').value; return redo(); }
  if (d.ctab) { C.tab = d.ctab; C.cat = S.cats[d.ctab === 'sv' ? 'out' : d.ctab][0]; C.tg = (S.tg.find(x => x.cur < x.goal) || {}).id; return redo(); }
  if (d.mode) { M.mode = d.mode; return redo(); }
  if (d.f) { V.riwayat.f = d.f; return redo(); }
  if (d.tab) { V.ringkasan.tab = d.tab; return redo(); }
  if (d.wal) return toast(wal(d.wal).name + ': ' + R(wal(d.wal).bal));
  if (d.setor) return setor(+d.setor);
  if (t.id === 'save') { if (!t.disabled) C.save(); else { $('#amt').classList.add('shake'); setTimeout(() => $('#amt').classList.remove('shake'), 400); } return; }
  if (t.id === 'psave') return t.disabled ? 0 : M.save();
  ({
    more() { V.riwayat.open = !V.riwayat.open; redo(); },
    search() { toast('Pencarian akan hadir di versi berikutnya'); },
    dl() { toast('Laporan akan diunduh setelah terhubung ke backend'); },
    per() { toast('Tampilan harian/mingguan menyusul'); },
    atur() { sheet('Atur anggaran', Object.keys(S.bud).map(c => ({ id: c, label: c, num: 1, val: S.bud[c].toLocaleString('id-ID') })), 'Simpan', v => { Object.keys(v).forEach(c => S.bud[c] = digits(v[c]) || S.bud[c]); save(); redo(); toast('Anggaran diperbarui'); }); },
    addw() { sheet('Tambah dompet', [{ id: 'n', label: 'Nama dompet', ph: 'mis. DANA' }, { id: 't', label: 'Jenis', opts: [['cash', 'Uang fisik'], ['bank', 'Rekening bank'], ['ewallet', 'E-wallet']] }, { id: 'b', label: 'Saldo awal (opsional)', num: 1, ph: '0' }], 'Tambah', v => {
      const n = v.n.trim(); if (!n) return toast('Nama dompet wajib diisi', 1) && false; if (S.W.some(w => w.name.toLowerCase() === n.toLowerCase())) return toast('Nama dompet sudah dipakai', 1) && false;
      const b = digits(v.b), id = n.toLowerCase().replace(/\W/g, '') + Date.now() % 1000; S.W.splice(S.W.length - 1, 0, { id, name: n, type: v.t, bal: b });
      if (b) S.X.unshift({ k: 'in', a: b, w: id, c: 'Lainnya', n: 'Saldo awal ' + n, d: 'Hari ini', t: now(), day: 9, s: 1 }); save(); redo(); toast('Dompet ditambahkan'); }); },
    addt() { sheet('Tambah target tabungan', [{ id: 'n', label: 'Nama target', ph: 'mis. Liburan' }, { id: 'g', label: 'Nominal target', num: 1, ph: '1.000.000' }], 'Buat target', v => {
      const g = digits(v.g); if (!v.n.trim() || !g) return toast('Isi nama dan nominal target', 1) && false; S.tg.push({ id: Date.now(), name: v.n.trim(), cur: 0, goal: g }); save(); redo(); toast('Target dibuat'); }); },
    name() { sheet('Edit nama', [{ id: 'n', label: 'Nama yang ditampilkan', val: S.name }], 'Simpan', v => { if (!v.n.trim()) return false; S.name = v.n.trim().slice(0, 20); save(); redo(); toast('Nama diperbarui'); }); },
    cat() { sheet('Tambah kategori', [{ id: 'n', label: 'Nama kategori', ph: 'mis. Kos' }, { id: 't', label: 'Jenis', opts: [['out', 'Pengeluaran'], ['in', 'Pemasukan']] }], 'Tambah', v => {
      const n = v.n.trim(); if (!n) return false; if (S.cats[v.t].includes(n)) return toast('Kategori sudah ada', 1) && false; S.cats[v.t].push(n); save(); redo(); toast('Kategori ditambahkan'); }); },
    logout() { sheet('Keluar dari akun?', [], 'Logout', () => { toast('Kamu sudah keluar (demo). Data tetap tersimpan di perangkat.'); go('beranda'); }); }
  })[d.act]?.();
});
function setor(id) {
  const t = S.tg.find(x => x.id === id), free = total() - alloc();
  sheet('Setor ke ' + t.name, [{ id: 'a', label: `Nominal setoran (bisa disisihkan ${R(free)}, sisa target ${R(t.goal - t.cur)})`, num: 1, ph: '50.000' }], 'Setor', v => {
    const a = digits(v.a); if (!a) return toast('Isi nominal setoran', 1) && false;
    if (a > free) return toast('Melebihi saldo yang belum dialokasikan', 1) && false; if (a > t.goal - t.cur) return toast('Melebihi sisa target (' + R(t.goal - t.cur) + ')', 1) && false;
    t.cur += a; S.X.unshift({ k: 'sv', a, w: 'tunai', n: 'Nabung ' + t.name, d: 'Hari ini', t: now(), day: 9 }); save(); redo();
    if (t.cur >= t.goal) { confetti(); toast('Target "' + t.name + '" tercapai! 🎉'); } else toast('Berhasil menyetor ' + R(a));
  });
}
document.addEventListener('input', e => {
  if (e.target.id === 'pa') { M.amt = e.target.value; const n = digits(M.amt); e.target.value = n ? n.toLocaleString('id-ID') : ''; M.upd(); }
  if (e.target.id === 'note') C.note = e.target.value;
});
document.addEventListener('change', e => {
  if (e.target.id === 'wsel') { C.w = e.target.value; C.upd(); }
  if (e.target.id === 'from') { M.from = e.target.value; M.upd(); }
  if (e.target.id === 'to') { M.to = e.target.value; M.upd(); }
});
render();
})();
