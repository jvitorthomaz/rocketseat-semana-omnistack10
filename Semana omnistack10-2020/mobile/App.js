import React from 'react';
import { StatusBar, YellowBox } from 'react-native';

import Routes from './src/routes';

//para ignorar os avisos que aparecem na tela
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

export default function App() {
  return (
    //para que todas as rotas fiquem com a stausbar branca
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Routes />
    </>
  );
}
