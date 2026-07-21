/* ================================================================
   pages.js — Multi-page Journal site interactions
   ================================================================
   功能：滚动动画 / 导航状态 / 视差 / 画廊筛选 / 表单 / 图片注入
   依赖：content.js（需在此文件之前加载）
   ================================================================ */
(function () {

  /* ============================================================
     1. 内容注入 — 读取 content.js 并替换占位块
     ============================================================ */
  function initContent() {
    var C = window.SITE_CONTENT;
    if (!C) return;

    var imgs  = C.images  || {};
    var prof  = C.profile || {};

    /* ── 图片注入 ──────────────────────────────────────────── */
    /* 找到所有有 data-img 属性的占位块，路径非空时替换为真实图片 */
    document.querySelectorAll('.ph[data-img]').forEach(function (ph) {
      var key = ph.dataset.img;
      var src = imgs[key];
      if (!src) return; // 路径为空，保留占位块

      /* 用背景图方式注入，避免破坏现有布局和动画类 */
      ph.style.backgroundImage    = "url('" + src + "')";
      ph.style.backgroundSize     = 'cover';
      ph.style.backgroundPosition = 'center';
      ph.style.backgroundRepeat   = 'no-repeat';
      ph.setAttribute('data-img-loaded', '');
      /* data-img-loaded 触发 pages.css 里的规则，隐藏占位标签文字 */
    });

    /* ── 邮件链接自动更新 ──────────────────────────────────── */
    if (prof.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.href = 'mailto:' + prof.email;
        /* 只更新看起来是模板占位的内容 */
        if (a.textContent.indexOf('@') !== -1 && a.textContent.indexOf('example') !== -1) {
          a.textContent = prof.email;
        }
      });
      /* 联系页里显示邮箱的 .v 文字 */
      document.querySelectorAll('.ch .v').forEach(function (v) {
        if (v.textContent.indexOf('example') !== -1) {
          v.textContent = prof.email;
        }
      });
    }

    /* ── 版权年份 ──────────────────────────────────────────── */
    if (prof.year) {
      document.querySelectorAll('.legal span, .site-foot .legal span').forEach(function (s) {
        s.textContent = s.textContent.replace(/\d{4}(?= 阿豪)/, prof.year);
      });
    }
  }

  /* 最先运行内容注入，确保 IO 观察器能感知到已更新的 DOM */
  initContent();


  /* ============================================================
     2. 滚动出现动画
     ============================================================ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    io.observe(el);
  });


  /* ============================================================
     3. 导航栏滚动状态
     ============================================================ */
  var nav = document.querySelector('.jr-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ============================================================
     4. 导航激活状态（根据当前页面文件名）
     ============================================================ */
  if (nav) {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    nav.querySelectorAll('.jr-links a').forEach(function (a) {
      var href      = (a.getAttribute('href') || '').toLowerCase();
      var isHome    = (here === '' || here === 'index.html' || here === 'home.html');
      var linkIsHome = (href === 'index.html' || href === 'home.html' || href === './' || href === '/');
      if ((isHome && linkIsHome) || (!isHome && href === here)) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }


  /* ============================================================
     5. 横幅视差（life.html / contact.html 底部大图）
     ============================================================ */
  var banner = document.getElementById('jrBanner');
  var bg     = document.getElementById('jrBannerBg');
  if (banner && bg) {
    var tick = function () {
      var r  = banner.getBoundingClientRect();
      var vh = window.innerHeight;
      var p  = (vh - r.top) / (vh + r.height);
      bg.style.transform = 'translateY(' + ((p - 0.5) * 120) + 'px)';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }


  /* ============================================================
     6. 影像志筛选（gallery.html）
     ============================================================ */
  var filterBar = document.querySelector('.gl-extended .filter');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      filterBar.querySelectorAll('button').forEach(function (x) {
        x.classList.toggle('on', x === b);
      });
      var tag = b.dataset.tag;
      document.querySelectorAll('.jr-album .grid .tile').forEach(function (t) {
        var tags = (t.dataset.tags || '').split(' ');
        var show = tag === 'all' || tags.includes(tag);
        t.style.display = show ? '' : 'none';
        /* 重新出现的瓦片做一次轻微淡入，切换不再生硬 */
        if (show) {
          t.classList.remove('reflow');
          void t.offsetWidth; // 强制重排以重启动画
          t.classList.add('reflow');
        }
      });
    });
  }


  /* ============================================================
     6.5 移动端导航 — 注入汉堡按钮 + 全屏抽屉
     ============================================================ */
  (function initMobileNav() {
    var navEl = document.querySelector('.jr-nav');
    if (!navEl) return;
    var links = navEl.querySelector('.jr-links');
    if (!links) return;

    var btn = document.createElement('button');
    btn.className = 'jr-nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', '打开菜单');
    btn.setAttribute('aria-expanded', 'false');
    for (var s = 0; s < 3; s++) btn.appendChild(document.createElement('span'));
    navEl.appendChild(btn);

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    }

    btn.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });
    /* 点链接后自动收起 */
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    /* Esc 关闭 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    /* 放大到桌面宽度时复位，避免抽屉状态残留 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setOpen(false);
    });
  })();


  /* ============================================================
     6.6 影像志灯箱（gallery.html）— 点击放大 / ←→ 切换 / Esc 关闭
     ============================================================ */
  (function initLightbox() {
    var grid = document.querySelector('.jr-album .grid');
    if (!grid) return;
    var phs = Array.prototype.slice.call(
      grid.querySelectorAll('.tile .ph[data-img]')
    );
    if (!phs.length) return;

    /* 用 DOM 方法构建灯箱，避免 innerHTML */
    function mkBtn(cls, label, text) {
      var b = document.createElement('button');
      b.className = cls;
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.textContent = text;
      return b;
    }
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    var btnClose = mkBtn('lb-close', '关闭', '×');
    var btnPrev  = mkBtn('lb-prev', '上一张', '←');
    var btnNext  = mkBtn('lb-next', '下一张', '→');

    var stage = document.createElement('figure');
    stage.className = 'lb-stage';
    var lbImg = document.createElement('div');
    lbImg.className = 'lb-img';
    var lbCap = document.createElement('figcaption');
    lbCap.className = 'lb-cap';
    stage.appendChild(lbImg);
    stage.appendChild(lbCap);

    box.appendChild(btnClose);
    box.appendChild(btnPrev);
    box.appendChild(btnNext);
    box.appendChild(stage);
    document.body.appendChild(box);

    var idx = 0;
    function render() {
      var ph = phs[idx];
      var bg = ph.style.backgroundImage;
      lbImg.style.backgroundImage = bg || '';
      lbImg.classList.toggle('is-empty', !bg);
      lbImg.setAttribute('data-label', ph.getAttribute('data-label') || '');
      var tile = ph.closest('.tile');
      var lbl = tile && tile.querySelector('.lbl');
      var num = tile && tile.querySelector('.num');
      lbCap.textContent =
        (lbl ? lbl.textContent : '') +
        (num ? '  ·  ' + num.textContent : '');
    }
    function open(i) { idx = i; render(); document.body.classList.add('lb-open'); }
    function close() { document.body.classList.remove('lb-open'); }
    function go(d) { idx = (idx + d + phs.length) % phs.length; render(); }

    phs.forEach(function (ph, i) {
      ph.style.cursor = 'zoom-in';
      ph.addEventListener('click', function () { open(i); });
    });
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { go(-1); });
    btnNext.addEventListener('click', function () { go(1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!document.body.classList.contains('lb-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    });
  })();


  /* ============================================================
     7. 联系表单（contact.html）— 无后端模拟提交
     ============================================================ */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn      = form.querySelector('.submit');
      var original = btn.textContent;
      btn.textContent = '已收到 · 谢谢你 ✓';
      btn.disabled    = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled    = false;
        form.reset();
      }, 2400);
    });
  }

})();
