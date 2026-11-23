import type { Preview, Decorator } from "@storybook/react-vite";
import React from "react";
import { useEffect } from "storybook/preview-api";
import "../../../packages/ui/styles/globals.css";

/**
 * Theme decorator — wraps every story in a container that applies
 * light/dark mode via the `.dark` CSS class, matching the design
 * system's Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))`.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return React.createElement(
    "div",
    {
      className: `${theme === "dark" ? "dark" : ""} bg-background text-foreground`,
      style: {
        padding: "2rem",
        minHeight: "100%",
      },
    },
    React.createElement(Story)
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
  decorators: [withTheme],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Manual mode: the automated audits live in the e2e suite
      // (packages/tests/e2e/a11y). The addon's automatic in-iframe axe run
      // races AxeBuilder there ("Axe is already running"); manual keeps the
      // panel available for interactive checking without the overlap.
      manual: true,
      context: "#storybook-root",
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "label", enabled: true },
          { id: "button-name", enabled: true },
          { id: "image-alt", enabled: true },
        ],
      },
    },
    backgrounds: { disabled: true },
  },
};

export default preview;
