(function () {
  var scriptEl = document.currentScript;
  if (!scriptEl) return;

  var slug = scriptEl.getAttribute('data-slug');
  if (!slug) return;

  // The ONLY two things a host page is allowed to override. Everything else
  // (colors, layout, content) is fixed at signup and rendered as-is.
  var customWidth = scriptEl.getAttribute('data-width');
  var customFont = scriptEl.getAttribute('data-font');

  var origin = new URL(scriptEl.src).origin;
  var embedUrl = origin + '/widget/' + encodeURIComponent(slug);

  var host = document.createElement('div');
  scriptEl.parentNode.insertBefore(host, scriptEl.nextSibling);
  var shadow = host.attachShadow({ mode: 'open' });

  var pollTimer = null;

  function stopPolling() {
    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
  }

  function applyWidthOverride(wrapper) {
    var requestedWidth = parseFloat(customWidth);
    if (!requestedWidth || requestedWidth <= 0) return;

    var naturalWidth = wrapper.getBoundingClientRect().width;
    if (naturalWidth <= 0) return;

    var scale = requestedWidth / naturalWidth;
    var naturalHeight = wrapper.getBoundingClientRect().height;

    wrapper.style.transform = 'scale(' + scale + ')';
    wrapper.style.transformOrigin = 'top left';
    host.style.width = requestedWidth + 'px';
    host.style.height = (naturalHeight * scale) + 'px';
    host.style.overflow = 'hidden';
  }

  function applyFontOverride() {
    if (!customFont) return;
    var style = document.createElement('style');
    style.textContent = ':host, * { font-family: ' + customFont + ' !important; }';
    shadow.appendChild(style);
  }

  function render(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');

    shadow.innerHTML = '';

    var links = doc.head.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = new URL(href, origin).href;
      shadow.appendChild(newLink);
    });

    var wrapper = document.createElement('div');
    wrapper.innerHTML = doc.body.innerHTML;
    shadow.appendChild(wrapper);

    applyFontOverride();

    var root = wrapper.querySelector('[data-widget-state]');
    var state = root ? root.getAttribute('data-widget-state') : null;

    if (state === 'active' && customWidth) {
      // Wait a frame so the widget has actually painted before measuring it.
      requestAnimationFrame(function () {
        applyWidthOverride(wrapper);
      });
    }

    if (state === 'pending') {
      pollTimer = setTimeout(load, 60 * 60 * 1000); // re-check in 1 hour
    }
  }

  function load() {
    fetch(embedUrl)
      .then(function (res) {
        return res.text();
      })
      .then(render)
      .catch(function () {
        // silent fail — widget just won't render
      });
  }

  window.addEventListener('beforeunload', stopPolling);

  load();
})();
