import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Translation } from 'react-i18next';

import Header from '../../structure/header-bar-content/Header.js';
import ContentBox from '../../structure/header-bar-content/ContentBox.js';

export default props => {
  return (
    <>
      <Header />
      <Translation>
        {t => (
          <ContentBox>
            <Typography variant="h2">{t('common:Augmented Reality in the browser!')}</Typography>
            <p>TODO</p>
          </ContentBox>
        )}
      </Translation>
    </>
  );
};
