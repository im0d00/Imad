/**
 * BLOG.JS — Aimad Ul Islam | aimadulislam.dpdns.org
 * Handles: search, dark mode, pagination, reading progress,
 *          mobile menu, copy code, scroll-to-top, TOC, smooth scroll
 * No dependencies. Pure vanilla JavaScript.
 */

'use strict';

/* ── BLOG POST DATA ─────────────────────────────────────────────────────────
   Each post entry maps to a file in /posts/.
   To add a new post: copy a template, write content, add ONE entry here.
   ─────────────────────────────────────────────────────────────────────── */
const BLOG_POSTS = [
  {
    id: 1,
    title: "Getting Started with Kali Linux: Complete Beginner Setup Guide",
    subtitle: "Set up your ethical hacking lab from scratch — VirtualBox, Kali, Metasploitable, and DVWA in one guide.",
    excerpt: "Kali Linux is the industry-standard penetration testing distribution. In this guide I walk through the complete lab setup process — from installing VirtualBox to configuring your first vulnerable target.",
    slug: "kali-linux-setup-guide",
    file: "posts/kali-linux-setup-guide.html",
    category: ["Linux", "Cybersecurity", "Tutorials"],
    tags: ["kali-linux", "virtualbox", "ethical-hacking", "lab-setup", "beginners"],
    author: "Aimad Ul Islam",
    date: "2026-07-15",
    updated: "2026-07-20",
    readingTime: 12,
    featured: true,
    image: "",
    imageAlt: "Kali Linux terminal with hacking tools",
    emoji: "🐉",
  },
  {
    id: 2,
    title: "Nmap Deep Dive: From Port Scanning to Full Network Enumeration",
    subtitle: "Master the most important tool in penetration testing — every flag, output format, and NSE script you need.",
    excerpt: "Nmap is the first tool every penetration tester opens. This guide goes from basic port scanning to aggressive full enumeration, NSE scripting, and XML output parsing for professional engagements.",
    slug: "nmap-complete-guide",
    file: "posts/nmap-complete-guide.html",
    category: ["Cybersecurity", "Networking", "Tutorials"],
    tags: ["nmap", "port-scanning", "enumeration", "penetration-testing", "networking"],
    author: "Aimad Ul Islam",
    date: "2026-07-10",
    updated: "2026-07-10",
    readingTime: 15,
    featured: false,
    image: "",
    imageAlt: "Nmap network scan output",
    emoji: "🗺️",
  },
  {
    id: 3,
    title: "Digital Forensics & Incident Response: A Hands-On Introduction",
    subtitle: "Windows forensics, memory analysis, Splunk, and Velociraptor — what I learned from BlueCapeSecurity DFIR certification.",
    excerpt: "After completing the BlueCapeSecurity DFIR Foundations & Techniques course, I documented everything I learned about Windows forensics, disk and memory analysis, artifact correlation, and professional DFIR reporting.",
    slug: "dfir-introduction",
    file: "posts/dfir-introduction.html",
    category: ["Cybersecurity", "Tutorials"],
    tags: ["dfir", "forensics", "splunk", "velociraptor", "incident-response", "blue-team"],
    author: "Aimad Ul Islam",
    date: "2026-07-05",
    updated: "2026-07-05",
    readingTime: 18,
    featured: false,
    image: "",
    imageAlt: "Digital forensics investigation",
    emoji: "🔬",
  },
  {
    id: 4,
    title: "Linux Essentials: Every Command You Actually Need",
    subtitle: "From file permissions to bash scripting — the complete Linux reference for cybersecurity professionals.",
    excerpt: "This is the Linux reference guide I built during my Cisco Linux Essentials (LPI PDC) certification. Covers CLI, permissions, bash scripting, package management, system security, and everything in between.",
    slug: "linux-essentials-guide",
    file: "posts/linux-essentials-guide.html",
    category: ["Linux", "Tutorials"],
    tags: ["linux", "bash", "command-line", "permissions", "scripting", "lpi"],
    author: "Aimad Ul Islam",
    date: "2026-06-28",
    updated: "2026-07-01",
    readingTime: 20,
    featured: false,
    image: "",
    imageAlt: "Linux terminal commands",
    emoji: "🐧",
  },
  {
    id: 5,
    title: "Python for Hackers: Security Automation Scripts from Scratch",
    subtitle: "Port scanners, password sprayers, subdomain enumerators — building real security tools in Python.",
    excerpt: "Python is the pentester's scripting language. In this post I walk through building practical security tools from scratch — a port scanner, credential tester, subdomain enumerator, and log parser.",
    slug: "python-for-security",
    file: "posts/python-for-security.html",
    category: ["Programming", "Cybersecurity"],
    tags: ["python", "automation", "security-scripting", "penetration-testing", "tools"],
    author: "Aimad Ul Islam",
    date: "2026-06-20",
    updated: "2026-06-20",
    readingTime: 14,
    featured: false,
    image: "",
    imageAlt: "Python security script code",
    emoji: "🐍",
  },
  {
    id: 6,
    title: "Building a Cybersecurity Home Lab on a Budget",
    subtitle: "Everything you need for a fully functional hacking and forensics lab — free or under $20.",
    excerpt: "You don't need expensive hardware or software to build a professional cybersecurity lab. This guide covers everything: VirtualBox, free vulnerable VMs, DFIR tools, and network simulation — all free.",
    slug: "home-lab-setup",
    file: "posts/home-lab-setup.html",
    category: ["Cybersecurity", "Tutorials", "Personal Projects"],
    tags: ["home-lab", "virtualbox", "lab-setup", "beginners", "free-tools"],
    author: "Aimad Ul Islam",
    date: "2026-06-15",
    updated: "2026-06-18",
    readingTime: 10,
    featured: false,
    image: "",
    imageAlt: "Home lab setup with multiple VMs",
    emoji: "🏠",
  },
];

