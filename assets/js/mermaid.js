function css(n) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(n) + ")";
}

function renderMermaid() {
  var dark = document.documentElement.classList.contains("dark");
  var themeVars = {
    fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
    fontSize: "15px",
  };
  if (!dark) {
    Object.assign(themeVars, {
      background: css("--color-neutral"),
      primaryColor: css("--color-primary-200"),
      secondaryColor: css("--color-secondary-200"),
      tertiaryColor: css("--color-neutral-100"),
      primaryBorderColor: css("--color-primary-400"),
      secondaryBorderColor: css("--color-secondary-400"),
      tertiaryBorderColor: css("--color-neutral-400"),
      lineColor: css("--color-neutral-600"),
    });
  }
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? "dark" : "base",
    fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
    themeVariables: themeVars,
  });
  var els = document.querySelectorAll("pre.mermaid");
  for (var i = 0; i < els.length; i++) {
    var raw = els[i].textContent.replace(/ --> /g, " -->\n    ").replace(/\n{2,}/g, "\n");
    mermaid.render("m" + i, raw).then(function (res) { els[i].innerHTML = res.svg; });
  }
}

document.addEventListener("DOMContentLoaded", renderMermaid);
