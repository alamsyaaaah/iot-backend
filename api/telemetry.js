export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  if (req.headers["x-device-token"] !== process.env.DEVICE_TOKEN)
    return res.status(401).json({ error: "unauthorized" });

  const { device_id, temperature_c } = req.body || {};
  if (typeof device_id !== "string" || typeof temperature_c !== "number")
    return res.status(400).json({ error: "invalid payload" });

  const url = `${process.env.SUPABASE_URL}/rest/v1/telemetry`;
  const key = process.env.SUPABASE_SECRET_KEY;

  const r = await fetch(url, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({ device_id, temperature_c })
  });

  return res.status(r.status).send(await r.text());
}
