import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const subjectId = (formData.get("subjectId") as string) || "subj-dsa-101";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";
    let totalPages = 1;

    // Check if PDF
    if (file.name.toLowerCase().endsWith(".pdf")) {
      try {
        // pdf-parse is a CommonJS module — use require for reliable loading
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const pdfFn = typeof pdfParse === "function" ? pdfParse : pdfParse.default;

        if (typeof pdfFn === "function") {
          const pdfData = await pdfFn(buffer);
          extractedText = pdfData.text || "";
          totalPages = pdfData.numpages || Math.ceil(extractedText.length / 1200) || 1;
        } else {
          throw new Error("pdf-parse module loaded but not callable");
        }
      } catch (pdfErr) {
        console.warn("pdf-parse extraction warning, falling back to buffer string decode:", pdfErr);
        // Fallback: extract printable strings from buffer
        extractedText = buffer
          .toString("utf-8")
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/ {3,}/g, " ");
        totalPages = Math.ceil(extractedText.length / 1200) || 1;
      }
    } else {
      // Plain text or markdown
      extractedText = buffer.toString("utf-8");
      totalPages = Math.ceil(extractedText.length / 1200) || 1;
    }

    // Clean text
    const cleanedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .replace(/ {2,}/g, " ")
      .trim();

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      totalPages: Math.max(1, totalPages),
      textLength: cleanedText.length,
      extractedText: cleanedText,
      subjectId,
    });
  } catch (err: any) {
    console.error("PDF upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process uploaded file" },
      { status: 500 }
    );
  }
}
