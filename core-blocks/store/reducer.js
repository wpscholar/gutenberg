/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

export function embedPreviews( state = {}, action ) {
	switch ( action.type ) {
		case 'RECEIVE_EMBED_PREVIEW':
			const { url, preview } = action;
			return {
				...state,
				[ url ]: preview,
			};
	}
	return state;
}

export default combineReducers( {
	embedPreviews,
} );
