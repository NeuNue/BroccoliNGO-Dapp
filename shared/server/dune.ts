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

export async function getBalanceOfExecution(
  address: string,
  executionId: string
) {
  const url = `https://api.dune.com/api/v1/execution/${executionId}/results?limit=1&&filters=holder=${address}`;
  const res = await callDuneAPI(url);
  const rows = res.result?.rows || [];
  console.log('-- rows', rows, 'address', address, 'executionId', executionId)
  if (rows.length === 0) return 0;
  const item = rows[0];
  return Number(item["balance"]) || 0;
}

export function getTaskDate(date: string) {
  if (new Date(date) < new Date('2025-04-02T00:00:00.000Z')) {
    date = new Date('2025-04-02T00:00:00.000Z').toISOString();
  }
  return new Date(date).toISOString().split("T")[0];
}
