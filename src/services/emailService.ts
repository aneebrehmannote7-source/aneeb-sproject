type SendOrderEmailPayload = {
  id: string;
  order_token?: string;
  name: string;
  email: string;          // customer email (for info only)
  phone: string;
  address: string;
  payment_method: 'cash' | 'online';
};

export async function sendOrderEmails(payload: SendOrderEmailPayload) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('[EmailService] Supabase env vars missing');
    return;
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/functions/v1/send-order-emails`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: payload.id,
          order_token: payload.order_token,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          payment_method: payload.payment_method,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[EmailService] Email sending failed:', errText);
    }
  } catch (error) {
    console.error('[EmailService] Network / runtime error:', error);
  }
}


