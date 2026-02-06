// Allowed order status transitions
const orderTransitions: Record<string, string[]> = {
  DRAFT: ["AWAITING_PAYMENT", "QUOTE_REQUESTED"],
  QUOTE_REQUESTED: ["QUOTED"],
  QUOTED: ["AWAITING_PAYMENT"],
  AWAITING_PAYMENT: ["PAID", "CANCELED"],
  PAID: ["IN_REVIEW"],
  IN_REVIEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["DELIVERED"],
  DELIVERED: ["REVISION_REQUESTED", "COMPLETED"],
  REVISION_REQUESTED: ["REVISION_IN_PROGRESS"],
  REVISION_IN_PROGRESS: ["DELIVERED"],
  COMPLETED: [],
  CANCELED: [],
  REFUNDED: [],
};

export function canTransition(from: string, to: string): boolean {
  return (orderTransitions[from] ?? []).includes(to);
}

export function computeDueAt(addOns: { rush?: boolean }): Date {
  const now = new Date();
  const hours = addOns.rush ? 24 : 72;
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}
