import { describe, expect, it } from "vitest";
import { filterByQuery } from "../filterByQuery";

const items = [
  { name: "Roadmap writer", description: "Formats features into docs" },
  { name: "Engineering Lead", description: "Capacity and feasibility" },
  { name: "Skeptical Stakeholder", description: null },
];

describe("filterByQuery", () => {
  it("returns no results for an empty query", () => {
    expect(filterByQuery(items, "  ", (item) => [item.name])).toEqual([]);
  });

  it("matches case-insensitive substrings across fields", () => {
    expect(
      filterByQuery(items, "FEAS", (item) => [item.name, item.description]).map(
        (item) => item.name,
      ),
    ).toEqual(["Engineering Lead"]);
  });

  it("handles missing fields", () => {
    expect(
      filterByQuery(items, "skeptical", (item) => [
        item.name,
        item.description,
      ]).map((item) => item.name),
    ).toEqual(["Skeptical Stakeholder"]);
  });
});
