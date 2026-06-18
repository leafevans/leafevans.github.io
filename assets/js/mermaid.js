function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

function initMermaidLight() {
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
    themeVariables: {
      background: css("--color-neutral"),
      primaryColor: css("--color-primary-200"),
      secondaryColor: css("--color-secondary-200"),
      tertiaryColor: css("--color-neutral-100"),
      primaryBorderColor: css("--color-primary-400"),
      secondaryBorderColor: css("--color-secondary-400"),
      tertiaryBorderColor: css("--color-neutral-400"),
      lineColor: css("--color-neutral-600"),
      fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
      fontSize: "15px",
    },
  });
}

function initMermaidDark() {
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
    themeVariables: {
      fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
      fontSize: "15px",
    },
  });
}

(function autoInit() {
  const isDark = document.documentElement.classList.contains("dark");
  isDark ? initMermaidDark() : initMermaidLight();
  mermaid.run();
})();
