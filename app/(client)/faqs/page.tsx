"use client";

import Container from "@/components/Container";
import { Title, SubText } from "@/components/ui/text";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    q: "What materials do you use?",
    a: "Our shells use lightweight, impact-resistant polycarbonate with a micro–textured finish to resist scuffs.",
  },
  {
    q: "Are the locks TSA-approved?",
    a: "Yes. Every hard case includes a TSA-approved combination lock for secure travel.",
  },
  {
    q: "Do the wheels roll silently?",
    a: "We use 360° spinner wheels with rubberized treads and reinforced axles for smooth, quiet movement.",
  },
  {
    q: "What is your return policy?",
    a: "Unused items can be returned within 30 days in original condition for a refund.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes, a limited warranty covers manufacturing defects. Normal wear and tear is excluded.",
  },
];

export default function FaqsPage() {
  return (
    <div className="bg-white">
      <Container className="px-8 py-12 max-w-3xl">
        <Title className="mb-2">Frequently Asked Questions</Title>
        <SubText className="text-base mb-8">
          Everything you need to know about our suitcases, shipping, and support.
        </SubText>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </div>
  );
} 