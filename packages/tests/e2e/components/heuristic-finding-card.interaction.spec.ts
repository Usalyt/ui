import { test, expect } from "@playwright/test";

import { injectStarlightReset } from "../helpers/starlight-reset";

const FINDING_STORY =
  "/iframe.html?id=blocks-heuristicfindingcard--fixture&viewMode=story&globals=theme:dark";
const FINDING_NARROW_STORY =
  "/iframe.html?id=blocks-heuristicfindingcard--fixture-narrow&viewMode=story&globals=theme:dark";
const FINDING_EMPTY_STORY =
  "/iframe.html?id=blocks-heuristicfindingcard--fixture-empty&viewMode=story&globals=theme:dark";

async function measureFinding(
  page: import("@playwright/test").Page,
  testId: string
) {
  return page.evaluate((testId) => {
    const card = document.querySelector<HTMLElement>(
      `[data-testid="${testId}"]`
    );
    if (!card) return null;
    const header = card.children[0] as HTMLElement;
    const content = card.children[1] as HTMLElement;
    const footer = card.children[2] as HTMLElement;
    const children = Array.from(content.children) as HTMLElement[];
    const screenshot = children[0];
    const selector = children[1];
    const severity = children[2];
    const severityHeader = severity?.firstElementChild as HTMLElement | null;
    const severityDescription =
      severity?.lastElementChild as HTMLElement | null;
    const actions = header?.children[1] as HTMLElement | undefined;
    const buttons = actions
      ? Array.from(actions.querySelectorAll<HTMLElement>("button"))
      : [];
    const footerSpans = footer
      ? Array.from(footer.querySelectorAll<HTMLElement>("span"))
      : [];
    const selectorSpan = selector?.querySelector<HTMLElement>("span");
    const copyButton = selector?.querySelector<HTMLElement>("button");
    const rect = (element?: HTMLElement | null) =>
      element?.getBoundingClientRect() ?? null;
    const cardRect = card.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const contentStyle = getComputedStyle(content);
    const contentLeft =
      contentRect.left + Number.parseFloat(contentStyle.paddingLeft);
    const contentRight =
      contentRect.right - Number.parseFloat(contentStyle.paddingRight);
    return {
      resetInjected: Boolean(document.querySelector("[data-fixture-reset]")),
      headerFlexWrap: getComputedStyle(header).flexWrap,
      footerFlexWrap: getComputedStyle(footer).flexWrap,
      card: {
        width: +cardRect.width.toFixed(2),
        clientWidth: card.clientWidth,
        scrollWidth: card.scrollWidth,
      },
      contentLeft: +contentLeft.toFixed(2),
      contentRight: +contentRight.toFixed(2),
      contentChildren: children.length,
      screenshotToSelectorGap:
        screenshot && selector
          ? +(selector.getBoundingClientRect().top -
              screenshot.getBoundingClientRect().bottom).toFixed(2)
          : null,
      selectorToSeverityGap:
        selector && severity
          ? +(severity.getBoundingClientRect().top -
              selector.getBoundingClientRect().bottom).toFixed(2)
          : null,
      severityInnerGap:
        severityHeader && severityDescription
          ? +(severityDescription.getBoundingClientRect().top -
              severityHeader.getBoundingClientRect().bottom).toFixed(2)
          : null,
      selector: selector
        ? {
            clientWidth: selector.clientWidth,
            scrollWidth: selector.scrollWidth,
            spanRight: selectorSpan
              ? +selectorSpan.getBoundingClientRect().right.toFixed(2)
              : null,
            copyRight: copyButton
              ? +copyButton.getBoundingClientRect().right.toFixed(2)
              : null,
          }
        : null,
      actions: buttons.map((button) => ({
        label: button.getAttribute("aria-label"),
        left: +button.getBoundingClientRect().left.toFixed(2),
        right: +button.getBoundingClientRect().right.toFixed(2),
      })),
      footerSpans: footerSpans.map((span) => ({
        text: (span.textContent ?? "").trim(),
        left: +span.getBoundingClientRect().left.toFixed(2),
        right: +span.getBoundingClientRect().right.toFixed(2),
      })),
      data: {
        title: card.textContent?.includes("Visibility of System Status"),
        severity: card.textContent?.includes("CRITICAL"),
        rating: card.textContent?.includes("4 / 5"),
        selector: card.textContent?.includes("complete-purchase"),
        description: card.textContent?.includes(
          "does not show a spinner or loading state"
        ),
        evaluated: card.textContent?.includes("Evaluated by María R."),
        date: card.textContent?.includes("2 Sep 2026"),
      },
    };
  }, testId);
}

