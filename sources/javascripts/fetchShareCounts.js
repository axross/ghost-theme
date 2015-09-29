window.__jsonpCallbacks = {};
let lastJsonpCallbackId = 0;

const fetchWithJsonp = (url, callback) => {
  const callbackFunctionName = 'f' + lastJsonpCallbackId++;
  const scriptEl = document.createElement('script');
  scriptEl.setAttribute(
    'src',
    `${url}&callback=window.__jsonpCallbacks.${callbackFunctionName}`
  );

  window.__jsonpCallbacks[callbackFunctionName] = arg => {
    document.body.removeChild(scriptEl);
    delete window.__jsonpCallbacks[callbackFunctionName];

    callback(arg);
  };

  document.body.appendChild(scriptEl);
};

const fetchHatenaBookmarkCount = (url, callback) => {
  fetchWithJsonp(`http://api.b.st-hatena.com/entry.count?url=${url}`, data => {
    callback(data);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const shareCountEls = [].slice.call(
    document.querySelectorAll('.__jsFetchMeShareCount')
  );

  shareCountEls.forEach(shareCountEl => {
    const url = shareCountEl.getAttribute('data-url');

    fetchHatenaBookmarkCount(url, count => {
      shareCountEl.textContent = parseInt(count, 10) || 0;
    });
  });
});
