import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is Base UI accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. Base UI components follow WAI-ARIA guidelines with complete keyboard navigation and screen reader support.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Can I customize Tailwind v4 tokens?</AccordionTrigger>
          <AccordionContent>
            Yes. All design tokens are configured via @theme variables in index.css for instant light & dark mode theming.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it zero runtime CSS?</AccordionTrigger>
          <AccordionContent>
            Yes, it leverages native Tailwind CSS utility classes and CVA variant mappings for high-performance rendering.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const MultipleOpen: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Accordion multiple defaultValue={["faq-1", "faq-2"]}>
        <AccordionItem value="faq-1">
          <AccordionTrigger>What is the refund policy?</AccordionTrigger>
          <AccordionContent>
            We offer a full 30-day money-back guarantee with no questions asked.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>How many seats are included?</AccordionTrigger>
          <AccordionContent>
            Pro plans include 5 team seats with optional add-on packs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Accordion defaultValue={["active-1"]}>
        <AccordionItem value="active-1">
          <AccordionTrigger>Standard Shipping Features</AccordionTrigger>
          <AccordionContent>
            Delivery within 3-5 business days across all regions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem disabled value="disabled-2">
          <AccordionTrigger>Same-Day Drone Delivery (Locked)</AccordionTrigger>
          <AccordionContent>
            This feature is currently exclusive to Enterprise tier members.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
