import { getClient } from "@/shared/api/acpConnection";

export interface SkillInfo {
  name: string;
  description: string;
  instructions: string;
  path: string;
}

interface ListSkillsOptions {
  force?: boolean;
}

// Shape returned by _goose/sources/*. Narrowed to skill-type sources here.
interface SourceEntry {
  type: "skill";
  name: string;
  description: string;
  content: string;
  directory: string;
  global: boolean;
}

function toSkillInfo(source: SourceEntry): SkillInfo {
  return {
    name: source.name,
    description: source.description,
    instructions: source.content,
    path: source.directory,
  };
}

let skillsCache: SkillInfo[] | null = null;
let skillsRequest: Promise<SkillInfo[]> | null = null;

function mergeSkill(skills: SkillInfo[], skill: SkillInfo): SkillInfo[] {
  const next = skills.filter((candidate) => candidate.name !== skill.name);
  return [skill, ...next];
}

function setSkillsCache(skills: SkillInfo[]): SkillInfo[] {
  skillsCache = skills;
  return skills;
}

export function getCachedSkills(): SkillInfo[] {
  return skillsCache ?? [];
}

export function primeSkillsCache(skill: SkillInfo): SkillInfo[] {
  return setSkillsCache(mergeSkill(skillsCache ?? [], skill));
}

function clearSkillsCache() {
  skillsCache = null;
}

export async function createSkill(
  name: string,
  description: string,
  instructions: string,
): Promise<void> {
  const client = await getClient();
  await client.extMethod("_goose/sources/create", {
    type: "skill",
    name,
    description,
    content: instructions,
    global: true,
  });
  clearSkillsCache();
}

async function fetchSkills(): Promise<SkillInfo[]> {
  const client = await getClient();
  const raw = await client.extMethod("_goose/sources/list", { type: "skill" });
  const sources = (raw.sources ?? []) as SourceEntry[];
  return setSkillsCache(sources.map(toSkillInfo));
}

export async function listSkills(
  options: ListSkillsOptions = {},
): Promise<SkillInfo[]> {
  if (!options.force && skillsCache) {
    return skillsCache;
  }

  if (!skillsRequest) {
    skillsRequest = fetchSkills().finally(() => {
      skillsRequest = null;
    });
  }

  return skillsRequest;
}

export async function deleteSkill(name: string): Promise<void> {
  const client = await getClient();
  await client.extMethod("_goose/sources/delete", {
    type: "skill",
    name,
    global: true,
  });
  if (skillsCache) {
    setSkillsCache(skillsCache.filter((skill) => skill.name !== name));
  }
}

export async function updateSkill(
  name: string,
  description: string,
  instructions: string,
): Promise<SkillInfo> {
  const client = await getClient();
  const raw = await client.extMethod("_goose/sources/update", {
    type: "skill",
    name,
    description,
    content: instructions,
    global: true,
  });
  const skill = toSkillInfo(raw.source as SourceEntry);
  setSkillsCache(mergeSkill(skillsCache ?? [], skill));
  return skill;
}

export async function exportSkill(
  name: string,
): Promise<{ json: string; filename: string }> {
  const client = await getClient();
  const raw = await client.extMethod("_goose/sources/export", {
    type: "skill",
    name,
    global: true,
  });
  return { json: raw.json as string, filename: raw.filename as string };
}

export async function importSkills(
  fileBytes: number[],
  fileName: string,
): Promise<SkillInfo[]> {
  if (!fileName.endsWith(".skill.json") && !fileName.endsWith(".json")) {
    throw new Error("File must have a .skill.json or .json extension");
  }
  const data = new TextDecoder().decode(new Uint8Array(fileBytes));
  const client = await getClient();
  const raw = await client.extMethod("_goose/sources/import", {
    data,
    global: true,
  });
  const sources = (raw.sources ?? []) as SourceEntry[];
  return setSkillsCache(sources.map(toSkillInfo));
}
