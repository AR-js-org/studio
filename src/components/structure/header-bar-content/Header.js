import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import HeaderContent from '../../header/HeaderContent.js';

const HeaderBox = withStyles(theme => ({
  root: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    height: '4.3rem',
    zIndex: '10',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))(Box);

export default props => {
  return (
    <HeaderBox>
      <HeaderContent />
    </HeaderBox>
  );
};
