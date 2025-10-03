import { sanityClient } from "../../sanity/client";
import { groq } from "next-sanity";

export async function getReservedSet(year: string) {
  const q = groq`*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[]`;
  const arr = await sanityClient.fetch<string[]>(q, { year });
  return new Set(arr.map(s => s.toUpperCase()));
}