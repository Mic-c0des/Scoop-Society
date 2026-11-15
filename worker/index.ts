
import { getDb } from "./db";
import { asc, eq, sql } from "drizzle-orm";
import { flavors } from "./db/schema";

export interface Env {
  DATABASE_URL: string;
  ASSETS: {
  fetch(request: Request): Promise<Response>;
};
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      try {
        const db = getDb(env.DATABASE_URL);

        await db.execute(sql`SELECT 1`);

        return Response.json({
          status: "ok",
          database: "connected",
        });
      } catch (error) {
        console.error(error);

        return Response.json(
          {
            status: "error",
            database: "disconnected",
          },
          { status: 500 },
        );
      }
    }

    if (url.pathname === "/api/flavors" && request.method === "GET") {
      try {
        const db = getDb(env.DATABASE_URL);
        const availableFlavors = await db
          .select({
            id: flavors.id,
            name: flavors.name,
            description: flavors.description,
            priceCents: flavors.priceCents,
            imageUrl: flavors.imageUrl,
          })
          .from(flavors)
          .where(eq(flavors.isAvailable, true))
          .orderBy(asc(flavors.name));

        return Response.json(availableFlavors);
      } catch (error) {
        console.error(error);

        return Response.json(
          { error: "Unable to retrieve flavors" },
          { status: 500 },
        );
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json(
        { error: "Not found" },
        { status: 404 },
      );
    }

    return env.ASSETS.fetch(request);
  },
};
