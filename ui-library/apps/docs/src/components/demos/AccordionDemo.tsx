import React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from "tu-ui";

export function AccordionDemo() {
  return (
    <Accordion type="single" defaultValue="item-1" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern and is built using Base UI primitives.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Is it styled with Tailwind v4?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Yes. It utilizes CSS variables and Tailwind v4 @theme tokens.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
