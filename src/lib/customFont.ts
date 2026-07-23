// Extracts a usable font-family name from a Google Fonts stylesheet URL
// (e.g. "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600").
// Non-Google-Fonts CDN URLs are still linked as a stylesheet but we can't
// know their font-family name, so this returns null and the widget keeps
// its default font.
export function parseGoogleFontFamily(url: string): string | null {
  try {
    const family = new URL(url).searchParams.get('family');
    if (!family) return null;
    return family.split(':')[0].replace(/\+/g, ' ');
  } catch {
    return null;
  }
}

// Non-Google-Fonts CDNs (cdnfonts.com, Adobe Fonts, self-hosted, etc.) provide
// the stylesheet URL and the font-family name as two separate pieces with no
// reliable way to derive one from the other, so an explicit name always wins
// over the URL-parsed guess.
export function resolveFontFamily(url: string, explicitFamily?: string): string | null {
  const trimmed = explicitFamily?.trim();
  if (trimmed) return trimmed;
  return parseGoogleFontFamily(url);
}
