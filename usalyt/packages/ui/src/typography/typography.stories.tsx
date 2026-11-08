import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Foundations/Type Scale",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Usalyt's type scale: every `text-*` token carries its own size, line-height and optical tracking (Tailwind v4 text sub-keys), the weight vocabulary is 300/400/510/590, Inter Variable ships via @fontsource-variable/inter, and Berkeley Mono resolves local() first with JetBrains Mono → ui-monospace as the documented substitutes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SCALE_ROWS: Array<{
  role: string;
  utility: string;
  weight: string;
  metrics: string;
  sample: string;
}> = [
  {
    role: "micro",
    utility: "text-micro",
    weight: "510",
    metrics: "10px / 1.5 / default tracking",
    sample: "Precision metadata at the smallest readable size",
  },
  {
    role: "label",
    utility: "text-label",
    weight: "400",
    metrics: "12px / 1.4 / default tracking",
    sample: "Form labels and inline metadata",
  },
  {
    role: "caption",
    utility: "text-caption",
    weight: "400",
    metrics: "13px / 1.2 / default tracking",
    sample: "Caption copy stays tight and quiet",
  },
  {
    role: "body-sm",
    utility: "text-body-sm",
    weight: "400",
    metrics: "15px / 1.6 / -0.165px",
    sample: "Dense body text keeps its measure with negative tracking",
  },
  {
    role: "body-lg",
    utility: "text-body-lg",
    weight: "590",
    metrics: "20px / 1.33 / -0.24px",
    sample: "Body emphasis blocks carry weight 590",
  },
  {
    role: "subheading",
    utility: "text-subheading",
    weight: "400",
    metrics: "24px / 1.33 / -0.288px",
    sample: "Subheadings introduce a section without shouting",
  },
  {
    role: "heading-sm",
    utility: "text-heading-sm",
    weight: "400",
    metrics: "32px / 1.13 / -0.704px",
    sample: "Small section headings",
  },
  {
    role: "heading",
    utility: "text-heading",
    weight: "510",
    metrics: "48px / 1.0 / -1.056px",
    sample: "Section headings",
  },
  {
    role: "heading-lg",
    utility: "text-heading-lg",
    weight: "510",
    metrics: "64px / 1.0 / -1.408px",
    sample: "Large headings",
  },
  {
    role: "display",
    utility: "text-display",
    weight: "510",
    metrics: "72px / 1.0 / -1.584px",
    sample: "Display",
  },
];

function ScaleRow({
  role,
  utility,
  weight,
  metrics,
  sample,
}: (typeof SCALE_ROWS)[number]) {
  return (
    <div className="flex flex-col gap-1 border-t border-graphite py-5 sm:flex-row sm:items-baseline sm:gap-6">
      <div className="font-berkeley-mono text-label w-48 shrink-0 text-fog">
        <span className="text-paper">{utility}</span>
        <span className="block text-fog">
          {metrics} · {weight}
        </span>
      </div>
      <p className={`${utility} font-w${weight} text-mist m-0 min-w-0`}>
        {sample}
      </p>
    </div>
  );
}

export const Scale: Story = {
  name: "Type Scale (caption → display)",
  render: () => (
    <div className="max-w-3xl">
      {SCALE_ROWS.map((row) => (
        <ScaleRow key={row.role} {...row} />
      ))}
    </div>
  ),
};

const WEIGHTS: Array<[string, string]> = [
  ["300", "font-light"],
  ["400", "font-regular"],
  ["510", "font-w510"],
  ["590", "font-w590"],
];

export const Weights: Story = {
  name: "Weight Vocabulary (300 / 400 / 510 / 590)",
  render: () => (
    <div className="max-w-3xl">
      {WEIGHTS.map(([value, utility]) => (
        <p
          key={value}
          className={`${utility} text-body-sm text-mist border-t border-graphite py-4`}
        >
          <span className="font-berkeley-mono text-label text-fog">
            {utility} · {value}
          </span>
          <br />
          Inter Variable keeps Linear's precision band — no bold above 590.
        </p>
      ))}
    </div>
  ),
};

export const Mono: Story = {
  name: "Berkeley Mono + substitution",
  render: () => (
    <div className="max-w-3xl border-t border-graphite pt-5">
      <p className="font-berkeley-mono text-body-sm text-mist m-0">
        ENG-2703 · ⌘K · 402 ms
      </p>
      <p className="text-caption text-fog mt-2 mb-0 max-w-xl">
        Berkeley Mono is commercial and never bundled: the local() source wins
        when the face is installed; otherwise the stack falls back to JetBrains
        Mono, then ui-monospace.
      </p>
    </div>
  ),
};
