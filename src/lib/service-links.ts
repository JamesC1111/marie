export const servicePageSections = [
  {
    href: "#what-this-can-feel-like",
    label: "What this can feel like",
  },
  {
    href: "#how-counselling-may-help",
    label: "How counselling may help",
  },
  {
    href: "#what-we-might-work-on-together",
    label: "What we might work on together",
  },
  {
    href: "#how-to-start",
    label: "How to start",
  },
] as const;

export const relatedServicesBySlug: Record<string, string[]> = {
  "addiction-counselling": [
    "anxiety-and-stress",
    "depression-support",
    "confidence-and-self-esteem",
  ],
  "anxiety-and-stress": [
    "depression-support",
    "confidence-and-self-esteem",
    "bullying-support",
  ],
  "bereavement-and-grief": [
    "depression-support",
    "anxiety-and-stress",
    "relationships-and-family",
  ],
  "bullying-support": [
    "confidence-and-self-esteem",
    "support-for-children-and-young-people",
    "anxiety-and-stress",
  ],
  "confidence-and-self-esteem": [
    "anxiety-and-stress",
    "bullying-support",
    "relationships-and-family",
  ],
  "depression-support": [
    "anxiety-and-stress",
    "bereavement-and-grief",
    "confidence-and-self-esteem",
  ],
  "life-coaching-support": [
    "confidence-and-self-esteem",
    "relationships-and-family",
    "professional-supervision",
  ],
  "professional-supervision": [
    "life-coaching-support",
    "relationships-and-family",
    "confidence-and-self-esteem",
  ],
  "relationships-and-family": [
    "confidence-and-self-esteem",
    "anxiety-and-stress",
    "support-for-children-and-young-people",
  ],
  "support-for-children-and-young-people": [
    "bullying-support",
    "anxiety-and-stress",
    "confidence-and-self-esteem",
  ],
  "trauma-informed-support-sexual-abuse": [
    "anxiety-and-stress",
    "confidence-and-self-esteem",
    "depression-support",
  ],
};
