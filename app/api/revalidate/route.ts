import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let route = "";
  try {
    const body = await req.json();
    route = typeof body?.route === "string" ? body.route : "";
  } catch (error) {
    route = "";
  }

  if (!route || !route.startsWith("/")) {
    return NextResponse.json({ status: 400 }, { status: 400 });
  }

  revalidatePath(route);
  return NextResponse.json({ status: 200 });
}
