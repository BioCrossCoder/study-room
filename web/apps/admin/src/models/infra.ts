import z from "zod";

export const webMetadata = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  lang: z.string().nullish(),
});

export type WebMetadata = z.infer<typeof webMetadata>;
