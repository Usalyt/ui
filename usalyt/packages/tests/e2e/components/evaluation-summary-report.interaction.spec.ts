import { test, expect } from "@playwright/test";

import { injectStarlightReset } from "../helpers/starlight-reset";

const REPORT_STORY =
  "/iframe.html?id=blocks-evaluationsummaryreport--fixture&viewMode=story&globals=theme:dark";
const REPORT_NARROW_STORY =
  "/iframe.html?id=blocks-evaluationsummaryreport--fixture-narrow&viewMode=story&globals=theme:dark";

async function measureReport(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const report = document.querySelector<HTMLElement>('[data-testid="report"]');
    if (!report) return null;
    const header = report.children[0] as HTMLElement;
    const content = report.children[1] as HTMLElement;
    const footer = report.children[2] as HTMLElement;
    const grid = report.querySelector<HTMLElement>(
      '[aria-label="Evaluation score summary"]'
    );
    const heading = Array.from(report.querySelectorAll("h4")).find((element) =>
      (element.textContent ?? "").includes("Nielsen's 10 Heuristics")
    );
    const section = heading?.parentElement ?? null;
    const rows = heading?.nextElementSibling
      ? Array.from(heading.nextElementSibling.children)
      : [];
    const firstRow = rows[0] as HTMLElement | undefined;
    const rowHeader = firstRow?.firstElementChild as HTMLElement | undefined;
    const progress = firstRow?.querySelector<HTMLElement>(
      '[role="progressbar"]'
    );
    const probe = document.querySelector<HTMLElement>(
      '[data-testid="reset-probe"]'
    );
    const badge =
      Array.from(report.querySelectorAll<HTMLElement>("div")).find(
        (element) => (element.textContent ?? "").trim() === "Executive Summary"
      ) ?? null;
    const badgeWrapper = badge?.parentElement ?? null;
    const values = grid
      ? Array.from(grid.children).map(
          (card) => card.querySelector<HTMLElement>(".text-3xl")
        )
      : [];
    const valueRows: number[][] = [];
    if (grid) {
      const rowsByTop = new Map<number, number[]>();
      Array.from(grid.children).forEach((card) => {
        const value = card.querySelector<HTMLElement>(".text-3xl");
        if (!value) return;
        const rowTop = Math.round(card.getBoundingClientRect().top);
        const row = rowsByTop.get(rowTop) ?? [];
        row.push(+value.getBoundingClientRect().top.toFixed(2));
        rowsByTop.set(rowTop, row);
      });
      valueRows.push(...Array.from(rowsByTop.values()));
    }
    const actionButtons = header
      ? Array.from(header.querySelectorAll<HTMLElement>("button"))
      : [];
    const footerSpans = footer
      ? Array.from(footer.querySelectorAll<HTMLElement>("span"))
      : [];
    const rect = (element?: HTMLElement | null) =>
      element?.getBoundingClientRect() ?? null;
    const reportRect = report.getBoundingClientRect();
    const reportStyle = getComputedStyle(report);
    const contentRect = content.getBoundingClientRect();
    const contentStyle = getComputedStyle(content);
    const contentLeft =
      contentRect.left + Number.parseFloat(contentStyle.paddingLeft);
    const contentRight =
      contentRect.right - Number.parseFloat(contentStyle.paddingRight);
    return {
      resetInjected: Boolean(
        document.querySelector("[data-fixture-reset]")
      ),
      resetMarginBottom: probe ? getComputedStyle(probe).marginBottom : null,
      headerFlexWrap: getComputedStyle(header).flexWrap,
      footerFlexWrap: getComputedStyle(footer).flexWrap,
      report: {
        width: +reportRect.width.toFixed(2),
        clientWidth: report.clientWidth,
        scrollWidth: report.scrollWidth,
      },
      contentLeft: +contentLeft.toFixed(2),
      contentRight: +contentRight.toFixed(2),
      scoreToSectionGap:
        section && grid
          ? +(section.getBoundingClientRect().top -
              grid.getBoundingClientRect().bottom).toFixed(2)
          : null,
      rowGap:
        rows.length > 1
          ? +(rows[1].getBoundingClientRect().top -
              rows[0].getBoundingClientRect().bottom).toFixed(2)
          : null,
      innerRowGap:
        progress && rowHeader
          ? +(progress.getBoundingClientRect().top -
              rowHeader.getBoundingClientRect().bottom).toFixed(2)
          : null,
      badge:
        badge && badgeWrapper
          ? {
              width: +badge.getBoundingClientRect().width.toFixed(2),
              wrapperWidth: +badgeWrapper.getBoundingClientRect().width.toFixed(
                2
              ),
              alignSelf: getComputedStyle(badge).alignSelf,
            }
          : null,
      valueTops: values
        .map((value) => value && +value.getBoundingClientRect().top.toFixed(2))
        .filter((value): value is number => value !== null),
      valueRows,
      actionButtons: actionButtons.map((button) => ({
        text: (button.textContent ?? "").trim(),
        left: +button.getBoundingClientRect().left.toFixed(2),
        right: +button.getBoundingClientRect().right.toFixed(2),
      })),
      footerSpans: footerSpans.map((span) => ({
        text: (span.textContent ?? "").trim(),
        left: +span.getBoundingClientRect().left.toFixed(2),
        right: +span.getBoundingClientRect().right.toFixed(2),
      })),
      data: {
        title: report.textContent?.includes("Checkout Flow Usability Audit"),
        score: report.textContent?.includes("78"),
        critical: report.textContent?.includes("4"),
        medium: report.textContent?.includes("6"),
        good: report.textContent?.includes("12"),
        heuristic: report.textContent?.includes(
          "Visibility of system status"
        ),
        total: report.textContent?.includes("Total Findings Audited: 22"),
      },
    };
  });
}

