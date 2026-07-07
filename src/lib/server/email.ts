export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
	console.log('[email stub]', { to, subject, body });
}
