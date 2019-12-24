import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Roboto:400,500,700', 'sans-serif'],
  },
});

export const fontFamilySansSerif = [
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  'sans-serif',
].join(',');
