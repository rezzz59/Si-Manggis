import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabaseAdmin
    .from("website_assets")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string;
    const altText = formData.get("alt_text") as string ?? "";
    const caption = formData.get("caption") as string ?? "";

    if (!file || !category) {
      return NextResponse.json(
        { error: "file dan category wajib diisi" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Hanya format JPG, PNG, WebP, GIF yang diizinkan" },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Generate filename
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${category}/${randomUUID()}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from("website-assets")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      return NextResponse.json(
        { error: `Upload gagal: ${storageError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("website-assets")
      .getPublicUrl(filename);

    // Save metadata to DB
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("website_assets")
      .insert({
        filename,
        storage_url: urlData.publicUrl,
        category,
        alt_text: altText,
        caption,
        metadata: { original_name: file.name, size: file.size, type: file.type },
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: delete uploaded file
      await supabaseAdmin.storage.from("website-assets").remove([filename]);
      return NextResponse.json(
        { error: `DB insert gagal: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: dbData }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}