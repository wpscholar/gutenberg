/**
 * Returns the embed for the given URL.
 *
 * @param {Object} state    Data state.
 * @param {string} url      Embedded URL.
 *
 * @return {Mixed} Undefined if the preview has not been fetched, false if the URL cannot be embedded, array of embed preview data if the preview has been fetched.
 */
export function getPreview( state, url ) {
	const preview = state.embedPreviews[ url ];

	if ( ! preview ) {
		return preview;
	}

	// this won't execute any scripts, so it's safe to check if the returned preview is just a single link
	const linkCheck = document.createElement( 'div' );
	linkCheck.innerHTML = preview.html;

	if ( 1 === linkCheck.children.length && 'A' === linkCheck.children[ 0 ].nodeName && 0 === linkCheck.children[ 0 ].children.length ) {
		// single link, no children, it's oEmbed being helpful and creating a link for us, not actually embedding content
		return false;
	}

	return preview;
}
