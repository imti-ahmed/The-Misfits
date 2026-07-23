import { notFound } from "next/navigation";
import EmbedPreviewClient from "./EmbedPreviewClient";

// Internal debug tool only — not meant for public visitors.
export default function EmbedPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <EmbedPreviewClient />;
}
