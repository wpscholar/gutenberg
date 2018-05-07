import {
	withEditorSettings,
} from '@wordpress/blocks';

import { FontSizePicker } from '@wordpress/components';
export default	withEditorSettings(
	( { fontSizes } ) => {
		return {
			fontSizes,
		};
	} )( FontSizePicker );
