const KEYCRM_BASE = 'https://openapi.keycrm.app/v1';

async function keycrm(path: string) {
  const apiKey = process.env.KEYCRM_API_KEY;
  if (!apiKey) throw new Error('KEYCRM_API_KEY is not configured');

  const res = await fetch(`${KEYCRM_BASE}${path}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Key CRM error');
  return data;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Fetch all pages and collect active managers
    const managers: { id: number; full_name: string }[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const data = await keycrm(`/users?page=${page}&limit=50`);
      lastPage = data.last_page ?? 1;

      for (const user of data.data ?? []) {
        if (user.status === 'active') {
          managers.push({ id: user.id, full_name: user.full_name || user.username });
        }
      }
      page++;
    } while (page <= lastPage);

    return res.json({ data: managers });
  } catch (err: any) {
    console.error('[MANAGERS]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
