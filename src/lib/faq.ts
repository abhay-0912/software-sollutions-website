export const servicesFaqItems = [
  {
    question: "How long does a typical project take?",
    answer: "Most web apps take 4-8 weeks. ERP systems typically take 8-16 weeks depending on complexity.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes. We work with clients across the US, UK, Europe, and Australia. All communication is in English.",
  },
  {
    question: "What's your payment structure?",
    answer: "We typically work with 50% upfront and 50% on delivery for fixed-price projects.",
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes. We offer monthly maintenance retainers starting at $300 per month.",
  },
  {
    question: "Can you work with our existing codebase?",
    answer: "Absolutely. We regularly take over and extend existing projects.",
  },
] as const;

export const contactFaqItems = [
  {
    question: "Do you sign NDAs?",
    answer: "Yes. We are happy to sign an NDA before discussing your project in detail.",
  },
  {
    question: "Can I see examples of similar work?",
    answer: "Absolutely. Visit our portfolio or ask us to share relevant case studies privately during our call.",
  },
  {
    question: "What if I am not sure what I need?",
    answer: "That is completely fine. Book a discovery call and we will help you figure out the right solution and scope together.",
  },
  {
    question: "Do you take on small projects?",
    answer: "Yes, we take projects starting from $500. If you are not sure if your budget fits, reach out and we will guide you honestly.",
  },
] as const;

export function toFaqJsonLd(items: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
