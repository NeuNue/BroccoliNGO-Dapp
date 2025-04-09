export async function callDuneAPI(url: string, options: any = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      "X-Dune-API-Key": process.env.DUNE_API_KEY || "",
    },
  });
  if (options.useText) {
    const data = await res.text();
    return data;
  }
  const data = await res.json();
  return data;
}

export function getTaskDate(date: string) {
  if (new Date(date) < new Date("2025-04-02T00:00:00.000Z")) {
    date = new Date("2025-04-02T00:00:00.000Z").toISOString();
  }
  return new Date(date).toISOString().split("T")[0];
}