test.describe("HeuristicFindingCard under Starlight reset", () => {
  test("keeps content and severity stacks separated", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(FINDING_STORY);
    await page.getByTestId("finding-with-screenshot").waitFor();
    await injectStarlightReset(page);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await measureFinding(page, "finding-with-screenshot");
    console.log("T11_FINDING_DESKTOP", JSON.stringify(metrics));
    expect(metrics).not.toBeNull();
    expect(metrics!.resetInjected).toBe(true);
    expect(metrics!.contentChildren).toBe(3);
    expect(metrics!.screenshotToSelectorGap).toBeGreaterThanOrEqual(12);
    expect(metrics!.selectorToSeverityGap).toBeGreaterThanOrEqual(12);
    expect(metrics!.severityInnerGap).toBeGreaterThanOrEqual(3);
    expect(metrics!.data).toEqual({
      title: true,
      severity: true,
      rating: true,
      selector: true,
      description: true,
      evaluated: true,
      date: true,
    });
  });

  test("fits constrained header, selector and footer", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(FINDING_NARROW_STORY);
    await page.getByTestId("finding-with-screenshot").waitFor();
    await injectStarlightReset(page);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await measureFinding(page, "finding-with-screenshot");
    console.log("T11_FINDING_NARROW", JSON.stringify(metrics));
    expect(metrics).not.toBeNull();
    expect(metrics!.headerFlexWrap).toBe("wrap");
    expect(metrics!.footerFlexWrap).toBe("wrap");
    expect(metrics!.card.scrollWidth).toBeLessThanOrEqual(
      metrics!.card.clientWidth + 1
    );
    expect(metrics!.selector!.scrollWidth).toBeLessThanOrEqual(
      metrics!.selector!.clientWidth + 1
    );
    expect(metrics!.selector!.spanRight).toBeLessThanOrEqual(
      metrics!.contentRight + 1
    );
    expect(metrics!.selector!.copyRight).toBeLessThanOrEqual(
      metrics!.contentRight + 1
    );
    for (const action of metrics!.actions) {
      expect(action.left).toBeGreaterThanOrEqual(metrics!.contentLeft - 1);
      expect(action.right).toBeLessThanOrEqual(metrics!.contentRight + 1);
    }
    for (const span of metrics!.footerSpans) {
      expect(span.left).toBeGreaterThanOrEqual(metrics!.contentLeft - 1);
      expect(span.right).toBeLessThanOrEqual(metrics!.contentRight + 1);
    }
  });

  test("keeps edit, delete, screenshot and copy behavior", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(FINDING_STORY);
    await page.getByTestId("finding-with-screenshot").waitFor();
    await injectStarlightReset(page);

    await page.getByRole("button", { name: "Edit finding" }).click();
    await expect(page.getByTestId("status")).toHaveText("edit");
    await page.getByRole("button", { name: "Delete finding" }).click();
    await expect(page.getByTestId("status")).toHaveText("delete");

    const screenshot = page.getByTestId("finding-with-screenshot");
    await screenshot.hover();
    await screenshot.getByRole("button", { name: "Expand" }).click();
    await expect(page.getByTestId("status")).toHaveText("view-screenshot");

    await screenshot
      .getByRole("button", { name: "Copy to clipboard" })
      .click();
    await page.getByTestId("clipboard-read").click();
    await expect(page.getByTestId("copied")).toHaveText("copied");
    await expect(
      screenshot.getByText("No screenshot captured")
    ).toHaveCount(0);
  });

  test("keeps the screenshot empty placeholder", async ({ page }) => {
    await page.goto(FINDING_EMPTY_STORY);
    await page.getByTestId("finding-without-screenshot").waitFor();
    await injectStarlightReset(page);
    const placeholder = page
      .getByTestId("finding-without-screenshot")
      .getByText("No screenshot captured");
    await expect(placeholder).toBeVisible();
  });
});
