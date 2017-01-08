import { ShopAppPage } from './app.po';

describe('shop-app App', function() {
  let page: ShopAppPage;

  beforeEach(() => {
    page = new ShopAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
