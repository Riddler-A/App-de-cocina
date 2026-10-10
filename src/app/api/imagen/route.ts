// Foto del platillo vía Pexels (gratis). Si no hay PEXELS_API_KEY,
// devuelve null y la app muestra un enlace a Google Imágenes.

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q");
  const key = process.env.PEXELS_API_KEY;
  if (!q || !key) return Response.json({ url: null });

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?per_page=1&orientation=landscape&query=${encodeURIComponent(q + " food")}`,
      { headers: { Authorization: key } },
    );
    if (!res.ok) return Response.json({ url: null });
    const data = (await res.json()) as { photos?: { src: { medium: string } }[] };
    return Response.json({ url: data.photos?.[0]?.src.medium ?? null });
  } catch {
    return Response.json({ url: null });
  }
}
