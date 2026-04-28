import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAgentStore } from "@/features/agents/stores/agentStore";
import type { Persona } from "@/shared/types/agents";
import { useAgentSearch } from "../useAgentSearch";

function makePersona(overrides: Partial<Persona>): Persona {
  return {
    id: "agent-1",
    displayName: "Agent",
    systemPrompt: "Helpful assistant",
    isBuiltin: false,
    createdAt: "2026-04-28T00:00:00Z",
    updatedAt: "2026-04-28T00:00:00Z",
    ...overrides,
  };
}

describe("useAgentSearch", () => {
  beforeEach(() => {
    useAgentStore.setState({
      personas: [
        makePersona({
          id: "custom",
          displayName: "Roadmap Writer",
          systemPrompt: "Formats roadmap docs",
          isBuiltin: false,
        }),
        makePersona({
          id: "builtin",
          displayName: "Engineering Lead",
          systemPrompt: "Capacity and feasibility",
          isBuiltin: true,
        }),
      ],
    });
  });

  it("filters agents by display name and system prompt", () => {
    const { result } = renderHook(() => useAgentSearch("feasibility"));

    expect(result.current.map((agent) => agent.id)).toEqual(["builtin"]);
  });

  it("returns built-ins before custom agents in display-name order", () => {
    const { result } = renderHook(() => useAgentSearch("a"));

    expect(result.current.map((agent) => agent.id)).toEqual([
      "builtin",
      "custom",
    ]);
  });
});
