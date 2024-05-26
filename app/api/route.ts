import { revalidatePath } from "next/cache";

export async function GET(request : Request) {
  revalidatePath("/")
}