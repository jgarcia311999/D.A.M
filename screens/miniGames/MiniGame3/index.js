import React, { useState } from 'react';
import MiniGame3ModeSelector from './MiniGame3ModeSelector';
import MiniGame3CreateJoin from './MiniGame3CreateJoin';
import MiniGame3Room from './MiniGame3Room';
import MiniGame3 from './MiniGame3'; 
import MiniJuego3Online from './MiniJuego3Online';

export default function MiniGame3Root({ navigation, route }) {
  const [mode, setMode] = useState(null); // 'local' | 'online'
  const [step, setStep] = useState(0); // 0: selector, 1: crear/unir, 2: sala room, 3: juego online
  const [salaInfo, setSalaInfo] = useState(null);

  // Renderizado según el estado
  if (mode === 'local') {
    return <MiniGame3 navigation={navigation} route={route} />;
  }

  if (mode === 'online' && step === 0) {
    return (
      <MiniGame3CreateJoin
        setSalaInfo={setSalaInfo}
        setStep={setStep}
        navigation={navigation}
        route={route}
      />
    );
  }

  if (mode === 'online' && step === 1 && salaInfo) {
    return (
      <MiniGame3Room
        salaInfo={salaInfo}
        navigation={navigation}
        setStep={setStep}
        route={route}
        goToOnlineGame={() => setStep(3)}
      />
    );
  }

  if (mode === 'online' && step === 3 && salaInfo) {
    return (
      <MiniJuego3Online
        salaCode={salaInfo.code}
        navigation={navigation}
        route={route}
      />
    );
  }

  // Pantalla de selección de modo
  return (
    <MiniGame3ModeSelector
      setMode={setMode}
      navigation={navigation}
      route={route}
    />
  );
}