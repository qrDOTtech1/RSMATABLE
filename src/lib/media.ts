/** Renvoie l'URL complète d'un média stocké dans MaTable-API, ou null. */
export function mediaUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}/api/media/${id}`;
}
