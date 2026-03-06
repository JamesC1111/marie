export type ChatIntent = {
  id: string;
  label: string;
  keywords: string[];
  response: string;
  links?: Array<{ label: string; href: string }>;
};

export type ChatReply = {
  kind: "intent" | "urgent" | "fallback";
  message: string;
  links?: Array<{ label: string; href: string }>;
};

export const urgentChatPattern =
  /\b(self[-\s]?harm|suicid|kill myself|hurt myself|overdose|emergency|in danger|can't go on|cannot go on|harm someone)\b/i;

export const chatIntents: ChatIntent[] = [
  {
    id: "appointments",
    label: "Appointments",
    keywords: [
      "appointment",
      "appointments",
      "availability",
      "book",
      "booking",
      "session",
      "sessions",
    ],
    response:
      "If you would like to ask about availability, you can call, email, or use the appointment form. A short message is enough to begin.",
    links: [
      { label: "Request appointment", href: "/contact#appointment-form" },
      { label: "Call Marie", href: "tel:+353872503743" },
    ],
  },
  {
    id: "contact",
    label: "Contact options",
    keywords: ["contact", "email", "phone", "call", "message"],
    response:
      "You can contact Marie by phone on 087 250 3743 or by email at marieharding4@gmail.com. You do not need to explain everything in your first message.",
    links: [
      { label: "Email Marie", href: "mailto:marieharding4@gmail.com" },
      { label: "Contact page", href: "/contact" },
    ],
  },
  {
    id: "location",
    label: "Location",
    keywords: ["location", "address", "kanturk", "where", "map"],
    response:
      "Marie Harding Counselling Service is based at 12 Percival Street, Kanturk, Co. Cork. Day and evening appointments are available.",
    links: [{ label: "Open contact details", href: "/contact" }],
  },
  {
    id: "format",
    label: "Online or in person",
    keywords: ["online", "in-person", "in person", "face to face", "zoom"],
    response:
      "In-person sessions are available in Kanturk, Co. Cork. If online appointments would suit you better, please ask when you get in touch.",
    links: [{ label: "How counselling works", href: "/how-counselling-works" }],
  },
  {
    id: "first-session",
    label: "First session",
    keywords: ["first session", "nervous", "what happens", "start", "begin"],
    response:
      "The first session is a calm starting point. You can keep your first contact simple, and you are not expected to explain everything at once.",
    links: [
      { label: "Read how counselling works", href: "/how-counselling-works" },
    ],
  },
  {
    id: "confidentiality",
    label: "Confidentiality",
    keywords: ["confidential", "confidentiality", "private", "privacy"],
    response:
      "Confidentiality is of the utmost importance to Marie when working with clients. Any legal or safety-related limits are explained clearly at the start.",
    links: [
      { label: "Confidentiality overview", href: "/how-counselling-works" },
    ],
  },
  {
    id: "urgent-help",
    label: "Urgent help",
    keywords: ["urgent", "crisis", "help now", "immediate help"],
    response:
      "This practice is not an emergency or crisis service. If you need urgent help, call 112 or 999, Samaritans on 116 123, or Pieta on 1800 247 247.",
    links: [{ label: "Support resources", href: "/resources" }],
  },
];

export function getChatReply(input: string): ChatReply {
  const normalised = input.trim().toLowerCase();

  if (!normalised) {
    return {
      kind: "fallback",
      message:
        "You can ask about appointments, contact options, location, online or in-person sessions, confidentiality, or what the first session is like.",
    };
  }

  if (urgentChatPattern.test(normalised)) {
    return {
      kind: "urgent",
      message:
        "I cannot help with urgent or crisis situations. Please call 112 or 999 now if there is immediate danger. You can also call Samaritans on 116 123 or Pieta on 1800 247 247, or text HELP to 51444.",
      links: [
        { label: "Call 112", href: "tel:112" },
        { label: "View urgent support", href: "/resources" },
      ],
    };
  }

  const match = chatIntents.find((intent) =>
    intent.keywords.some((keyword) => normalised.includes(keyword)),
  );

  if (match) {
    return {
      kind: "intent",
      message: match.response,
      links: match.links,
    };
  }

  return {
    kind: "fallback",
    message:
      "I can help with practical questions about appointments, location, how to get started, online or in-person sessions, confidentiality, and urgent-help guidance. For anything else, it is best to contact Marie directly.",
    links: [
      { label: "Contact Marie", href: "/contact" },
      { label: "How counselling works", href: "/how-counselling-works" },
    ],
  };
}
