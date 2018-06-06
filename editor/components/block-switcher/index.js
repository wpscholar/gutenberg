/**
 * External dependencies
 */
import { castArray, filter, first, mapKeys, sortBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown, Dashicon, IconButton, ifCondition, Toolbar, NavigableMenu } from '@wordpress/components';
import { getBlockType, getPossibleBlockTransformations, switchToBlockType } from '@wordpress/blocks';
import { compose } from '@wordpress/element';
import { keycodes } from '@wordpress/utils';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './style.scss';
import BlockIcon from '../block-icon';

/**
 * Module Constants
 */
const { DOWN } = keycodes;

export function BlockSwitcher( { blocks, onTransform, inserterItems } ) {
	const itemsByName = mapKeys( inserterItems, ( { name } ) => name );
	const possibleBlockTransformations = sortBy(
		filter(
			getPossibleBlockTransformations( blocks ),
			( block ) => !! itemsByName[ block.name ]
		),
		( block ) => -itemsByName[ block.name ].frecency,
	);

	if ( ! possibleBlockTransformations.length ) {
		return null;
	}

	const sourceBlockName = blocks[ 0 ].name;
	const blockType = getBlockType( sourceBlockName );

	return (
		<Dropdown
			className="editor-block-switcher"
			contentClassName="editor-block-switcher__popover"
			renderToggle={ ( { onToggle, isOpen } ) => {
				const openOnArrowDown = ( event ) => {
					if ( ! isOpen && event.keyCode === DOWN ) {
						event.preventDefault();
						event.stopPropagation();
						onToggle();
					}
				};
				const label = __( 'Change block type' );

				return (
					<Toolbar>
						<IconButton
							className="editor-block-switcher__toggle"
							icon={ <BlockIcon icon={ blockType.icon && blockType.icon.src } /> }
							onClick={ onToggle }
							aria-haspopup="true"
							aria-expanded={ isOpen }
							label={ label }
							tooltip={ label }
							onKeyDown={ openOnArrowDown }
						>
							<Dashicon icon="arrow-down" />
						</IconButton>
					</Toolbar>
				);
			} }
			renderContent={ ( { onClose } ) => (
				<div>
					<span
						className="editor-block-switcher__menu-title"
					>
						{ __( 'Transform into:' ) }
					</span>
					<NavigableMenu
						role="menu"
						aria-label={ __( 'Block types' ) }
					>
						{ possibleBlockTransformations.map( ( { name, title, icon } ) => (
							<IconButton
								key={ name }
								onClick={ () => {
									onTransform( blocks, name );
									onClose();
								} }
								className="editor-block-switcher__menu-item"
								icon={ (
									<span className="editor-block-switcher__block-icon">
										<BlockIcon icon={ icon && icon.src } />
									</span>
								) }
								role="menuitem"
							>
								{ title }
							</IconButton>
						) ) }
					</NavigableMenu>
				</div>
			) }
		/>
	);
}

export default compose(
	withSelect( ( select, { uids } ) => {
		const { getBlocksByUID, getBlockRootUID, getInserterItems } = select( 'core/editor' );
		const rootUID = getBlockRootUID( first( castArray( uids ) ) );
		return {
			blocks: getBlocksByUID( uids ),
			inserterItems: getInserterItems( rootUID ),
		};
	} ),
	ifCondition( ( { inserterItems } ) => inserterItems.length > 0 ),
	withDispatch( ( dispatch, ownProps ) => ( {
		onTransform( blocks, name ) {
			dispatch( 'core/editor' ).replaceBlocks(
				ownProps.uids,
				switchToBlockType( blocks, name )
			);
		},
	} ) ),
)( BlockSwitcher );
