/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';

import { FontSizePicker } from '@wordpress/components';
export default withSelect(
	( select ) => {
		const { fontSizes } = select( 'core/editor' ).getEditorSettings();
		return {
			fontSizes,
		};
	}
)( FontSizePicker );
