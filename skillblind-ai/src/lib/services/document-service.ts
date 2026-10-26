import { DocumentChunk, StudyMaterial } from "@/types";

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
}

export function chunkText(
  text: string,
  materialId: string,
  userId: string,
  options: ChunkOptions = {}
): DocumentChunk[] {
  const maxSize = options.maxChunkSize || 600;
  const overlap = options.overlap || 100;

  // Clean and normalize text
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
    .trim();

  // Split into paragraphs or sentences
  const paragraphs = cleaned.split(/\n\s*\n/);
  const chunks: DocumentChunk[] = [];
  let currentChunk = "";
  let chunkIndex = 1;
  let estimatedPage = 1;

  for (const para of paragraphs) {
    if (para.toLowerCase().includes("page ") || para.toLowerCase().includes("chapter ")) {
      estimatedPage++;
    }

    if ((currentChunk + "\n\n" + para).length > maxSize && currentChunk.length > 0) {
      chunks.push({
        id: `chk-${materialId}-${chunkIndex}`,
        study_material_id: materialId,
        user_id: userId,
        content: currentChunk.trim(),
        chunk_index: chunkIndex,
        page_number: estimatedPage,
        section_heading: extractHeading(currentChunk),
        created_at: new Date().toISOString(),
      });
      chunkIndex++;
      // keep overlap
      currentChunk = currentChunk.slice(-overlap) + "\n\n" + para;
    } else {
      currentChunk = currentChunk.length ? currentChunk + "\n\n" + para : para;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chk-${materialId}-${chunkIndex}`,
      study_material_id: materialId,
      user_id: userId,
      content: currentChunk.trim(),
      chunk_index: chunkIndex,
      page_number: estimatedPage,
      section_heading: extractHeading(currentChunk),
      created_at: new Date().toISOString(),
    });
  }

  return chunks;
}

function extractHeading(chunk: string): string {
  const lines = chunk.split("\n");
  const firstLine = lines[0]?.trim();
  if (firstLine && firstLine.length < 60 && !firstLine.endsWith(".")) {
    return firstLine;
  }
  return "Section Content";
}

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid bundling issues
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (err) {
    console.warn("PDF extraction fallback: using text decode", err);
    return fileBuffer.toString("utf-8");
  }
}