test.describe("EvaluationSummaryReport under Starlight reset", () => {
  test("keeps section, list and row rhythm", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(REPORT_STORY);
    await page.getByTestId("report").waitFor();
    await injectStarlightReset(page);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await measureReport(page);
    console.log("T11_REPORT_DESKTOP", JSON.stringify(metrics));
    expect(metrics).not.toBeNull();
    expect(metrics!.resetInjected).toBe(true);
    expect(metrics!.resetMarginBottom).toBe("0px");
    expect(metrics!.report.width).toBe(760);
    expect(metrics!.scoreToSectionGap).toBeGreaterThanOrEqual(20);
    expect(metrics!.rowGap).toBeGreaterThanOrEqual(10);
    expect(metrics!.innerRowGap).toBeGreaterThanOrEqual(4);
    expect(metrics!.badge).not.toBeNull();
    expect(metrics!.badge!.width).toBeLessThanOrEqual(160);
    expect(metrics!.badge!.width).toBeLessThan(metrics!.badge!.wrapperWidth);
    expect(metrics!.data).toEqual({
      title: true,
      score: true,
      critical: true,
      medium: true,
      good: true,
      heuristic: true,
      total: true,
    });
  });

  test("aligns metric values and fits constrained header, actions and footer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(REPORT_NARROW_STORY);
    await page.getByTestId("report").waitFor();
    await injectStarlightReset(page);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await measureReport(page);
    console.log("T11_REPORT_NARROW", JSON.stringify(metrics));
    expect(metrics).not.toBeNull();
    expect(metrics!.report.width).toBe(260);
    expect(metrics!.headerFlexWrap).toBe("wrap");
    expect(metrics!.footerFlexWrap).toBe("wrap");
    expect(metrics!.report.scrollWidth).toBeLessThanOrEqual(
      metrics!.report.clientWidth + 1
    );
    expect(metrics!.badge).not.toBeNull();
    expect(metrics!.badge!.width).toBeLessThanOrEqual(160);
    expect(metrics!.badge!.width).toBeLessThan(metrics!.badge!.wrapperWidth);
    for (const button of metrics!.actionButtons) {
      expect(button.left).toBeGreaterThanOrEqual(metrics!.contentLeft - 1);
      expect(button.right).toBeLessThanOrEqual(metrics!.contentRight + 1);
    }
    for (const span of metrics!.footerSpans) {
      expect(span.left).toBeGreaterThanOrEqual(metrics!.contentLeft - 1);
      expect(span.right).toBeLessThanOrEqual(metrics!.contentRight + 1);
    }
    for (const row of metrics!.valueRows) {
      const spread = Math.max(...row) - Math.min(...row);
      expect(spread).toBeLessThanOrEqual(1);
    }
  });

  test("keeps Share and Export callbacks", async ({ page }) => {
    await page.goto(REPORT_STORY);
    await page.getByTestId("report").waitFor();
    await injectStarlightReset(page);
    await page.getByRole("button", { name: "Share" }).click();
    await expect(page.getByTestId("status")).toHaveText("share");
    await page.getByRole("button", { name: "Export PDF" }).click();
    await expect(page.getByTestId("status")).toHaveText("export");
  });
});
