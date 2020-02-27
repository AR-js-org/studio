import React from 'react';
import Button from '@material-ui/core/Button';
import { Translation } from 'react-i18next';

export default () => {
  return (
    <Translation>
      {(t, { i18n }) => (
        <>
          <Button onClick={() => i18n.changeLanguage('de-DE')}>Deutsch</Button>
          <Button onClick={() => i18n.changeLanguage('en-US')}>English (US)</Button>
          <Button onClick={() => i18n.changeLanguage('pt-BR')}>Portuguese (BR)</Button>
        </>
      )}
    </Translation>
  );
};
