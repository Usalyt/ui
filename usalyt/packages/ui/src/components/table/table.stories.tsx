import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
import { Badge } from "../badge";

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { id: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
];

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xl border rounded-xl p-4 bg-background">
      <Table>
        <TableCaption>A summary of your latest billing invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-xs">{inv.id}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    inv.status === "Paid"
                      ? "default"
                      : inv.status === "Pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell>{inv.method}</TableCell>
              <TableCell className="text-right font-mono">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <div className="w-full max-w-xl border rounded-xl p-4 bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-mono text-xs">{inv.id}</TableCell>
              <TableCell>{inv.method}</TableCell>
              <TableCell className="text-right font-mono">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total Billed Amount</TableCell>
            <TableCell className="text-right font-mono font-bold">$1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
