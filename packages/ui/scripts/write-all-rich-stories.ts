import fs from "fs";
import path from "path";

const compDir = path.resolve(process.cwd(), "src/components");

const richStories: Record<string, string> = {
  "select": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { Label } from "../label";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = React.useState("react");
    return (
      <div className="w-full max-w-xs p-6 border border-border/80 rounded-xl bg-background shadow-xs space-y-2">
        <Label htmlFor="framework-select" className="text-sm font-semibold text-foreground">Select Framework</Label>
        <Select value={val} onValueChange={setVal}>
          <SelectTrigger id="framework-select">
            <SelectValue placeholder="Choose framework..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React 19</SelectItem>
            <SelectItem value="next">Next.js 15</SelectItem>
            <SelectItem value="astro">Astro 5</SelectItem>
            <SelectItem value="vite">Vite 6</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
};`,

  "combobox": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem } from "./combobox";
import { Label } from "../label";

const meta: Meta<typeof Combobox> = {
  title: "Primitives/Combobox",
  component: Combobox,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xs p-6 border border-border/80 rounded-xl bg-background shadow-xs space-y-2">
      <Label htmlFor="tech-combobox" className="text-sm font-semibold text-foreground">Search Technology</Label>
      <Combobox>
        <ComboboxInput id="tech-combobox" placeholder="Type to search..." />
        <ComboboxContent>
          <ComboboxItem value="tailwind">Tailwind CSS v4</ComboboxItem>
          <ComboboxItem value="base-ui">Base UI v1.6</ComboboxItem>
          <ComboboxItem value="typescript">TypeScript 5.8</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    </div>
  )
};`,

  "radio-group": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "../label";

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [plan, setPlan] = React.useState("pro");
    return (
      <div className="w-full max-w-sm p-6 border border-border/80 rounded-xl bg-background shadow-xs space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Subscription Plan</h4>
        <RadioGroup value={plan} onValueChange={setPlan} className="space-y-2">
          <div className="flex items-center space-x-3 p-3 border border-border/60 rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="starter" id="plan-starter" />
            <Label htmlFor="plan-starter" className="cursor-pointer text-sm font-medium">Starter ($0/mo)</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-primary/50 bg-primary/5 rounded-lg cursor-pointer">
            <RadioGroupItem value="pro" id="plan-pro" />
            <Label htmlFor="plan-pro" className="cursor-pointer text-sm font-semibold text-foreground">Pro Tier ($29/mo)</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }
};`,

  "number-field": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberField, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from "./number-field";
import { Label } from "../label";

const meta: Meta<typeof NumberField> = {
  title: "Primitives/NumberField",
  component: NumberField,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [qty, setQty] = React.useState(2);
    return (
      <div className="w-full max-w-xs p-6 border border-border/80 rounded-xl bg-background shadow-xs space-y-2">
        <Label htmlFor="item-qty" className="text-sm font-semibold text-foreground">Item Quantity</Label>
        <NumberField value={qty} onValueChange={setQty} min={1} max={10}>
          <div className="flex items-center space-x-2">
            <NumberFieldDecrement className="px-3 py-1.5 border border-input rounded-md hover:bg-muted">-</NumberFieldDecrement>
            <NumberFieldInput id="item-qty" className="w-16 text-center border border-input rounded-md py-1.5 text-sm" />
            <NumberFieldIncrement className="px-3 py-1.5 border border-input rounded-md hover:bg-muted">+</NumberFieldIncrement>
          </div>
        </NumberField>
      </div>
    );
  }
};`,

  "dropdown-menu": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { Button } from "../button";
import { User, Settings, LogOut } from "lucide-react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6 border border-border/80 rounded-xl bg-background shadow-xs max-w-xs">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">My Account ▾</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 p-1">
          <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md text-xs hover:bg-accent cursor-pointer">
            <User className="h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md text-xs hover:bg-accent cursor-pointer">
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md text-xs hover:bg-destructive/10 text-destructive cursor-pointer">
            <LogOut className="h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};`,

  "tooltip": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";
import { Button } from "../button";
import { Info } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-12 border border-border/80 rounded-xl bg-background shadow-xs flex justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Information">
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-3 py-1.5 text-xs rounded-md bg-neutral-900 text-white shadow-md">
          Base UI Tooltip with instant aria-describedby binding.
        </TooltipContent>
      </Tooltip>
    </div>
  )
};`,

  "popover": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "../button";

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-8 border border-border/80 rounded-xl bg-background shadow-xs max-w-sm">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default" size="sm">Open Filter Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 border border-border bg-background rounded-xl shadow-lg space-y-2 mt-2">
          <h5 className="text-sm font-semibold text-foreground">Filter Options</h5>
          <p className="text-xs text-foreground/80">Select categories to refine your dataset.</p>
        </PopoverContent>
      </Popover>
    </div>
  )
};`,

  "sheet": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./sheet";
import { Button } from "../button";

const meta: Meta<typeof Sheet> = {
  title: "Primitives/Sheet",
  component: Sheet,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6 border border-border/80 rounded-xl bg-background shadow-xs max-w-xs">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">Open Side Sheet</Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-6">
          <SheetHeader>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access quick links and account settings.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
};`,

  "drawer": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "./drawer";
import { Button } from "../button";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6 border border-border/80 rounded-xl bg-background shadow-xs max-w-xs">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="default" size="sm">Open Bottom Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="p-6">
          <DrawerHeader>
            <DrawerTitle>Bottom Action Drawer</DrawerTitle>
            <DrawerDescription>Swipe down or click outside to dismiss.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  )
};`,

  "skeleton": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-6 border border-border/80 rounded-xl bg-background shadow-xs max-w-sm">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 grow">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
};`,

  "spinner": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-6 border border-border/80 rounded-xl bg-background shadow-xs max-w-xs">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  )
};`,

  "table": `import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md border border-border/80 rounded-xl overflow-hidden shadow-xs bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono text-xs">INV-001</TableCell>
            <TableCell className="text-emerald-600 font-semibold">Paid</TableCell>
            <TableCell className="text-right font-mono">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono text-xs">INV-002</TableCell>
            <TableCell className="text-amber-600 font-semibold">Pending</TableCell>
            <TableCell className="text-right font-mono">$150.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
};`
};

Object.entries(richStories).forEach(([name, code]) => {
  const dir = path.join(compDir, name);
  if (fs.existsSync(dir)) {
    const target = path.join(dir, `${name}.stories.tsx`);
    fs.writeFileSync(target, code, "utf-8");
  }
});

console.log(`✅ Applied rich, production-grade stories to existing components!`);
