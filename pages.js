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
      });
    });
  }


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
