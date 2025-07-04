import React, { useState } from 'react';
import MiniGame3ModeSelector from './MiniGame3ModeSelector';
import MiniGame3CreateJoin from './MiniGame3CreateJoin';
import MiniGame3Room from './MiniGame3Room';
import MiniGame3 from './MiniGame3'; // modo local

export default function MiniGame3Root({ navigation, route }) {
  const [mode, setMode] = useState(null); // 'local' | 'online'
  const [step, setStep] = useState(0); // 0: elige modo, 1: crea/unirse, 2: sala online
  const [salaInfo, setSalaInfo] = useState(null);

  // Cambia entre pantallas según el estado
  if (mode === 'local') {
    return <MiniGame3 navigation={navigation} route={route} />;
  }
  if (mode === 'online' && step === 0) {
    return (
      <MiniGame3CreateJoin
        navigation={navigation}
        setSalaInfo={setSalaInfo}
        setStep={setStep}
        route={route}
      />
    );
  }
  if (mode === 'online' && step === 1 && salaInfo) {
    return (
      <MiniGame3Room
        navigation={navigation}
        salaInfo={salaInfo}
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