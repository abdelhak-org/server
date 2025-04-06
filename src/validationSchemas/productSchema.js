import { z } from "zod";

export const ProductSchema = z.object({
  title: z.string(),
  desc: z.string(),
  category: z.string(),
  address: z.string(),
  price: z.string(),
  img: z.string().url("Invalid image URL"),
  contact: z.string(),
})