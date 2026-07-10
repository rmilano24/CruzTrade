import type { RequestHandler } from './$types';
import { createSupabaseAdminClient } from '$lib/server/db';

const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://cruz-trade.vercel.app';

const staticRoutes = [
	{ path: '/',              changefreq: 'daily',   priority: '1.0' },
	{ path: '/browse',        changefreq: 'hourly',  priority: '0.9' },
	{ path: '/trade',         changefreq: 'hourly',  priority: '0.8' },
	{ path: '/hire',          changefreq: 'hourly',  priority: '0.8' },
	{ path: '/rent',          changefreq: 'hourly',  priority: '0.8' },
	{ path: '/how-it-works',  changefreq: 'monthly', priority: '0.6' },
	{ path: '/about',         changefreq: 'monthly', priority: '0.5' },
	{ path: '/contact',       changefreq: 'monthly', priority: '0.4' },
];

function url(path: string, lastmod?: string, changefreq = 'weekly', priority = '0.5') {
	return `
	<url>
		<loc>${SITE_URL}${path}</loc>
		${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`.trim();
}

export const GET: RequestHandler = async () => {
	const supabase = createSupabaseAdminClient();

	const [{ data: listings }, { data: profiles }] = await Promise.all([
		supabase
			.from('listings')
			.select('id, updated_at')
			.eq('is_active', true)
			.order('updated_at', { ascending: false })
			.limit(1000),

		supabase
			.from('profiles')
			.select('username, updated_at')
			.not('username', 'is', null)
			.order('updated_at', { ascending: false })
			.limit(1000),
	]);

	const staticUrls = staticRoutes.map((r) =>
		url(r.path, undefined, r.changefreq, r.priority)
	);

	const listingUrls = (listings ?? []).map((l) =>
		url(
			`/listings/${l.id}`,
			l.updated_at ? l.updated_at.slice(0, 10) : undefined,
			'weekly',
			'0.7'
		)
	);

	const profileUrls = (profiles ?? [])
		.filter((p) => p.username)
		.map((p) =>
			url(
				`/profile/${p.username}`,
				p.updated_at ? p.updated_at.slice(0, 10) : undefined,
				'weekly',
				'0.6'
			)
		);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${[...staticUrls, ...listingUrls, ...profileUrls].join('\n\t')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
