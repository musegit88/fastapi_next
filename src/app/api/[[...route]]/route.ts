import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import { cors } from "hono/cors"

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("/*",cors())

type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

app.get("/search", async (c) => {
  try {
    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } =
      env<EnvConfig>(c);

    const start = performance.now();
    // **************

    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });

    const query = c.req.query("q")?.toUpperCase();
    if (!query) {
      return c.json({ message: "Invalid search query" }, { status: 400 });
    }

    const response = [];
    const rank = await redis.zrank("chars", query);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("chars", rank, rank + 100);

      for (const element of temp) {
        if (!element.startsWith(query)) {
          break;
        }

        if (element.endsWith("*")) {
          response.push(element.substring(0, element.length - 1));
        }
      }
    }

    // **************

    const end = performance.now();

    return c.json({
      results: response,
      duration: end - start,
    });
  } catch (error) {
    console.error("SEARCH_ERROR", error);

    return c.json(
      { results: [], message: "Something went wrong." },
      { status: 500 }
    );
  }
});

export const GET = handle(app);
export default app as never;
