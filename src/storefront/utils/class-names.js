// Ported from /utils/class-names.js in the main storefront
export default function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}
