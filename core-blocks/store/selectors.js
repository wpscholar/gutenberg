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

	const oEmbedLinkCheck = '<a href="' + url + '">' + url + '</a>';

	if ( oEmbedLinkCheck === preview.html ) {
		// just a link to the url, it's oEmbed being helpful and creating a link for us, not actually embedding content
		return false;
	}

	return preview;
}
