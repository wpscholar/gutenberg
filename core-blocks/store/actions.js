/**
 * Returns an action object used in signalling that the preview data for
 * a given URl has been received.
 *
 * @param {string}  url      URL to preview the embed for.
 * @param {Mixed}   preview  Preview data.
 *
 * @return {Object} Action object.
 */
export function receivePreview( url, preview ) {
	return {
		type: 'RECEIVE_EMBED_PREVIEW',
		url,
		preview,
	};
}
