import { useEffect, useMemo, useState } from "react";
import {
  getCachedSkills,
  listSkills,
  type SkillInfo,
} from "@/features/skills/api/skills";
import { filterByQuery } from "../lib/filterByQuery";

export function useSkillSearch(query: string): SkillInfo[] {
  const [skills, setSkills] = useState<SkillInfo[]>(getCachedSkills);

  useEffect(() => {
    let cancelled = false;

    void listSkills({ force: true })
      .then((loadedSkills) => {
        if (!cancelled) {
          setSkills(loadedSkills);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSkills([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () =>
      filterByQuery(skills, query, (skill) => [skill.name, skill.description]),
    [skills, query],
  );
}
