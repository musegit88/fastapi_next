import { Redis } from "@upstash/redis";
import { countries } from "./countries";




const redis = new Redis({
  url:process.env.UPSTASH_REDIS_REST_URL!,
  token:process.env.UPSTASH_REDIS_REST_TOKEN!,
});

countries.forEach((country) => {
  const char = country.toUpperCase();
  const chars: { score: 0; member: string }[] = [];

  for (let i = 0; i < char.length; i++) {
    chars.push({ score: 0, member: char.substring(0, i) });
  }
  chars.push({ score: 0, member: char + "*" });

  const populateDb = async () => {
    // @ts-expect-error
    await redis.zadd("2chars", ...chars);
  };
  populateDb();
});
