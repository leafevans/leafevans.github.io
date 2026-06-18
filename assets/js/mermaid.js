function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

function initMermaidLight() {
  mermaid.initialize({
    theme: "base",
    themeVariables: {
      background: css("--color-neutral"),
      primaryColor: css("--color-primary-200"),
      secondaryColor: css("--color-secondary-200"),
      tertiaryColor: css("--color-neutral-100"),
      primaryBorderColor: css("--color-primary-400"),
      secondaryBorderColor: css("--color-secondary-400"),
      tertiaryBorderColor: css("--color-neutral-400"),
      lineColor: css("--color-neutral-600"),
      fontFamily: "ChillRoundF, 微软雅黑, Arial, sans-serif",
      fontSize: "15px",
    },
  });
}

function initMermaidDark() {
  mermaid.initialize({
    theme: "dark",
    themeVariables: {
      fontFamily: "ChillRoundF, 微软雅黑, Arial, sans-serif",
      fontSize: "15px",
    },
  });
}
