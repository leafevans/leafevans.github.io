function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

function getMermaidConfig() {
  const isDark = document.documentElement.classList.contains("dark");
  const base = {
    startOnLoad: false,
    fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
    themeVariables: {
      fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
      fontSize: "15px",
    },
  };
  if (isDark) {
    return Object.assign(base, { theme: "dark" });
  }
  return Object.assign(base, {
    theme: "base",
    themeVariables: Object.assign(base.themeVariables, {
      background: css("--color-neutral"),
      primaryColor: css("--color-primary-200"),
      secondaryColor: css("--color-secondary-200"),
      tertiaryColor: css("--color-neutral-100"),
      primaryBorderColor: css("--color-primary-400"),
      secondaryBorderColor: css("--color-secondary-400"),
      tertiaryBorderColor: css("--color-neutral-400"),
      lineColor: css("--color-neutral-600"),
    }),
  });
}

(function renderAll() {
  mermaid.initialize(getMermaidConfig());
  const scripts = document.querySelectorAll('script[type="text/mermaid"]');
  if (scripts.length === 0) return;
  for (const s of scripts) {
    const pre = document.createElement("pre");
    pre.className = "not-prose mermaid overflow-x-auto";
    pre.textContent = s.textContent.trim();
    s.replaceWith(pre);
  }
  mermaid.run();
})();
