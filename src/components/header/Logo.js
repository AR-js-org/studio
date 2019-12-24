import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  logoLink: {
    textDecoration: 'none',
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <Link to="/" className={classes.logoLink}>
      <Typography variant="h1">AR.js Studio</Typography>
    </Link>
  );
};
