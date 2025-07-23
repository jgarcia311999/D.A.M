import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import CustomHeader from './components/CustomHeader';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

const GameFiveScreen = ({ navigation }) => {
  const cubeRef = useRef();
  const lastFaces = useRef([]);

  const loadTexture = async (image) => {
    const texture = new THREE.TextureLoader().load(image);
    return texture;
  };

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const textures = [
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-one.png')) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-two.png')) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-three.png')) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-four.png')) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-five.png')) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-six.png')) }),
    ];

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, textures);
    cubeRef.current = cube;

    // Add ground plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    cube.position.set(0, 0.5, 0.5);
    cube.scale.set(0.4, 0.4, 0.4);

    scene.add(cube);
    camera.position.set(0, 2, 3);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      // No automatic rotation here to keep cube still when not rolling
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  // Dice roll animation handler
  const handlePress = () => {
    let newFace;
    const allFaces = [1, 2, 3, 4, 5, 6];
    if (lastFaces.current.length >= 3 && lastFaces.current.every(f => f === lastFaces.current[0])) {
      const remaining = allFaces.filter(f => f !== lastFaces.current[0]);
      newFace = remaining[Math.floor(Math.random() * remaining.length)];
    } else {
      newFace = allFaces[Math.floor(Math.random() * allFaces.length)];
    }
    lastFaces.current.push(newFace);
    if (lastFaces.current.length > 3) lastFaces.current.shift();

    const cube = cubeRef.current;
    if (!cube) return;

    const initialY = cube.position.y;
    const initialRotation = cube.rotation.clone();

    let frame = 0;
    const totalFrames = 30;
    const jumpHeight = 0.5;
    const spinX = (Math.random() < 0.5 ? 1 : -1) * (Math.PI / 2) * (Math.floor(Math.random() * 8) + 3);
    const spinY = (Math.random() < 0.5 ? 1 : -1) * (Math.PI / 2) * (Math.floor(Math.random() * 8) + 3);

    const animateRoll = () => {
      if (frame >= totalFrames) return;
      frame++;

      const t = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - t, 2); // smoother curve
      const progress = Math.sin(easeOut * Math.PI); // smoother jump arc

      cube.position.y = initialY + jumpHeight * progress;
      cube.rotation.x = initialRotation.x + spinX * t;
      cube.rotation.y = initialRotation.y + spinY * t;

      requestAnimationFrame(animateRoll);
    };

    animateRoll();
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        navigation={navigation}
        showBack={true}
        backTo="Inicio"
        showInfo={false}
      />
      <TouchableWithoutFeedback onPress={handlePress}>
        <GLView style={styles.glView} onContextCreate={onContextCreate} />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  glView: {
    flex: 1,
  },
});

export default GameFiveScreen;