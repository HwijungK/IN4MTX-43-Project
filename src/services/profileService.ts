import { supabase } from "../lib/supabase";
import type { Database } from "../types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type UniversityRow = Database["public"]["Tables"]["universities"]["Row"];

export type ProfileInput = {
  id: string;
  displayName: string;
  bio: string;
  identity: string;
  age: string;
  university: string;
};

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUniversities() {
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getUniversityByName(name: string) {
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUniversityById(id: string) {
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function upsertProfile(input: ProfileInput) {
  const university = await getUniversityByName(input.university);
  const baseProfile = {
    id: input.id,
    display_name: input.displayName.trim(),
    bio: input.bio.trim() || null,
    identity_group: toIdentityGroup(input.identity),
    university_id: university?.id ?? null,
    verified_university: Boolean(university)
  };
  const parsedAge = Number.parseInt(input.age.trim(), 10);

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        ...baseProfile,
        age: parsedAge
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (isMissingAgeColumnError(error)) {
    const fallback = await supabase
      .from("profiles")
      .upsert(
        {
          ...baseProfile,
          age_range: String(parsedAge)
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (fallback.error) {
      throw fallback.error;
    }

    return fallback.data;
  }

  if (error) {
    throw error;
  }

  return data;
}

export function profileToAppFields(profile: ProfileRow, university?: UniversityRow | null) {
  return {
    displayName: profile.display_name,
    bio: profile.bio ?? "",
    identity: fromIdentityGroup(profile.identity_group),
    age: profile.age == null ? profile.age_range ?? "" : String(profile.age),
    university: university?.name ?? "UC Irvine"
  };
}

function isMissingAgeColumnError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const possibleError = error as { code?: string; message?: string };
  const message = possibleError.message ?? "";
  return (
    (possibleError.code === "42703" && message.includes("profiles.age")) ||
    (possibleError.code === "PGRST204" && message.includes("'age'")) ||
    (message.includes("Could not find") && message.includes("'age'") && message.includes("profiles"))
  );
}

function toIdentityGroup(identity: string): Database["public"]["Enums"]["identity_group"] {
  if (identity === "Child") {
    return "child";
  }
  if (identity === "Adult") {
    return "adult";
  }
  return "university_student";
}

function fromIdentityGroup(identity: string) {
  if (identity === "child") {
    return "Child";
  }
  if (identity === "adult") {
    return "Adult";
  }
  return "University student";
}
