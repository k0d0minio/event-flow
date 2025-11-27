import React from "react";
import type { Preview } from "@storybook/react";
import "../src/globals.css";
import { Analytics } from "@vercel/analytics/react";

const withAnalytics = (Story: any, context: any) => (
  <>
    <Story {...context.args} />
    <Analytics />
  </>
);

const preview: Preview = {
  decorators: [withAnalytics],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { toc: true },
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
};

export default preview;
