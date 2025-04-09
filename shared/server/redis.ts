import { Redis } from "@upstash/redis";

class SimplerRedisMock {
  private store: Map<string, any>;
  private expirations: Map<string, number>;

  constructor() {
    this.store = new Map();
    this.expirations = new Map();
  }

  async get<T>(key: string): Promise<T | null> {
    this.checkExpiration(key);
    return this.store.has(key) ? this.store.get(key) : null;
  }

  async set<T>(
    key: string,
    value: T,
    options?: { ex?: number }
  ): Promise<string> {
    this.store.set(key, value);

    if (options?.ex) {
      const expirationTime = Date.now() + options.ex * 1000;
      this.expirations.set(key, expirationTime);
    }

    return "OK";
  }

  private checkExpiration(key: string): void {
    const expiration = this.expirations.get(key);
    if (expiration && Date.now() > expiration) {
      this.store.delete(key);
      this.expirations.delete(key);
    }
  }
}

// Initialize Redis
export const redis =
  process.env.NEXT_PUBLIC_LOCAL === "true"
    ? (new SimplerRedisMock() as unknown as Redis)
    : Redis.fromEnv();
