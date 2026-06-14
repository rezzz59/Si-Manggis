import { supabaseAdmin } from "@/src/lib/supabase-admin";
import ArtikelClientPage from "./ArtikelClientPage";

export const metadata = {
  title: "Kabar Desa - Si-Manggis",
  description: "Berita dan informasi terkini dari Kelurahan Guntung Manggis.",
};

export type ArtikelItem = {
  slug: string;
  judul: string;
  excerpt: string | null;
  kategori: string | null;
  gambar_url: string | null;
  tgl_publish: string;
  is_published: boolean;
};

export default async function ArtikelPage() {
  const { data } = await supabaseAdmin
    .from("artikel")
    .select("*")
    .eq("is_published", true)
    .order("tgl_publish", { ascending: false });

  const items = (data ?? []) as ArtikelItem[];

  return <ArtikelClientPage initialItems={items} />;
}
