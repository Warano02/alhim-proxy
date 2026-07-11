import { NextRequest, NextResponse } from "next/server";

const GATEWAY_API_URL = process.env.GATEWAY_API_URL;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await fetch(`${GATEWAY_API_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ valid: false }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ valid: true, user: data.user }, { status: 200 });
  } catch (error) {
    console.error("Gateway auth verification failed:", error);
    return NextResponse.json({ valid: false }, { status: 502 });
  }
}
