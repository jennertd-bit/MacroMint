(() => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  const canonicalHost = "macromint.fit";

  if (!isLocal) {
    const needsHttps = host === canonicalHost && window.location.protocol !== "https:";
    const isNetlifyHost = host.endsWith("netlify.app");
    if (needsHttps || isNetlifyHost) {
      const target = `https://${canonicalHost}${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.location.replace(target);
      return;
    }
  }
})();

window.MACROMINT_API = window.MACROMINT_API || "https://macromint-api.onrender.com";
