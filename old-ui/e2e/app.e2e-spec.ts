import { MicrodocsUiPage } from './app.po';

describe('microdocs-ui App', function() {
  let page: MicrodocsUiPage;

  beforeEach(() => {
    page = new MicrodocsUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
