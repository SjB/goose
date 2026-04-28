import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SkillInfo } from "@/features/skills/api/skills";

const mockListSkills = vi.fn();

vi.mock("@/features/skills/api/skills", () => ({
  getCachedSkills: () => [],
  listSkills: (options?: unknown) => mockListSkills(options),
}));

import { useSkillSearch } from "../useSkillSearch";

const skills: SkillInfo[] = [
  {
    name: "roadmap-writer",
    description: "Formats features into roadmap docs",
    instructions: "Write roadmap docs",
    path: "/tmp/roadmap",
  },
  {
    name: "feature-prioritization",
    description: "RICE scoring",
    instructions: "Score features",
    path: "/tmp/scoring",
  },
];

describe("useSkillSearch", () => {
  beforeEach(() => {
    mockListSkills.mockReset().mockResolvedValue(skills);
  });

  it("loads skills and filters by description", async () => {
    const { result } = renderHook(() => useSkillSearch("rice"));

    await waitFor(() => {
      expect(result.current).toHaveLength(1);
    });

    expect(result.current[0]?.name).toBe("feature-prioritization");
    expect(mockListSkills).toHaveBeenCalledTimes(1);
  });
});
