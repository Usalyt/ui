import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  InspectorSplitView,
  type DOMNodeItem,
} from "./inspector-split-view";

const meta: Meta<typeof InspectorSplitView> = {
  title: "Blocks/InspectorSplitView",
  component: InspectorSplitView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleDOMHierarchy: DOMNodeItem[] = [
  {
    id: "dom-html",
    tag: "html",
    selector: "html",
    children: [
      {
        id: "dom-body",
        tag: "body",
        selector: "body.theme-dark",
        classes: "theme-dark antialiased",
        children: [
          {
            id: "dom-header",
            tag: "header",
            selector: "header.navbar",
            classes: "navbar flex border-b",
            children: [
              {
                id: "dom-nav-btn",
                tag: "button",
                selector: "button.nav-toggle",
                classes: "nav-toggle p-2",
                role: "button",
              },
            ],
          },
          {
            id: "dom-main",
            tag: "main",
            selector: "main.container",
            classes: "container mx-auto py-8",
            children: [
              {
                id: "dom-btn-checkout",
                tag: "button",
                selector: "button#checkout-btn.btn-primary",
                classes: "btn-primary w-full py-3",
                role: "button",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    nodes: sampleDOMHierarchy,
    className: "w-[calc(100vw_-_6rem)] lg:w-auto max-w-4xl mx-auto",
  },
};

export const PreselectedNode: Story = {
  args: {
    nodes: sampleDOMHierarchy,
    defaultSelectedNodeId: "dom-btn-checkout",
    className: "w-[calc(100vw_-_6rem)] lg:w-auto max-w-4xl mx-auto",
  },
};

const longDetailNodes: DOMNodeItem[] = [
  {
    id: "long-detail",
    tag: "section",
    selector:
      "main.dashboard > section[data-region='analytics'] .metric-grid > article:nth-child(3) button[aria-label='Open detailed breakdown for quarterly revenue']",
    classes:
      Array.from({ length: 80 }, (_, index) => `utility-class-${index}`).join(" ") +
      " inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    role: "button",
  },
];

export const LongDetails: Story = {
  args: {
    nodes: longDetailNodes,
    defaultSelectedNodeId: "long-detail",
    className: "w-[calc(100vw_-_6rem)] lg:w-auto max-w-4xl mx-auto",
  },
};
