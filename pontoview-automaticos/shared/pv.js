window.PV = (() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const qs = (name, fallback = "") => new URLSearchParams(location.search).get(name) || fallback;
  const clean = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const formatNumber = (value, digits = 1) => Number(value).toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits });
  const formatMoney = (value, currency = "BRL", digits = 2) => Number(value).toLocaleString("pt-BR", { style: "currency", currency, maximumFractionDigits: digits, minimumFractionDigits: digits });
  const formatDate = date => new Intl.DateTimeFormat("pt-BR", { weekday:"long", day:"2-digit", month:"long", year:"numeric" }).format(date);
  const titleCase = text => clean(text).replace(/(^|\s)([a-záàâãéèêíìîóòôõúùûç])/g, (_, a, b) => a + b.toUpperCase());

  async function fetchJSON(url, options = {}, timeout = 9000){
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try{
      const res = await fetch(url, { cache:"no-store", ...options, signal:ctrl.signal });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function apiBase(){
    return qs("api", "").replace(/\/$/, "");
  }

  async function fromApi(path, fallback){
    const base = apiBase();
    if(base){
      try{ return await fetchJSON(base + path); }catch{}
    }
    if(typeof fallback === "function") return await fallback();
    throw new Error("Fonte indisponível");
  }

  async function transition(shell, update, duration = 560){
    shell.classList.add("is-leaving");
    await sleep(duration);
    await update();
    shell.classList.remove("is-leaving");
    shell.classList.remove("is-entering");
    void shell.offsetWidth;
    shell.classList.add("is-entering");
    setTimeout(() => shell.classList.remove("is-entering"), 780);
  }

  function startProgress(el, duration){
    if(!el) return () => {};
    let raf = 0;
    const start = performance.now();
    const tick = now => {
      const p = clamp((now - start) / duration, 0, 1);
      el.style.width = `${p * 100}%`;
      if(p < 1) raf = requestAnimationFrame(tick);
    };
    el.style.width = "0%";
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  function qrUrl(link){
    if(!link) return "";
    return "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=" + encodeURIComponent(link);
  }

  function setImage(img, media, url){
    if(!img || !media) return;
    if(!url){
      media.classList.remove("has-image");
      img.removeAttribute("src");
      return;
    }
    img.onload = () => media.classList.add("has-image");
    img.onerror = () => {
      media.classList.remove("has-image");
      img.removeAttribute("src");
      img.onerror = null;
    };
    img.src = url;
  }

  return { sleep, qs, clean, clamp, formatNumber, formatMoney, formatDate, titleCase, fetchJSON, fromApi, transition, startProgress, qrUrl, setImage };
})();
