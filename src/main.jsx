import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import SiteIdGate from './components/SiteIdGate';
import './styles/global.css';

function Root() {
	// Prefer env var (set in .env.local or injected by Shopify Liquid), then prompt.
	const envId = import.meta.env.VITE_SS_SITE_ID || window.__SS_CONFIG__?.siteId || '';
	const [siteId, setSiteId] = useState(envId);

	const handleConfirm = (id) => {
		// Inject into window config so all service calls pick it up immediately.
		window.__SS_CONFIG__ = { ...(window.__SS_CONFIG__ || {}), siteId: id };
		setSiteId(id);
	};

	if (!siteId) return <SiteIdGate onConfirm={handleConfirm} />;
	return <App />;
}

const el = document.getElementById('searchspring-root');
if (el) createRoot(el).render(<StrictMode><Root /></StrictMode>);
