import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge ships only the stock Tailwind vocabulary. The DESIGN.md
 * type scale (`text-caption`, `text-label`, …) and the weight aliases
 * (`font-w510`, `font-w590`) are custom theme keys: without registering
 * them, tailwind-merge misclassifies `text-caption` as a text COLOR and
 * silently drops it whenever a real color class follows in the same
 * `cn()` call — leaving rows at the inherited body size.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "micro",
            "label",
            "caption",
            "body-sm",
            "body-lg",
            "subheading",
            "heading-sm",
            "heading",
            "heading-lg",
            "display",
          ],
        },
      ],
      "font-weight": [{ font: ["light", "regular", "w510", "w590"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