/* ── CONFIG ──────────────────────────────────────────────────────────────── */
const CONFIG = {
  postsPerPage: 6,
  searchDebounce: 220,
  storageKey: 'aimad-blog-theme',
};

/* ── STATE ───────────────────────────────────────────────────────────────── */
let state = {
  allPosts: BLOG_POSTS,
  filteredPosts: BLOG_POSTS,
  currentPage: 1,
  activeCategory: 'all',
  searchQuery: '',
  totalPages: Math.ceil(BLOG_POSTS.length / CONFIG.postsPerPage),
};

/* ── UTILITY ──────────────────────────────────────────────────────────────── */
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' });
}
function getCategoryClass(cat) {
  const map = { 'Cybersecurity':'tag-cyber','Linux':'tag-linux','Networking':'tag-net',
    'Programming':'tag-prog','Artificial Intelligence':'tag-ai','Web Development':'tag-web',
    'Blender':'tag-blender','Roblox':'tag-roblox','Tutorials':'tag-tut','Personal Projects':'tag-tut' };
  return map[cat] || 'tag-tut';
}

/* ── THEME ───────────────────────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem(CONFIG.storageKey);
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
}
function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
  localStorage.setItem(CONFIG.storageKey, isLight ? '' : 'light');
  const btn = $('#dark-mode-btn');
  if (btn) btn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}

/* ── NAV ─────────────────────────────────────────────────────────────────── */
function initNav() {
  const nav = $('.blog-nav') || $('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
  const ham = $('#ham') || $('#hamburger');
  const mob = $('#mobNav') || $('#mobileNav');
  if (ham && mob) {
    ham.addEventListener('click', () => mob.classList.toggle('open'));
    $$('.mobile-nav a', mob).forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));
  }
  const darkBtn = $('#dark-mode-btn');
  if (darkBtn) darkBtn.addEventListener('click', toggleTheme);
}

/* ── HERO CANVAS ─────────────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = $('#blog-hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const N = 40;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', resize); resize();
  for (let i = 0; i < N; i++) nodes.push({
    x: Math.random()*W, y: Math.random()*H,
    vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
    r:Math.random()*1.5+.8, p:Math.random()*Math.PI*2,
    t:Math.random()>.7?'v':'c'
  });
  function draw() {
    ctx.clearRect(0,0,W,H);
    nodes.forEach(n => { n.x+=n.vx; n.y+=n.vy; n.p+=.016; if(n.x<0||n.x>W)n.vx*=-1; if(n.y<0||n.y>H)n.vy*=-1; });
    for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<160){ const a=(1-d/160)*.2; ctx.strokeStyle=nodes[i].t==='c'?`rgba(0,212,255,${a})`:`rgba(167,139,250,${a})`; ctx.lineWidth=.55; ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke(); }
    }
    nodes.forEach(n => { const p=.5+.5*Math.sin(n.p); ctx.beginPath(); ctx.arc(n.x,n.y,n.r*(.65+.35*p),0,Math.PI*2); ctx.fillStyle=n.t==='c'?`rgba(0,212,255,${p*.7})`:`rgba(167,139,250,${p*.6})`; ctx.fill(); });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── READING PROGRESS ────────────────────────────────────────────────────── */
