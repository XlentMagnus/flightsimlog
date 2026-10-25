import { NextResponse, type NextRequest } from "next/server";
import { findAircraftImage } from "@/lib/aircraft-image";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim() ?? "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Ogiltigt namn" }, { status: 400 });
  }

  try {
    const image = await findAircraftImage(name);
    return NextResponse.json(
      { image },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    // Wikipedia onåbart: svara utan bild sa att popupen fortfarande fungerar.
    return NextResponse.json({ image: null }, { status: 200 });
  }
}
