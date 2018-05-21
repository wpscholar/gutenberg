/**
 * Internal dependencies
 */
import '../support/bootstrap';
import { clearLocalStorage, newPost, newDesktopBrowserPage, setDesktopViewPort, setMobileViewPort } from '../support/utils';

const SIDEBAR_SELECTOR = '.edit-post-sidebar';
const ACTIVE_SIDEBAR_TAB_SELECTOR = '.edit-post-sidebar__panel-tab.is-active';
const ACTIVE_SIDEBAR_BUTTON_TEXT = 'Document';

describe( 'Publishing', () => {
	beforeAll( async () => {
		await newDesktopBrowserPage();
	} );

	afterEach( async () => {
		await clearLocalStorage();
		await page.goto( 'about:blank' );
		await setDesktopViewPort();
	} );

	it( 'Should have sidebar visible at the start with document sidebar active on desktop', async () => {
		await newPost();
		const { nodesCount, content, height, width } = await page.$$eval( ACTIVE_SIDEBAR_TAB_SELECTOR, ( nodes ) => {
			const firstNode = nodes[ 0 ];
			return {
				nodesCount: nodes.length,
				content: firstNode.innerText,
				height: firstNode.offsetHeight,
				width: firstNode.offsetWidth,
			};
		} );

		// should have only one active sidebar tab.
		expect( nodesCount ).toBe( 1 );

		// the active sidebar tab should be document.
		expect( content ).toBe( ACTIVE_SIDEBAR_BUTTON_TEXT );

		// the active sidebar tab should be visible
		expect( width ).toBeGreaterThan( 10 );
		expect( height ).toBeGreaterThan( 10 );
	} );

	it( 'Should have the sidebar closed by default on mobile', async () => {
		await setMobileViewPort();
		await newPost();
		// the page was resized to mobile
		const width = await page.evaluate(
			() => {
				return window.innerWidth;
			}
		);
		expect( width ).toBeLessThan( 782 );
		const sidebar = await page.$( SIDEBAR_SELECTOR );
		expect( sidebar ).toBeNull();
	} );

	it( 'Should close the sidebar when resizing from desktop to mobile', async () => {
		await newPost();

		const sidebars = await page.$$( SIDEBAR_SELECTOR );
		expect( sidebars ).toHaveLength( 1 );

		await setMobileViewPort();

		const sidebarsMobile = await page.$$( SIDEBAR_SELECTOR );
		// sidebar should be closed when resizing to mobile.
		expect( sidebarsMobile ).toHaveLength( 0 );
	} );

	it( 'Should reopen sidebar the sidebar when resizing from mobile to desktop if the sidebar was closed automatically', async () => {
		await newPost();
		await setMobileViewPort();

		const sidebarsMobile = await page.$$( SIDEBAR_SELECTOR );
		expect( sidebarsMobile ).toHaveLength( 0 );

		await setDesktopViewPort();

		const sidebarsDesktop = await page.$$( SIDEBAR_SELECTOR );
		expect( sidebarsDesktop ).toHaveLength( 1 );
	} );
} );
