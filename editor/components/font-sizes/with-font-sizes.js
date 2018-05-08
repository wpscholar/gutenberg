/**
 * External dependencies
 */
import { get, upperFirst } from 'lodash';

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, Component, compose } from '@wordpress/element';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getFontSize, getFontSizeClass, setFontSizeValue } from './utils';

const DEFAULT_FONT_SIZES = [];

/**
 * Higher-order component, which handles font size logic for class generation and value retrieval.
 *
 * @param {string} namedFontSizeAttribute  Name of the attribute where named font sizes are stored.
 * @param {string} customFontSizeAttribute Name of the attribute where custom font sizes are stored.
 *
 * @return {Function} Higher-order component.
 */
export default ( namedFontSizeAttribute, customFontSizeAttribute ) => createHigherOrderComponent(
	compose( [
		withSelect(
			( select ) => {
				const settings = select( 'core/editor' ).getEditorSettings();
				return {
					fontSizes: get( settings, [ 'fontSizes' ], DEFAULT_FONT_SIZES ),
				};
			} ),
		( WrappedComponent ) => {
			return class extends Component {
				constructor( props ) {
					super( props );
					this.state = {};
				}

				static getDerivedStateFromProps( { attributes, fontSizes, setAttributes }, prevState ) {
					const fontSizeName = attributes[ namedFontSizeAttribute ];
					const customFontSize = attributes[ customFontSizeAttribute ];
					if (
						fontSizeName === prevState.fontSizeName &&
						customFontSize === prevState.customFontSize &&
						fontSizes === prevState.fontSizes &&
						setAttributes === prevState.setAttributes
					) {
						return null;
					}

					const fontSizeObject = {
						...getFontSize( fontSizes, fontSizeName, customFontSize ),
						class: getFontSizeClass( fontSizeName ),
					};

					const fontSizeSetter = setFontSizeValue( fontSizes, namedFontSizeAttribute, customFontSizeAttribute, setAttributes );

					return {
						fontSizeName,
						customFontSize,
						fontSizes,
						setAttributes,
						mergeProps: {
							[ namedFontSizeAttribute ]: fontSizeObject,
							[ 'set' + upperFirst( namedFontSizeAttribute ) ]: fontSizeSetter,
						},
					};
				}

				render() {
					return (
						<WrappedComponent
							{ ...{
								...this.props,
								fontSizes: undefined,
								...this.state.mergeProps,
							} }
						/>
					);
				}
			};
		},
	] ),
	'withFontSizes'
);