function initReadingProgress() {
  const bar = $('#reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight) * 100;
    bar.style.width = Math.min(100, pct) + '%';
  }, { passive: true });
}

/* ── SCROLL TO TOP ───────────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = $('#scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── REVEAL ANIMATIONS ───────────────────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.09 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ── RENDER ARTICLE CARD ─────────────────────────────────────────────────── */
function renderCard(post) {
  const tagHtml = post.category.slice(0,2).map(c =>
    `<a href="?cat=${encodeURIComponent(c)}" class="tag ${getCategoryClass(c)}" onclick="filterByCategory('${c}');return false;">${c}</a>`
  ).join('');
  const img = post.image
    ? `<img class="article-card-img" src="${post.image}" alt="${post.imageAlt}" loading="lazy"/>`
    : `<div class="article-card-img-placeholder">${post.emoji}</div>`;
  return `
  <article class="card article-card reveal" data-id="${post.id}" onclick="window.location='${post.file}'" role="link" tabindex="0" aria-label="Read: ${post.title}">
    <div class="card-glow"></div>
    <div class="article-card-img-wrap">${img}</div>
    <div class="article-card-body">
      <div class="article-card-tags">${tagHtml}</div>
      <h3 class="article-card-title">${post.title}</h3>
      <p class="article-card-excerpt">${post.excerpt}</p>
      <div class="article-card-footer">
        <div class="article-meta-mini">
          <span><i class="fa-regular fa-calendar"></i> ${formatDate(post.date)}</span>
          <span><i class="fa-regular fa-clock"></i> ${post.readingTime} min</span>
        </div>
        <span class="read-more-link">Read <i class="fa-solid fa-arrow-right fa-xs"></i></span>
      </div>
    </div>
  </article>`;
}

/* ── RENDER FEATURED POST ────────────────────────────────────────────────── */
function renderFeatured(post) {
  const wrap = $('#featured-post-wrap');
  if (!wrap || !post) return;
  const img = post.image
    ? `<img src="${post.image}" alt="${post.imageAlt}" loading="lazy"/>`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:5rem;background:linear-gradient(135deg,rgba(0,212,255,0.06),rgba(124,58,237,0.08));">${post.emoji}</div>`;
  const tagHtml = post.category.slice(0,2).map(c =>
    `<span class="tag ${getCategoryClass(c)}">${c}</span>`
  ).join('');
  wrap.innerHTML = `
  <a href="${post.file}" class="featured-post card" aria-label="Featured: ${post.title}">
    <div class="card-glow"></div>
    <div class="featured-img-wrap">${img}<div class="featured-img-overlay"></div><span class="featured-badge">Featured</span></div>
    <div class="featured-content">
      <div>
        <div class="featured-cat">${tagHtml}</div>
        <h2 class="featured-title">${post.title}</h2>
        <p class="featured-excerpt">${post.excerpt}</p>
      </div>
      <div class="featured-meta">
        <span class="meta-item"><i class="fa-solid fa-user"></i>${post.author}</span>
        <span class="meta-item"><i class="fa-regular fa-calendar"></i>${formatDate(post.date)}</span>
        <span class="meta-item"><i class="fa-regular fa-clock"></i>${post.readingTime} min read</span>
      </div>
    </div>
  </a>`;
}

/* ── RENDER POSTS GRID ───────────────────────────────────────────────────── */
function renderPosts() {
  const grid = $('#articles-grid');
  const noRes = $('#no-results');
  const countEl = $('#posts-count');
  if (!grid) return;

  const start = (state.currentPage - 1) * CONFIG.postsPerPage;
  const paginated = state.filteredPosts.slice(start, start + CONFIG.postsPerPage);

  if (paginated.length === 0) {
    grid.innerHTML = '';
    if (noRes) noRes.style.display = 'block';
  } else {
    if (noRes) noRes.style.display = 'none';
    grid.innerHTML = paginated.map(renderCard).join('');
    // Re-observe reveal elements
    const obs = new IntersectionObserver(e => e.forEach(i => { if(i.isIntersecting) i.target.classList.add('in'); }), {threshold:0.09});
    $$('.reveal', grid).forEach(el => obs.observe(el));
    // Keyboard accessibility
    $$('.article-card', grid).forEach(card => {
      card.addEventListener('keydown', e => { if(e.key === 'Enter') card.click(); });
    });
  }

  if (countEl) countEl.textContent = `${state.filteredPosts.length} post${state.filteredPosts.length !== 1 ? 's' : ''} found`;
  renderPagination();
}

