import React from 'react';

import { Capture } from '../Capture';
import { View } from '../View';

import { GlobalStyle } from './styled';

export const App = () => {
  const query: { [key: string]: string } = window.location.search
    .slice(1)
    .split('&')
    .reduce((obj, item) => {
      const parts = item.split('=');
      return {
        ...obj,
        [parts[0]]: parts[1] || true,
      };
    }, {});

  return (
    <>
      <GlobalStyle />
      {query.type === 'CAPTURE' ? <Capture /> : <View />}
    </>
  );
};
