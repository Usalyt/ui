import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * This is a wiring unit, not a runtime reproduction of the reported Storybook
 * crash. It verifies that the preview decorator registers its theme effect
 * through the public Storybook preview API instead of React's dispatcher.
 */
const { useEffectMock } = vi.hoisted(() => ({ useEffectMock: vi.fn() }));

function testModuleFilePath(): string {
  const url = import.meta.url;
  if (url.startsWith("file:")) {
    return fileURLToPath(url);
  }
  const fsPath = url.replace(/^https?:\/\/[^/]+\/@fs/, "");
  if (fsPath !== url) {
    return decodeURIComponent(fsPath.replace(/[?#].*$/, ""));
  }
  throw new Error(`Unsupported test module URL: ${url}`);
}

const requireFromStorybook = createRequire(
  resolve(
    dirname(testModuleFilePath()),
    "../../../../apps/storybook/package.json"
  )
);
const previewApiEntry = requireFromStorybook.resolve("storybook/preview-api");

type Preview = {
  initialGlobals?: { theme?: string };
  decorators?: unknown;
  globalTypes?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
};
type StoryFn = () => null;
type DecoratorContext = { globals: { theme?: string } };
type DecoratorResult = {
  props: {
    className: string;
    style: { padding: string; minHeight: string };
    children: { type: unknown };
  };
};

// @ts-expect-error Vite provides import.meta.glob during the test transform.
const previewModules = import.meta.glob(
  "../../../../apps/storybook/.storybook/preview.ts"
);
const previewLoader = (
  previewModules as Record<string, () => Promise<unknown>>
)["../../../../apps/storybook/.storybook/preview.ts"];

async function loadPreview(): Promise<Preview> {
  if (!previewLoader) {
    throw new Error("Preview module was not found by the test loader");
  }
  vi.resetModules();
  vi.doMock(previewApiEntry, () => ({ useEffect: useEffectMock }));
  const module = (await previewLoader()) as { default: Preview };
  return module.default;
}

function getThemeDecorator(
  preview: Preview
): (story: StoryFn, context: DecoratorContext) => DecoratorResult {
  const decorators = preview.decorators;
  if (!Array.isArray(decorators) || decorators.length !== 1) {
    throw new Error("Expected exactly one preview decorator");
  }
  return decorators[0] as (
    story: StoryFn,
    context: DecoratorContext
  ) => DecoratorResult;
}

describe("Storybook preview theme decorator (wiring unit)", () => {
  beforeEach(() => {
    useEffectMock.mockReset();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  });

  it("uses the installed public preview-api effect and keeps annotations", async () => {
    const installed = requireFromStorybook("storybook/preview-api") as {
      useEffect?: unknown;
    };
    expect(typeof installed.useEffect).toBe("function");

    const preview = await loadPreview();
    expect(preview.initialGlobals).toMatchObject({ theme: "dark" });
    expect(preview.decorators).toHaveLength(1);
    expect(preview.globalTypes?.theme).toMatchObject({
      description: "Global theme for components",
    });
    expect(preview.parameters).toMatchObject({
      layout: "centered",
      backgrounds: { disabled: true },
      a11y: {
        manual: true,
        context: "#storybook-root",
      },
    });
  });

  it("registers and applies the default dark effect", async () => {
    const preview = await loadPreview();
    const decorator = getThemeDecorator(preview);
    const Story = () => null;
    const element = decorator(Story, { globals: {} });

    expect(useEffectMock).toHaveBeenCalledTimes(1);
    const [effect, dependencies] = useEffectMock.mock.calls[0] as [
      () => void,
      string[],
    ];
    expect(dependencies).toEqual(["dark"]);

    effect();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.body.classList.contains("dark")).toBe(true);
    expect(element.props.className).toBe(
      "dark bg-background text-foreground"
    );
    expect(element.props.style).toEqual({
      padding: "2rem",
      minHeight: "100%",
    });
    expect(element.props.children.type).toBe(Story);
  });

  it("registers and applies the light effect", async () => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");

    const preview = await loadPreview();
    const decorator = getThemeDecorator(preview);
    const Story = () => null;
    const element = decorator(Story, { globals: { theme: "light" } });

    expect(useEffectMock).toHaveBeenCalledTimes(1);
    const [effect, dependencies] = useEffectMock.mock.calls[0] as [
      () => void,
      string[],
    ];
    expect(dependencies).toEqual(["light"]);

    effect();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.body.classList.contains("dark")).toBe(false);
    expect(element.props.className).toBe(
      " bg-background text-foreground"
    );
    expect(element.props.children.type).toBe(Story);
  });
});
