/**
 * External dependencies
 */
import createSelector from 'rememo';
import { mapValues, compact, get } from 'lodash';

/**
 * Returns all the available block types.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Block Types.
 */
export const getBlockTypes = createSelector(
	( state ) => compact( Object.values( state.blockTypes ).map( ( { name } ) => getBlockType( state, name ) ) ),
	( state ) => [
		state.blockTypes,
		state.implementations,
	]
);

/**
 * Returns a block type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name Block type name.
 *
 * @return {Object?} Block Type.
 */
export const getBlockType = createSelector(
	( state, name ) => {
		const blockTypeDefinition = state.blockTypes[ name ];
		const blockTypeImplementation = state.implementations[ name ];

		if ( ! blockTypeDefinition || ! blockTypeImplementation ) {
			return null;
		}

		return {
			...blockTypeDefinition,
			...blockTypeImplementation,
			attributes: mapValues( blockTypeDefinition.attributes, ( attribute, key ) => {
				const implementationAttribute = get( blockTypeImplementation.attributes, [ key ], {} );
				return {
					...attribute,
					...implementationAttribute,
				};
			} ),
		};
	},
	( state ) => [
		state.blockTypes,
		state.implementations,
	]
);

/**
 * Returns all the available categories.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Categories list.
 */
export function getCategories( state ) {
	return state.categories;
}

/**
 * Returns the name of the default block name.
 *
 * @param {Object} state Data state.
 *
 * @return {string?} Default block name.
 */
export function getDefaultBlockName( state ) {
	return state.defaultBlockName;
}

/**
 * Returns the name of the fallback block name.
 *
 * @param {Object} state Data state.
 *
 * @return {string?} Fallback block name.
 */
export function getFallbackBlockName( state ) {
	return state.fallbackBlockName;
}
