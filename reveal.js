/* Word-by-word text reveal. Include with: <script src="reveal.js" defer></script>
   Add data-reveal to any element to animate it, or edit SELECTORS below. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTORS = [
    '.hero h1', '.hero > .wrap > p',
    'section h2', 'section .sub',
    '.pil h3', '.pil p', '.bcard h3',
    'main > h1', 'main > .sub',
    '[data-reveal]'
  ].join(',');

  var css = document.createElement('style');
  css.textContent =
    '.rw{display:inline-block;opacity:0;transform:translateY(10px);filter:blur(4px);' +
    'transition:opacity .45s ease,transform .45s ease,filter .45s ease;will-change:opacity,transform}' +
    '.rv-on .rw{opacity:1;transform:none;filter:none}';
  document.head.appendChild(css);

  function split(el) {
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.nodeValue.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'rw';
            s.setAttribute('aria-hidden', 'true');
            s.textContent = p;
            frag.appendChild(s);
            words.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !/^(SCRIPT|STYLE|IMG|SVG)$/i.test(n.tagName)) {
          walk(n);
        }
      });
    })(el);
    return words;
  }

  var els = Array.prototype.slice.call(document.querySelectorAll(SELECTORS))
    .filter(function (el, i, a) { return a.indexOf(el) === i && el.textContent.trim(); });

  var items = els.map(function (el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var words = split(el);
    el.setAttribute('aria-label', label);
    var step = Math.min(70, 1100 / Math.max(words.length, 1));
    words.forEach(function (w, i) { w.style.transitionDelay = Math.round(i * step) + 'ms'; });
    return el;
  });

  function show(el) { el.classList.add('rv-on'); }

  if (!('IntersectionObserver' in window)) { items.forEach(show); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
