import { useState } from 'react';

import styles from './SiteIdGate.module.css';

export default function SiteIdGate({ onConfirm }) {
	const [id, setId] = useState('');

	return (
		<div className={styles.overlay}>
			<div className={styles.card}>
				<div className={styles.icon}>🔑</div>
				<h2 className={styles.title}>Searchspring Site ID required</h2>
				<p className={styles.sub}>
					Enter your <strong>Searchspring Site ID</strong> to start the POC. It&apos;s the subdomain
					prefix of your API URL — e.g.{' '}
					<code className={styles.code}>smj4zx</code> from{' '}
					<code className={styles.code}>smj4zx.a.searchspring.io</code>.
				</p>
				<p className={styles.sub}>
					For persistent config, set <code className={styles.code}>VITE_SS_SITE_ID</code> in{' '}
					<code className={styles.code}>apps/searchspring-poc/.env.local</code>.
				</p>
				<div className={styles.row}>
					<input
						autoFocus
						className={styles.input}
						placeholder="e.g. smj4zx"
						type="text"
						value={id}
						onChange={(e) => setId(e.target.value.trim())}
						onKeyDown={(e) => e.key === 'Enter' && id && onConfirm(id)}
					/>
					<button
						className={styles.btn}
						disabled={!id}
						onClick={() => onConfirm(id)}>
						Start POC →
					</button>
				</div>
			</div>
		</div>
	);
}
