import "server-only";

import { fetchWebsiteMetadata } from "@/infra/metadata";
import type { WebMetadata } from "@/models/infra";
import type { Result } from "neverthrow";

export const MetadataService = { get };

async function get(url: string): Promise<Result<WebMetadata, Error>> {
  return await fetchWebsiteMetadata(url);
}
