/* Progressive enhancement: all content and links work without JavaScript. */
(() => {
  "use strict";
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  const mobile = window.matchMedia("(max-width: 820px)");
  function setMenu(open, restoreFocus = false) {
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    nav.inert = mobile.matches && !open;
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener("click", () =>
    setMenu(menu.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  mobile.addEventListener("change", () => setMenu(false));
  setMenu(false);
  document.addEventListener("keydown", (e) => {
    if (menu.getAttribute("aria-expanded") !== "true") return;
    if (e.key === "Escape") {
      setMenu(false, true);
      return;
    }
    if (e.key !== "Tab") return;
    const items = [menu, ...nav.querySelectorAll("a")];
    const first = items[0],
      last = items.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  const filters = document.querySelectorAll("[data-filter]");
  const projects = document.querySelectorAll(".full-project");
  function filterProjects(value) {
    filters.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.filter === value)),
    );
    let count = 0;
    projects.forEach((card) => {
      card.hidden = value !== "all" && card.dataset.category !== value;
      if (!card.hidden) count++;
    });
    const status = document.querySelector("#filter-status");
    if (status) status.textContent = `显示 ${count} 个项目`;
  }
  filters.forEach((b) =>
    b.addEventListener("click", () => filterProjects(b.dataset.filter)),
  );
  function revealLinkedProject() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = Array.from(projects).find((p) => p.id === id);
    if (target && target.hidden) {
      filterProjects("all");
      target.scrollIntoView();
    }
  }
  window.addEventListener("hashchange", revealLinkedProject);
  const dialog = document.querySelector(".photo-dialog");
  if (dialog) {
    const photos = [...document.querySelectorAll(".photo-open")];
    const photo = dialog.querySelector("img"),
      caption = dialog.querySelector("figcaption");
    let index = 0,
      opener;
    function show(i) {
      index = (i + photos.length) % photos.length;
      photo.src = photos[index].dataset.photo;
      photo.alt = photos[index].dataset.caption;
      caption.textContent = `${photos[index].dataset.caption} · ${index + 1} / ${photos.length}`;
    }
    photos.forEach((b, i) =>
      b.addEventListener("click", () => {
        opener = b;
        show(i);
        dialog.showModal();
        document.body.style.overflow = "hidden";
      }),
    );
    dialog
      .querySelector(".dialog-close")
      .addEventListener("click", () => dialog.close());
    dialog
      .querySelector(".photo-prev")
      .addEventListener("click", () => show(index - 1));
    dialog
      .querySelector(".photo-next")
      .addEventListener("click", () => show(index + 1));
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        show(index - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        show(index + 1);
      }
    });
    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";
      opener?.focus();
    });
  }
  const copy = document.querySelector(".copy-email");
  copy?.addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(copy.dataset.email);
      status.textContent = "邮箱已复制，可以粘贴到邮件应用中。";
    } catch {
      status.textContent = "未能自动复制，请选中上方邮箱地址手动复制。";
    }
  });
})();
