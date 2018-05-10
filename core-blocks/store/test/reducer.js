/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { embedPreviews } from '../reducer';

describe( 'embedPreviews()', () => {
	it( 'returns an empty object by default', () => {
		const state = embedPreviews( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	it( 'returns with received preview', () => {
		const originalState = deepFreeze( {} );
		const state = embedPreviews( originalState, {
			type: 'RECEIVE_EMBED_PREVIEW',
			url: 'http://twitter.com/notnownikki',
			preview: { data: 42 },
		} );

		expect( state ).toEqual( {
			'http://twitter.com/notnownikki': { data: 42 },
		} );
	} );
} );
