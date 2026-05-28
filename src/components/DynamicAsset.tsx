import Image from "next/image";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

interface DynamicAssetProps {
  category: string;
  fallback: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export default async function DynamicAsset({
  category,
  fallback,
  alt = "",
  className = "",
  priority = false,
}: DynamicAssetProps) {
  let imageUrl = fallback;

  try {
    const { data, error } = await supabaseAdmin
      .from("website_assets")
      .select("storage_url, alt_text")
      .eq("category", category)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .single();

    if (!error && data?.storage_url) {
      imageUrl = data.storage_url;
      // Use alt_text from database if no alt prop provided
      if (!alt && data.alt_text) {
        alt = data.alt_text;
      }
    }
  } catch (err) {
    // Fallback to provided fallback URL on any error
    console.error(`Failed to fetch asset for category "${category}":`, err);
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className={className}
      priority={priority}
      style={{ objectFit: "cover" }}
    />
  );
}
