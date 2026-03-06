export const preferredContactOptions = ["Phone", "Email", "Either"] as const;

export const preferredTimeOptionsByContact = {
  Phone: [
    { value: "Weekday mornings", label: "Weekday mornings" },
    { value: "Weekday afternoons", label: "Weekday afternoons" },
    { value: "Weekday evenings", label: "Weekday evenings" },
  ],
  Email: [
    { value: "Any time by email", label: "Any time by email" },
    { value: "Weekday mornings", label: "Weekday mornings" },
    { value: "Weekday afternoons", label: "Weekday afternoons" },
  ],
  Either: [
    { value: "Weekday mornings", label: "Weekday mornings" },
    { value: "Weekday afternoons", label: "Weekday afternoons" },
    { value: "Weekday evenings", label: "Weekday evenings" },
    { value: "Any time", label: "Any time" },
  ],
} as const satisfies Record<(typeof preferredContactOptions)[number], ReadonlyArray<{ value: string; label: string }>>;

export const preferredTimeValues = Array.from(
  new Set(
    Object.values(preferredTimeOptionsByContact).flatMap((options) =>
      options.map((option) => option.value),
    ),
  ),
);
