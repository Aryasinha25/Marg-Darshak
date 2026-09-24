import codecs

css_content = """
/* App-Wide Accessibility Mode Styles */
.accessibility-mode {
  --primary: 0 0% 0%;
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --muted: 0 0% 90%;
  --muted-foreground: 0 0% 10%;
  --border: 0 0% 0%;
  font-size: 110%;
  font-weight: 500;
}
.accessibility-mode.dark {
  --primary: 60 100% 50%;
  --primary-foreground: 0 0% 0%;
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --muted: 0 0% 20%;
  --muted-foreground: 0 0% 90%;
  --border: 0 0% 100%;
}
.accessibility-mode * {
  border-color: currentColor;
}
.accessibility-mode button, 
.accessibility-mode a, 
.accessibility-mode input,
.accessibility-mode select,
.accessibility-mode [role="button"] {
  min-height: 48px;
  outline-offset: 4px;
  border-width: 2px !important;
}
.accessibility-mode *:focus-visible {
  outline: 4px solid var(--ring);
  outline-offset: 4px;
}
"""

with codecs.open("src/index.css", "a", "utf-8") as f:
    f.write(css_content)
