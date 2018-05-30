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
import { getCategories, getEntityRecord, getEntityRecords, getPreview } from '../resolvers';
import { receiveTerms, receiveEntityRecords, receivePreview } from '../actions';

jest.mock( '@wordpress/api-request' );

describe( 'getCategories', () => {
	const CATEGORIES = [ { id: 1 } ];

	beforeAll( () => {
		apiRequest.mockImplementation( ( options ) => {
			if ( options.path === '/wp/v2/categories?per_page=-1' ) {
				return Promise.resolve( CATEGORIES );
			}
		} );
	} );

	it( 'yields with requested terms', async () => {
		const fulfillment = getCategories();
		const received = ( await fulfillment.next() ).value;
		expect( received ).toEqual( receiveTerms( 'categories', CATEGORIES ) );
	} );
} );

describe( 'getEntityRecord', () => {
	const POST_TYPE = { slug: 'post' };

	beforeAll( () => {
		apiRequest.mockImplementation( ( options ) => {
			if ( options.path === '/wp/v2/types/post?context=edit' ) {
				return Promise.resolve( POST_TYPE );
			}
		} );
	} );

	it( 'yields with requested post type', async () => {
		const fulfillment = getEntityRecord( {}, 'root', 'postType', 'post' );
		const received = ( await fulfillment.next() ).value;
		expect( received ).toEqual( receiveEntityRecords( 'root', 'postType', POST_TYPE ) );
	} );
} );

describe( 'getEntityRecords', () => {
	const POST_TYPES = {
		post: { slug: 'post' },
		page: { slug: 'page' },
	};

	beforeAll( () => {
		apiRequest.mockImplementation( ( options ) => {
			if ( options.path === '/wp/v2/types?context=edit' ) {
				return Promise.resolve( POST_TYPES );
			}
		} );
	} );

	it( 'yields with requested post type', async () => {
		const fulfillment = getEntityRecords( {}, 'root', 'postType' );
		const received = ( await fulfillment.next() ).value;
		expect( received ).toEqual( receiveEntityRecords( 'root', 'postType', Object.values( POST_TYPES ) ) );
	} );
} );

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
