export type ExperimentVariant = "control" | "value-ranked";

export function assignExperiment(visitorId: string): ExperimentVariant {
  let hash = 0;
  for (const character of visitorId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash % 2 === 0 ? "control" : "value-ranked";
}

export function buildFunnel(counts: number[]) {
  return counts.map((count, index) => {
    if (index === 0) {
      return count > 0 ? 100 : 0;
    }
    const previous = counts[index - 1] ?? 0;
    return previous > 0 ? Math.round((count / previous) * 100) : 0;
  });
}

export type CommerceEvent =
  | "product_list_viewed"
  | "product_viewed"
  | "product_added"
  | "checkout_started"
  | "order_completed";

export function captureEvent(
  name: CommerceEvent,
  properties: Record<string, string | number> = {}
) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent("commerce-insight:event", { detail: { name, properties } })
  );
}
