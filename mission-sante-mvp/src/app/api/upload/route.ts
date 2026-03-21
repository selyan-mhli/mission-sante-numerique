import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role === "lecteur") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", uniqueName);

  await writeFile(uploadPath, buffer);

  return NextResponse.json({
    fileName: file.name,
    fileSize: file.size,
    filePath: `/uploads/${uniqueName}`,
  });
}
