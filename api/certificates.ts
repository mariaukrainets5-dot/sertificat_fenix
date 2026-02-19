const KEYCRM_BASE = 'https://openapi.keycrm.app/v1';

async function keycrm(path: string, method = 'GET', body?: object) {
  const apiKey = process.env.KEYCRM_API_KEY;
  if (!apiKey) throw new Error('KEYCRM_API_KEY is not configured');

  const res = await fetch(`${KEYCRM_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST — create certificate in Key CRM
  if (req.method === 'POST') {
    const { code, amount, recipientName, managerName, expiryDate } = req.body;
    if (!code || !amount) {
      return res.status(400).json({ error: 'code and amount are required' });
    }

    try {
      const sourceId = process.env.KEYCRM_SOURCE_ID
        ? parseInt(process.env.KEYCRM_SOURCE_ID)
        : undefined;

      const payload: any = {
        source_uuid: code,
        manager_comment: `Сертифікат: ${code} | ${amount} грн | до ${expiryDate} | Отримувач: ${recipientName || '—'} | Менеджер: ${managerName}`,
        buyer: {
          full_name: recipientName || 'Покупець сертифіката',
        },
        products: [
          {
            sku: code,
            price: amount,
            quantity: 1,
            name: `Подарунковий сертифікат ${code}`,
          },
        ],
      };

      if (sourceId) payload.source_id = sourceId;

      const order = await keycrm('/order', 'POST', payload);
      return res.status(201).json({ success: true, crm_id: order.id });
    } catch (err: any) {
      console.error('[CRM CREATE]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // GET — verify certificate by code
  if (req.method === 'GET') {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'code is required' });

    try {
      const data = await keycrm(
        `/order?filter[source_uuid]=${code}&limit=1&include=status`
      );
      const order = data.data?.[0];

      if (!order) return res.status(404).json({ found: false });

      return res.json({
        found: true,
        crm_id: order.id,
        status: order.status?.name || 'Активний',
        amount: order.total_price,
        created_at: order.created_at,
      });
    } catch (err: any) {
      console.error('[CRM VERIFY]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // PATCH — mark certificate as used
  if (req.method === 'PATCH') {
    const { code, crm_id, order_id } = req.body;

    try {
      let orderId = crm_id;

      if (!orderId && code) {
        const data = await keycrm(
          `/order?filter[source_uuid]=${code}&limit=1`
        );
        orderId = data.data?.[0]?.id;
      }

      if (!orderId) {
        return res.status(404).json({ error: 'Certificate not found in CRM' });
      }

      await keycrm(`/order/${orderId}`, 'PATCH', {
        manager_comment: `[ВИКОРИСТАНО] Сертифікат ${code}${order_id ? ` | Замовлення: #${order_id}` : ''}`,
      });

      return res.json({ success: true, crm_id: orderId });
    } catch (err: any) {
      console.error('[CRM USE]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
