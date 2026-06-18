function css(name) {
  return "rgb(" + window.getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

function getMermaidConfig() {
  var isDark = document.documentElement.classList.contains("dark");
  var config = {
    startOnLoad: false,
    fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
    themeVariables: {
      fontFamily: '"ChillRoundF", "Microsoft YaHei", Arial, sans-serif',
      fontSize: "15px",
    },
  };
  if (isDark) {
    config.theme = "dark";
  } else {
    config.theme = "base";
    config.themeVariables.background = css("--color-neutral");
    config.themeVariables.primaryColor = css("--color-primary-200");
    config.themeVariables.secondaryColor = css("--color-secondary-200");
    config.themeVariables.tertiaryColor = css("--color-neutral-100");
    config.themeVariables.primaryBorderColor = css("--color-primary-400");
    config.themeVariables.secondaryBorderColor = css("--color-secondary-400");
    config.themeVariables.tertiaryBorderColor = css("--color-neutral-400");
    config.themeVariables.lineColor = css("--color-neutral-600");
  }
  return config;
}

mermaid.initialize(getMermaidConfig());

document.addEventListener("DOMContentLoaded", function () {
  var diagrams = document.querySelectorAll("pre.mermaid");
  for (var i = 0; i < diagrams.length; i++) {
    (function (el, idx) {
      var raw = el.textContent.trim();
      // Restore newlines that minification may have stripped
      raw = raw.replace(/ --> /g, " -->\n    ");
      raw = raw.replace(/\n\s*\n/g, "\n");
      mermaid
        .render("mermaid-" + idx, raw)
        .then(function (res) {
          el.innerHTML = res.svg;
        })
        .catch(function (err) {
          el.textContent = "[Mermaid] " + err.message + " | " + raw.substring(0, 100);
        });
    })(diagrams[i], i);
  }
});
