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
import { getPreview } from '../resolvers';
import { receivePreview } from '../actions';

jest.mock( '@wordpress/api-request' );

describe( 'getPreview', () => {
	const SUCCESSFUL_EMBED_RESPONSE = { data: '<p>some html</p>' };
	const UNEMBEDDABLE_RESPONSE = false;
	const EMBEDDABLE_URL = 'http://twitter.com/notnownikki';
	const UNEMBEDDABLE_URL = 'http://example.com/';

	beforeAll( () => {
		apiRequest.mockImplementation( ( options ) => {
			if ( options.path === `/oembed/1.0/proxy?${ stringify( { url: EMBEDDABLE_URL } ) }` ) {
				return Promise.resolve( SUCCESSFUL_EMBED_RESPONSE );
			}
			throw 404;
		} );
	} );

	it( 'yields with fetched embed preview', async () => {
		const fulfillment = getPreview( {}, EMBEDDABLE_URL );
		const received = ( await fulfillment.next() ).value;
		expect( received ).toEqual( receivePreview( EMBEDDABLE_URL, SUCCESSFUL_EMBED_RESPONSE ) );
	} );

	it( 'yields false if the URL cannot be embedded', async () => {
		const fulfillment = getPreview( {}, UNEMBEDDABLE_URL );
		const received = ( await fulfillment.next() ).value;
		expect( received ).toEqual( receivePreview( UNEMBEDDABLE_URL, UNEMBEDDABLE_RESPONSE ) );
	} );
} );
