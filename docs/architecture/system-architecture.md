# System Architecture

DealFlow360 follows a decoupled architecture, separating a React-based frontend from a Python/FastAPI backend, with PostgreSQL as the persistence layer.

## High-Level Architecture

```mermaid
graph TD
    Client[Next.js Frontend (Rep Workspace, Portal)] -->|REST API / JWT| API[FastAPI Backend]
    
    subgraph Core Logic Layer
        API --> Engine[Blended Risk Engine]
        API --> Router[Approval Router]
        API --> Splitter[Warehouse Splitter]
        API --> Billing[Billing Engine]
        API --> Audit[Audit Logger]
        API --> AI[AI Context Packager & Trigger]
    end
    
    subgraph AI Co-Pilot Engine
        AI --> LLM[Claude/Gemini/GPT via API]
    end
    
    subgraph Data Layer
        Engine --> DB[(PostgreSQL)]
        Router --> DB
        Splitter --> DB
        Billing --> DB
        Audit --> DB
    end
```

## AI vs Deterministic Logic

### Deterministic Business Logic (NO AI)
Core decisions are pure math and algorithm-based to avoid hallucinations, latency, and token costs:
- **Discount approval routing**: Blended risk score per line + category ceiling calculation.
- **Warehouse allocation**: Greedy minimization algorithm for optimal split based on live stock.
- **Billing/proration**: Calculating one-time and recurring invoices.

### AI-Assisted Reasoning
AI is used surgically to reason and package information:
- **Co-pilot feed**: Narrating deal events (e.g., explaining risk, summarizing stalled deals).
- **Counter-negotiation draft**: Auto-drafting a response when a customer counters.
- **Upsell reasoning**: Fast, structured suggestion generation.

## Event/Trigger System Flow

1. **Rep modifies quote**: Quote Builder UI sends PATCH.
2. **Backend recalculates**: Risk Engine re-scores.
3. **State change detected**: Trigger System compares new vs previous state.
4. **Context packaged**: Deltas + history structured into a prompt.
5. **LLM called async**: Generates feed card text.
6. **Feed card written**: Stored in DB, pushed to frontend (future Redis pub/sub).
7. **Fallback**: Deterministic templates if AI fails.
