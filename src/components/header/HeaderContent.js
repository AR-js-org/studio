import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Logo from './Logo.js';
import LanguageSelector from './LanguageSelector.js';

const RowBox = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
}))(Box);

export default () => {
  return (
    <>
      <RowBox ml="2.5rem">
        <Logo />
      </RowBox>
      <RowBox ml="auto" mr="2.5rem">
        <LanguageSelector />
      </RowBox>
    </>
  );
};
