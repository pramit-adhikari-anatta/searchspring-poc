/**
 * Ported from /components/Badge.js in the main storefront.
 * Zero external dependencies — pure Tailwind classes.
 */
export default function Badge({ className = '', text = '', color = 'primary', variant, onClose = null, ...rest }) {
	let cls = `${className} rounded-full font-medium`;

	if (variant === 'mini') cls += ' px-1.5 text-xs';
	else if (variant === 'cart') cls += ' px-1.5 text-xs animate-bounce';
	else cls += ' py-1 px-3 text-sm';

	if (color === 'primary') cls += ' text-primary-content bg-primary';
	else if (color === 'secondary') cls += ' text-secondary-content bg-secondary';
	else if (color === 'success') cls += ' text-white bg-green-600';
	else if (color === 'danger') cls += ' text-white bg-red-600';
	else if (color === 'warning') cls += ' text-black bg-yellow-400';
	else if (color === 'info') cls += ' text-white bg-indigo-300';
	else if (color === 'light') cls += ' text-black bg-gray-100 border border-gray-300';
	else if (color === 'dark') cls += ' text-white bg-gray-900';

	return (
		<span className={cls} {...rest}>
			{onClose && (
				<button className="mr-2 text-base cursor-pointer" onClick={onClose}>
					&times;
				</button>
			)}
			{text}
		</span>
	);
}
