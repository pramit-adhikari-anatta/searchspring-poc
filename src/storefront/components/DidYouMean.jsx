/**
 * Ported from /components/search/DidYouMean.js in the main storefront.
 * Dependencies shimmed:
 *   - next/link       → storefront/shims/Link
 *   - /components/Typography → storefront/components/Typography
 */
import Link from '../shims/Link';
import Typography from './Typography';

export default function DidYouMean({ didYouMean, originalQuery, onSuggestionClick }) {
	if (!didYouMean) return null;

	// Accept both string (from POC formatter) and object { query, highlighted } (from storefront)
	const suggestedQuery = typeof didYouMean === 'string' ? didYouMean : didYouMean?.query;
	if (!suggestedQuery) return null;

	const handleClick = (e, query) => {
		if (onSuggestionClick) {
			e.preventDefault();
			onSuggestionClick(query);
		}
	};

	return (
		<div className="text-center py-6 grid">
			<Typography variant="body" className="text-v2-brown-darker/70 mb-4">
				Did you mean{' '}
				<Link
					href={`/search?q=${encodeURIComponent(suggestedQuery)}`}
					className="text-primary hover:text-primary-dark font-medium underline"
					onClick={(e) => handleClick(e, suggestedQuery)}>
					{suggestedQuery}
				</Link>
				?
			</Typography>
			{originalQuery && originalQuery !== suggestedQuery && (
				<Typography variant="body" className="text-v2-brown-darker/70">
					No, search instead for{' '}
					<Link
						href={`/search?q=${encodeURIComponent(originalQuery)}`}
						className="text-primary hover:text-primary-dark font-medium underline"
						onClick={(e) => handleClick(e, originalQuery)}>
						{originalQuery}
					</Link>
				</Typography>
			)}
		</div>
	);
}
