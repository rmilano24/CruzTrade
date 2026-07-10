const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://cruz-trade.vercel.app';

function buildHtml(subject: string, body: string): string {
	// Convert plain text body to HTML paragraphs, turning bare URLs into buttons
	const paragraphs = body
		.split(/\n\n+/)
		.map((block) => {
			const trimmed = block.trim();
			if (!trimmed) return '';

			// Bare URL on its own line → styled CTA button
			const urlOnly = trimmed.match(/^(https?:\/\/\S+)$/);
			if (urlOnly) {
				return `
					<p style="text-align:center;margin:28px 0 8px;">
						<a href="${urlOnly[1]}" style="display:inline-block;background:#f97316;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:8px;">
							Open in Cruz Trade
						</a>
					</p>`;
			}

			// Inline URLs → styled links
			const withLinks = trimmed.replace(
				/(https?:\/\/\S+)/g,
				'<a href="$1" style="color:#f97316;text-decoration:underline;">$1</a>'
			);

			return `<p style="margin:0 0 16px;line-height:1.6;">${withLinks.replace(/\n/g, '<br>')}</p>`;
		})
		.join('');

	return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#111111;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
		<tr><td align="center">
			<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

				<!-- Header -->
				<tr>
					<td style="background:#f97316;border-radius:10px 10px 0 0;padding:20px 32px;">
						<img src="${SITE_URL}/cruztrade.png" alt="Cruz Trade" width="160" style="display:block;height:auto;max-width:160px;">
					</td>
				</tr>

				<!-- Body -->
				<tr>
					<td style="background:#ffffff;padding:32px 32px 24px;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;">
						<h2 style="margin:0 0 20px;font-size:18px;font-weight:700;color:#111111;line-height:1.3;">${subject}</h2>
						<div style="font-size:15px;color:#333333;">
							${paragraphs}
						</div>
					</td>
				</tr>

				<!-- Footer -->
				<tr>
					<td style="background:#f0f0f0;border-radius:0 0 10px 10px;border:1px solid #e0e0e0;border-top:none;padding:16px 32px;">
						<p style="margin:0;font-size:12px;color:#888888;line-height:1.5;">
							You're receiving this because you have an account on
							<a href="${SITE_URL}" style="color:#f97316;text-decoration:none;">Cruz Trade</a>,
							the hyperlocal skill trade and tool rental marketplace for Santa Cruz County.
						</p>
					</td>
				</tr>

			</table>
		</td></tr>
	</table>
</body>
</html>`;
}

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
			text: body,
			html: buildHtml(subject, body)
		})
	});

	if (!res.ok) {
		const err = await res.text();
		console.error('[email] send failed:', err);
	}
}
