export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.log('[email stub]', { to, subject });
		return;
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: 'Cruz Trade <hello@nmbl.digital>',
			to,
			subject,
			text: body
		})
	});

	if (!res.ok) {
		const err = await res.text();
		console.error('[email] send failed:', err);
	}
}
