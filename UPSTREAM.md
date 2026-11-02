# Upstream and attribution

Commerce Insight / Market Loom is an independent portfolio implementation designed around the domain boundaries of [Medusa](https://github.com/medusajs/medusa) and an analytics event model compatible with [PostHog](https://github.com/PostHog/posthog).

- Medusa reference date: 2026-10-23
- PostHog reference date: 2026-10-23
- This repository does **not** copy Medusa or PostHog source code.
- No Medusa or PostHog SDK is installed; "compatible" here means the adapter shape and event names only. See [docs/FACT_CARD.md](docs/FACT_CARD.md) for the implemented / not-implemented boundary.
- `CommerceBackend` is a deliberately small adapter boundary. The checked-in `DemoCommerceBackend` uses local catalog data so the portfolio can run without Docker, PostgreSQL, API keys, or payment credentials.
- A production implementation should replace the demo adapter with Medusa Store API calls and forward the typed commerce events to a configured PostHog project.

All simulated orders, metrics, experiments, and user-research templates are explicitly labelled. They must not be presented as production results.
