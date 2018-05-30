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
	receiveTerms,
	receiveUserQuery,
	receiveEntityRecords,
	receiveThemeSupportsFromIndex,
	receivePreview,
} from './actions';
import { getEntity } from './entities';

/**
 * Requests categories from the REST API, yielding action objects on request
 * progress.
 */
export async function* getCategories() {
	const categories = await apiRequest( { path: '/wp/v2/categories?per_page=-1' } );
	yield receiveTerms( 'categories', categories );
}

/**
 * Requests authors from the REST API.
 */
export async function* getAuthors() {
	const users = await apiRequest( { path: '/wp/v2/users/?who=authors&per_page=-1' } );
	yield receiveUserQuery( 'authors', users );
}

/**
 * Requests a entity's record from the REST API.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 * @param {number} key    Record's key
 */
export async function* getEntityRecord( state, kind, name, key ) {
	const entity = getEntity( kind, name );
	const record = await apiRequest( { path: `${ entity.baseUrl }/${ key }?context=edit` } );
	yield receiveEntityRecords( kind, name, record );
}

/**
 * Requests the entity's records from the REST API.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 */
export async function* getEntityRecords( state, kind, name ) {
	const entity = getEntity( kind, name );
	const records = await apiRequest( { path: `${ entity.baseUrl }?context=edit` } );
	yield receiveEntityRecords( kind, name, Object.values( records ) );
}

/**
 * Requests theme supports data from the index.
 */
export async function* getThemeSupports() {
	const index = await apiRequest( { path: '/' } );
	yield receiveThemeSupportsFromIndex( index );
}

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
