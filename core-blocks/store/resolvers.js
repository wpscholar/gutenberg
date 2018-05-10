/**
 * WordPress dependencies
 */
import apiRequest from '@wordpress/api-request';

/**
 * External dependencies
 */
import { stringify } from 'querystring';

/**
 * Internal dependencies
 */
import {
	receivePreview,
} from './actions';

/**
 * Requests a preview from the from the Embed API.
 *
 * @param {Object} state State tree
 * @param {string} url   URL to get the preview for.
 */
export async function* getPreview( state, url ) {
	try {
		const embedProxyResponse = await apiRequest( { path: `/oembed/1.0/proxy?${ stringify( { url } ) }` } );
		yield receivePreview( url, embedProxyResponse );
	} catch ( error ) {
		// Embed API 404s if the URL cannot be embedded, so we have to catch the error from the apiRequest here.
		yield receivePreview( url, false );
	}
}