/* ── RENDER PAGINATION ───────────────────────────────────────────────────── */
function renderPagination() {
  const wrap = $('#pagination');
  if (!wrap) return;
  state.totalPages = Math.ceil(state.filteredPosts.length / CONFIG.postsPerPage);
  if (state.totalPages <= 1) { wrap.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="goToPage(${state.currentPage-1})" ${state.currentPage===1?'disabled':''} aria-label="Previous page"><i class="fa-solid fa-chevron-left fa-xs"></i></button>`;
  for (let i = 1; i <= state.totalPages; i++) {
    html += `<button class="page-btn ${i===state.currentPage?'active':''}" onclick="goToPage(${i})" aria-label="Page ${i}" aria-current="${i===state.currentPage?'page':'false'}">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="goToPage(${state.currentPage+1})" ${state.currentPage===state.totalPages?'disabled':''} aria-label="Next page"><i class="fa-solid fa-chevron-right fa-xs"></i></button>`;
  wrap.innerHTML = html;
}

function goToPage(n) {
  if (n < 1 || n > state.totalPages) return;
  state.currentPage = n;
  renderPosts();
  const grid = $('#articles-grid');
  if (grid) grid.scrollIntoView({ behavior:'smooth', block:'start' });
}
window.goToPage = goToPage;

/* ── SEARCH ──────────────────────────────────────────────────────────────── */
function initSearch() {
  const input = $('#blog-search');
  if (!input) return;
  input.addEventListener('input', debounce(e => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    state.currentPage = 1;
    applyFilters();
  }, CONFIG.searchDebounce));
}

function applyFilters() {
  let posts = BLOG_POSTS;
  if (state.activeCategory !== 'all') {
    posts = posts.filter(p => p.category.some(c => c.toLowerCase() === state.activeCategory.toLowerCase()));
  }
  if (state.searchQuery) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(state.searchQuery) ||
      p.excerpt.toLowerCase().includes(state.searchQuery) ||
      p.tags.some(t => t.includes(state.searchQuery)) ||
      p.category.some(c => c.toLowerCase().includes(state.searchQuery))
    );
  }
  state.filteredPosts = posts;
  renderPosts();
}

/* ── CATEGORIES ──────────────────────────────────────────────────────────── */
function initCategories() {
  $$('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.cat || 'all';
      state.currentPage = 1;
      applyFilters();
    });
  });
}
window.filterByCategory = function(cat) {
  state.activeCategory = cat;
  state.currentPage = 1;
  $$('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  applyFilters();
};

/* ── SIDEBAR ─────────────────────────────────────────────────────────────── */
function renderSidebar() {
  // Popular posts (by reading time as proxy)
  const popularWrap = $('#popular-posts');
  if (popularWrap) {
    const sorted = [...BLOG_POSTS].sort((a,b) => b.readingTime - a.readingTime).slice(0,4);
    popularWrap.innerHTML = sorted.map(p => `
      <a href="${p.file}" class="sidebar-post" aria-label="${p.title}">
        <div class="sidebar-post-thumb">${p.image ? `<img src="${p.image}" alt="${p.imageAlt}" loading="lazy"/>` : p.emoji}</div>
        <div>
          <div class="sidebar-post-title">${p.title}</div>
          <div class="sidebar-post-meta"><i class="fa-regular fa-clock" style="color:var(--cyan)"></i> ${p.readingTime} min · ${formatDate(p.date)}</div>
        </div>
      </a>`).join('');
  }

  // Recent posts
  const recentWrap = $('#recent-posts');
  if (recentWrap) {
    const recent = [...BLOG_POSTS].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,4);
    recentWrap.innerHTML = recent.map(p => `
      <a href="${p.file}" class="sidebar-post">
        <div class="sidebar-post-thumb">${p.image ? `<img src="${p.image}" alt="${p.imageAlt}" loading="lazy"/>` : p.emoji}</div>
        <div>
          <div class="sidebar-post-title">${p.title}</div>
          <div class="sidebar-post-meta">${formatDate(p.date)}</div>
        </div>
      </a>`).join('');
  }

  // Tags cloud
  const tagsWrap = $('#tags-cloud');
  if (tagsWrap) {
    const allTags = [...new Set(BLOG_POSTS.flatMap(p => p.tags))];
    tagsWrap.innerHTML = allTags.map(tag => `
      <button class="tag tag-tut" onclick="searchByTag('${tag}')" aria-label="Filter by tag: ${tag}">${tag}</button>`
    ).join('');
  }

  // Category list
  const catListWrap = $('#cat-list');
  if (catListWrap) {
    const cats = ['Cybersecurity','Linux','Networking','Programming','Artificial Intelligence','Web Development','Blender','Roblox','Tutorials','Personal Projects'];
    catListWrap.innerHTML = cats.map(cat => {
      const count = BLOG_POSTS.filter(p => p.category.includes(cat)).length;
      return `<a href="?cat=${encodeURIComponent(cat)}" class="cat-list-item" onclick="filterByCategory('${cat}');return false;">
        <span class="cat-list-name"><i class="fa-solid fa-folder" style="font-size:0.6rem"></i>${cat}</span>
        <span class="cat-count">${count}</span>
      </a>`;
    }).join('');
  }
}

window.searchByTag = function(tag) {
  const input = $('#blog-search');
  if (input) { input.value = tag; state.searchQuery = tag; }
  state.currentPage = 1;
  applyFilters();
  document.getElementById('articles-section')?.scrollIntoView({ behavior:'smooth' });
};

/* ── NEWSLETTER ──────────────────────────────────────────────────────────── */
function initNewsletter() {
  $$('.newsletter-form-handler').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = form.querySelector('button');
        if (btn) { btn.textContent = '✓ Subscribed!'; btn.style.background='linear-gradient(135deg,var(--green),#00a870)'; }
        setTimeout(() => { if(btn){btn.textContent='Subscribe'; btn.style.background='';} input.value=''; }, 3000);
      }
    });
  });
}

/* ── CODE COPY ───────────────────────────────────────────────────────────── */
function initCodeCopy() {
  $$('.code-block-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.copy-btn');
    const pre = wrap.querySelector('pre');
    if (!btn || !pre) return;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; btn.classList.remove('copied'); }, 2200);
      });
    });
  });
}

/* ── TABLE OF CONTENTS ───────────────────────────────────────────────────── */
function initTOC() {
  const toc = $('#toc');
  if (!toc) return;

  // Toggle collapse
  const tocTitle = toc.querySelector('.toc-title');
  if (tocTitle) {
    tocTitle.addEventListener('click', () => toc.classList.toggle('collapsed'));
  }

  // Highlight active section on scroll
  const items = $$('.toc-item a', toc);
  if (!items.length) return;
  const headings = items.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(a => a.closest('.toc-item')?.classList.remove('active'));
        const idx = headings.indexOf(entry.target);
        if (idx >= 0) items[idx]?.closest('.toc-item')?.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  headings.forEach(h => obs.observe(h));
}

/* ── READING TIME (article page) ─────────────────────────────────────────── */
function calcReadingTime() {
  const body = $('.article-body');
  if (!body) return;
  const words = body.textContent.trim().split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  const el = $('#reading-time-val');
  if (el) el.textContent = `${mins} min read`;
}

/* ── SOCIAL SHARE ────────────────────────────────────────────────────────── */
function initShare() {
  const copyUrlBtn = $('#share-copy-url');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyUrlBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        copyUrlBtn.style.color = 'var(--green)';
        setTimeout(() => { copyUrlBtn.innerHTML = '<i class="fa-solid fa-link"></i>'; copyUrlBtn.style.color=''; }, 2000);
      });
    });
  }

  const twitterBtn = $('#share-twitter');
  if (twitterBtn) {
    twitterBtn.addEventListener('click', () => {
      const title = document.title;
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}&via=aimadulislam`, '_blank', 'noopener');
    });
  }

  const linkedinBtn = $('#share-linkedin');
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener');
    });
  }
}

/* ── INIT ALL ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initHeroCanvas();
  initReadingProgress();
  initScrollTop();
  initReveal();
  initSearch();
  initCategories();
  initNewsletter();
  initCodeCopy();
  initTOC();
  calcReadingTime();
  initShare();

  // Blog listing page: render posts + sidebar
  if ($('#articles-grid')) {
    const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
    renderFeatured(featuredPost);
    renderPosts();
    renderSidebar();
  }

  // URL param category filter
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam) filterByCategory(catParam);
});
