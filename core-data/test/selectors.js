/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { getTerms, isRequestingCategories, getEntityRecord, getEntityRecords, getPreview } from '../selectors';
import { select } from '@wordpress/data';

jest.mock( '@wordpress/data', () => ( {
	...require.requireActual( '@wordpress/data' ),
	select: jest.fn().mockReturnValue( {} ),
} ) );

describe( 'getTerms()', () => {
	it( 'returns value of terms by taxonomy', () => {
		let state = deepFreeze( {
			terms: {},
		} );
		expect( getTerms( state, 'categories' ) ).toBe( undefined );

		state = deepFreeze( {
			terms: {
				categories: [ { id: 1 } ],
			},
		} );
		expect( getTerms( state, 'categories' ) ).toEqual( [ { id: 1 } ] );
	} );
} );

describe( 'isRequestingCategories()', () => {
	beforeAll( () => {
		select( 'core/data' ).isResolving = jest.fn().mockReturnValue( false );
	} );

	afterAll( () => {
		select( 'core/data' ).isResolving.mockRestore();
	} );

	function setIsResolving( isResolving ) {
		select( 'core/data' ).isResolving.mockImplementation(
			( reducerKey, selectorName ) => (
				isResolving &&
				reducerKey === 'core' &&
				selectorName === 'getCategories'
			)
		);
	}

	it( 'returns false if never requested', () => {
		const result = isRequestingCategories();
		expect( result ).toBe( false );
	} );

	it( 'returns false if categories resolution finished', () => {
		setIsResolving( false );
		const result = isRequestingCategories();
		expect( result ).toBe( false );
	} );

	it( 'returns true if categories resolution started', () => {
		setIsResolving( true );
		const result = isRequestingCategories();
		expect( result ).toBe( true );
	} );
} );

describe( 'getEntityRecord', () => {
	it( 'should return undefined for unknown record\'s key', () => {
		const state = deepFreeze( {
			entities: {
				root: {
					postType: {
						byKey: {},
					},
				},
			},
		} );
		expect( getEntityRecord( state, 'root', 'postType', 'post' ) ).toBe( undefined );
	} );

	it( 'should return a record by key', () => {
		const state = deepFreeze( {
			entities: {
				root: {
					postType: {
						byKey: {
							post: { slug: 'post' },
						},
					},
				},
			},
		} );
		expect( getEntityRecord( state, 'root', 'postType', 'post' ) ).toEqual( { slug: 'post' } );
	} );
} );

describe( 'getEntityRecords', () => {
	it( 'should return an empty array by default', () => {
		const state = deepFreeze( {
			entities: {
				root: {
					postType: {
						byKey: {},
					},
				},
			},
		} );
		expect( getEntityRecords( state, 'root', 'postType' ) ).toEqual( [] );
	} );

	it( 'should return all the records', () => {
		const state = deepFreeze( {
			entities: {
				root: {
					postType: {
						byKey: {
							post: { slug: 'post' },
							page: { slug: 'page' },
						},
					},
				},
			},
		} );
		expect( getEntityRecords( state, 'root', 'postType' ) ).toEqual( [
			{ slug: 'post' },
			{ slug: 'page' },
		] );
	} );
} );

describe( 'getPreview()', () => {
	it( 'returns preview stored for url', () => {
		let state = deepFreeze( {
			embedPreviews: {},
		} );
		expect( getPreview( state, 'http://example.com/' ) ).toBe( undefined );

		state = deepFreeze( {
			embedPreviews: {
				'http://example.com/': { data: 42 },
			},
		} );
		expect( getPreview( state, 'http://example.com/' ) ).toEqual( { data: 42 } );
	} );

	it( 'returns false if the preview html is just a single link', () => {
		const state = deepFreeze( {
			embedPreviews: {
				'http://example.com/': { html: '<a href="http://example.com/">http://example.com/</a>' },
			},
		} );
		expect( getPreview( state, 'http://example.com/' ) ).toEqual( false );
	} );
} );
