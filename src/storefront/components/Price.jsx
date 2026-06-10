/**
 * Ported from /components/Price.js in the main storefront.
 * Simplified for POC: USD-only, no MobX GlobalStore, no currency conversion API.
 * Shopify porting: use money_format from window.__SS_CONFIG__ for full currency support.
 */
import { formatMonetaryValue } from '../utils/format';

export default function Price({ price, showSymbol = false }) {
	if (price === undefined || price === null) return '--';
	return <>{showSymbol ? `$${formatMonetaryValue(price)}` : formatMonetaryValue(price)}</>;
}
