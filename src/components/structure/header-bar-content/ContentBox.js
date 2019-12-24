import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const ContentBoxOuter = withStyles(theme => ({
  root: {
    position: 'absolute',
    top: '4.3rem',
    right: '0',
    bottom: '0',
    left: '0',
    height: 'calc(100vh - 4.3rem)',
  },
}))(Box);

const ContentBoxInner = withStyles(theme => ({
  root: {
    height: '100%',
    overflowY: 'auto',
    padding: '1rem 7rem 0rem 7rem',
  },
}))(Box);

export default props => {
  return (
    <ContentBoxOuter>
      <ContentBoxInner>{props.children}</ContentBoxInner>
    </ContentBoxOuter>
  );
};
