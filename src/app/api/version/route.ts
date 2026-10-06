import { buildInfo } from "@/lib/buildInfo";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(buildInfo, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
    },
  });
}
