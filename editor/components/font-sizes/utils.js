/**
 * External dependencies
 */
import { find, kebabCase } from 'lodash';

/**
 *  Returns the font size object based on an array of named font sizes and the namedFontSize and customFontSize values.
 * 	If namedFontSize is undefined or not found in fontSizes an object with just the size value based on customFontSize is returned.
 *
 * @param {Array}   fontSizes      Array of font size objects containing at least the "name" and "size" values as properties.
 * @param {?string} namedFontSize  A string containing the font size name.
 * @param {?number} customFontSize A number containing the customFontSize value.
 *
 * @return {?string} If namedFontSize is passed and the name is found in fontSizes it returns the font size object for that name.
 * 					 Otherwise, an object with just the size value based on customFontSize is returned.
 */
export const getFontSize = ( fontSizes, namedFontSize, customFontSize ) => {
	if ( namedFontSize ) {
		const fontSizeObj = find( fontSizes, { name: namedFontSize } );
		if ( fontSizeObj ) {
			return fontSizeObj;
		}
	}
	if ( customFontSize ) {
		return {
			size: customFontSize,
		};
	}
};

/**
 * Returns a function that receives the font size value and sets it using the attribute for named font sizes or for custom font sizes.
 *
 * @param {Array}  fontSizes                   Array of fontSize objects containing at least the "name" and "size" values as properties.
 * @param {string} fontSizeAttributeName       Name of the attribute where named font sizes are stored.
 * @param {string} customFontSizeAttributeName Name of the attribute where custom font sizes are stored.
 * @param {string} setAttributes               A function that receives an object with the attributes to set.
 *
 * @return {function} A function that receives the font size value and sets the attributes necessary to correctly store it.
 */
export const setFontSizeValue = ( fontSizes, fontSizeAttributeName, customFontSizeAttributeName, setAttributes ) =>
	( fontSizeValue ) => {
		const fontSizeObj = find( fontSizes, { size: fontSizeValue } );
		setAttributes( {
			[ fontSizeAttributeName ]: fontSizeObj && fontSizeObj.name ? fontSizeObj.name : undefined,
			[ customFontSizeAttributeName ]: fontSizeObj && fontSizeObj.name ? undefined : fontSizeValue,
		} );
	};

/**
 * Returns a class based on fontSizeName.
 *
 * @param {string} fontSizeName Name of the fontSize.
 *
 * @return {string} String with the class corresponding to the fontSize passed.
 */
export function getFontSizeClass( fontSizeName ) {
	if ( ! fontSizeName ) {
		return;
	}

	return `has-${ kebabCase( fontSizeName ) }-font-size`;
}
