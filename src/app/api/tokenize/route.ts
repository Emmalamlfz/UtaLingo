import { NextRequest, NextResponse } from "next/server";
import { tokenize } from "@/lib/tokenizer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    const tokens = await tokenize(text);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Tokenization error:", error);
    return NextResponse.json(
      { error: "Failed to tokenize text" },
      { status: 500 }
    );
  }
}
