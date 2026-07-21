(function () {
  var scriptEl = document.currentScript;
  if (!scriptEl) return;

  var slug = scriptEl.getAttribute('data-slug');
  if (!slug) return;

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

    var root = wrapper.querySelector('[data-widget-state]');
    var state = root ? root.getAttribute('data-widget-state') : null;

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
