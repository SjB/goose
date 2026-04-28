import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtensionEntry } from "@/features/extensions/types";

const mockListExtensions = vi.fn();

vi.mock("@/features/extensions/api/extensions", () => ({
  listExtensions: () => mockListExtensions(),
}));

import { useExtensionSearch } from "../useExtensionSearch";

const extensions: ExtensionEntry[] = [
  {
    config_key: "memory",
    enabled: true,
    type: "builtin",
    name: "memory",
    display_name: "Memory",
    description: "Remember user preferences",
  },
  {
    config_key: "github",
    enabled: false,
    type: "stdio",
    name: "github",
    description: "Repository tools",
    cmd: "github",
    args: [],
  },
];

describe("useExtensionSearch", () => {
  beforeEach(() => {
    mockListExtensions.mockReset().mockResolvedValue(extensions);
  });

  it("loads extensions, filters by display name, and tags state", async () => {
    const { result } = renderHook(() => useExtensionSearch("mem"));

    await waitFor(() => {
      expect(result.current).toHaveLength(1);
    });

    expect(result.current[0]).toMatchObject({
      state: "enabled",
      entry: { config_key: "memory" },
    });
    expect(mockListExtensions).toHaveBeenCalledTimes(1);
  });
});
