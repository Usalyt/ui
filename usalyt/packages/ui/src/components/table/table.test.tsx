import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

describe("Table Primitive Component", () => {
  it("renders semantic table structure with headers and rows", () => {
    render(
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: $250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Invoice")).toBeInTheDocument();
    expect(screen.getByText("INV001")).toBeInTheDocument();
    expect(screen.getByText("A list of recent invoices.")).toBeInTheDocument();
  });

  it("sets scope='col' on TableHead elements by default", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const th = screen.getByRole("columnheader", { name: "Status" });
    expect(th).toHaveAttribute("scope", "col");
  });

  it("applies selected state styling on TableRow when data-state='selected'", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-state="selected" data-testid="row">
            <TableCell>Selected Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId("row")).toHaveAttribute("data-state", "selected");
  });

  it("forwards ref to HTMLTableElement", () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});
