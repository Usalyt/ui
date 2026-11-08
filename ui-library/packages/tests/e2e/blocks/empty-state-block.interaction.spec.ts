import { test, expect } from "@playwright/test";

const primaryLabel = "Launch the browser extension and start a new evaluation";
const secondaryLabel = "Read the evaluation methodology guide";

test.describe("Blocks/EmptyStateBlock action containment", () => {
  test("wraps long actions inside the small block container", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/iframe.html?id=blocks-emptystateblock--long-labels&viewMode=story"
    );
    const primary = page.getByRole("button", { name: primaryLabel });
    const secondary = page.getByRole("button", { name: secondaryLabel });
    await expect(primary).toBeVisible();
    await expect(secondary).toBeVisible();

    const metrics = await page.evaluate(() => {
      const block = document.querySelector<HTMLElement>(
        "#storybook-root [aria-labelledby]"
      );
      if (!block) return null;
      const blockStyle = getComputedStyle(block);
      const blockRect = block.getBoundingClientRect();
      const contentLeft =
        blockRect.left + Number.parseFloat(blockStyle.paddingLeft);
      const contentRight =
        blockRect.right - Number.parseFloat(blockStyle.paddingRight);
      const buttons = Array.from(block.querySelectorAll("button"));
      const group = buttons[0]?.parentElement;
      return {
        contentLeft: +contentLeft.toFixed(2),
        contentRight: +contentRight.toFixed(2),
        group: group
          ? {
              flexWrap: getComputedStyle(group).flexWrap,
              width: +group.getBoundingClientRect().width.toFixed(2),
              height: +group.getBoundingClientRect().height.toFixed(2),
            }
          : null,
        buttons: buttons.map((button) => {
          const rect = button.getBoundingClientRect();
          return {
            text: (button.textContent ?? "").trim(),
            left: +rect.left.toFixed(2),
            right: +rect.right.toFixed(2),
            width: +rect.width.toFixed(2),
            height: +rect.height.toFixed(2),
            scrollWidth: button.scrollWidth,
            clientWidth: button.clientWidth,
          };
        }),
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.group).not.toBeNull();
    expect(metrics!.group!.flexWrap).toBe("wrap");
    expect(metrics!.buttons.length).toBe(2);
    const maxButtonHeight = Math.max(
      ...metrics!.buttons.map((button) => button.height)
    );
    expect(metrics!.group!.height).toBeGreaterThan(maxButtonHeight);

    for (const button of metrics!.buttons) {
      expect(button.left).toBeGreaterThanOrEqual(metrics!.contentLeft - 1);
      expect(button.right).toBeLessThanOrEqual(metrics!.contentRight + 1);
      expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth + 1);
    }
    expect(metrics!.buttons.map((button) => button.text)).toEqual([
      secondaryLabel,
      primaryLabel,
    ]);

    await primary.click();
    await secondary.click();
    await expect(primary).toBeVisible();
    await expect(secondary).toBeVisible();
  });
});
