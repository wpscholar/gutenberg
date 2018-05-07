/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/element';
import { withEditorSettings } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { getFontSize, getFontSizeClass, setFontSizeValue } from './utils';

/**
 * Higher-order component, which handles font size logic for class generation and value retrieval.
 *
 * @param {Function} mapGetSetFontSizeToProps Function that receives getFontSize, setFontSize, and props,
 *                                            and returns additional props to pass to the component.
 *
 * @return {Function} Higher-order component.
 */
export default ( mapGetSetFontSizeToProps ) => createHigherOrderComponent(
	withEditorSettings(
		( { fontSizes }, props ) => {
			const contextualGetFontSize = ( namedFontSize, customFontSize ) => {
				const fontSize = getFontSize( fontSizes, namedFontSize, customFontSize );
				return {
					...fontSize,
					class: getFontSizeClass( namedFontSize ),
				};
			};
			const contextualSetFontSize = ( fontSizeNameAttribute, customFontSizeAttribute, setAttributes ) => {
				return setFontSizeValue( fontSizes, fontSizeNameAttribute, customFontSizeAttribute, setAttributes );
			};
			return mapGetSetFontSizeToProps( contextualGetFontSize, contextualSetFontSize, props );
		} ),
	'withFontSizes'
);
