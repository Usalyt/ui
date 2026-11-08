import "@testing-library/jest-dom/vitest";
import { expect, vi, beforeEach, afterEach } from "vitest";

// Set global react act environment flag
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== "undefined" && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId: number = 1;
    public pointerType: string = "mouse";
    public isPrimary: boolean = true;

    constructor(type: string, props: PointerEventInit = {}) {
      super(type, props);
      this.pointerId = props.pointerId ?? 1;
      this.pointerType = props.pointerType ?? "mouse";
      this.isPrimary = props.isPrimary ?? true;
    }
  }
  window.PointerEvent = PointerEvent as any;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Polyfill ResizeObserver as a constructor for Floating UI / Base UI popups
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver as any;

// Polyfill IntersectionObserver for embla-carousel / jsdom
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver as any;

// Polyfill HTMLElement.prototype.scrollIntoView for cmdk / jsdom
if (typeof window !== "undefined" && !window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Polyfill document.elementFromPoint for input-otp / jsdom
if (typeof document !== "undefined" && !document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation((...args: any[]) => {
    // Ignore React 19 act(...) async warnings for Base UI mount effects in jsdom
    const msg = args.map((a) => (typeof a === "string" ? a : String(a))).join(" ");
    if (
      msg.includes("was not wrapped in act") ||
      msg.includes("testing environment is not configured to support act")
    ) {
      return;
    }
  });
});

afterEach(() => {
  const filteredErrorCalls = consoleErrorSpy.mock.calls.filter((args: any[]) => {
    const msg = args.map((a) => (typeof a === "string" ? a : String(a))).join(" ");
    return (
      !msg.includes("was not wrapped in act") &&
      !msg.includes("testing environment is not configured to support act")
    );
  });

  expect(consoleWarnSpy).not.toHaveBeenCalled();
  expect(filteredErrorCalls).toHaveLength(0);
  consoleWarnSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});
