import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb";

describe("Breadcrumb Component", () => {
  it("renders nav hierarchy with aria-label='Breadcrumb' and aria-current='page'", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Components</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(
      screen.getByRole("navigation", { name: /breadcrumb/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Components")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders custom slash separator", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>API</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByText("/")).toBeInTheDocument();
  });

  it("renders BreadcrumbEllipsis for collapsed paths", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("handles link click interaction", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((e) => e.preventDefault());
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects" onClick={onClick}>
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const link = screen.getByRole("link", { name: "Projects" });
    await user.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  it("merges custom className without dropping base styles", () => {
    render(
      <Breadcrumb className="my-custom-nav">
        <BreadcrumbList className="my-custom-ol">
          <BreadcrumbItem>
            <BreadcrumbPage className="my-custom-page">Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByRole("navigation")).toHaveClass("my-custom-nav");
    expect(screen.getByText("Page")).toHaveClass("my-custom-page");
  });

  it("forwards refs to all Breadcrumb elements", () => {
    const navRef = createRef<HTMLElement>();
    const listRef = createRef<HTMLOListElement>();
    const linkRef = createRef<HTMLAnchorElement>();

    render(
      <Breadcrumb ref={navRef}>
        <BreadcrumbList ref={listRef}>
          <BreadcrumbItem>
            <BreadcrumbLink ref={linkRef} href="/test">
              Test
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(navRef.current).toBeInstanceOf(HTMLElement);
    expect(listRef.current).toBeInstanceOf(HTMLOListElement);
    expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
