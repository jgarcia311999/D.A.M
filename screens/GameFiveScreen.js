import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Text } from 'react-native';
import CustomHeader from './components/CustomHeader';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const GameFiveScreen = ({ navigation }) => {
  const cubeRef = useRef();
  const cubeRef2 = useRef();
  const lastFaces = useRef([]);
  const [topFace, setTopFace] = useState(null);
  const [topFace2, setTopFace2] = useState(null);
  const [frase, setFrase] = useState('');
  const cameraRef = useRef();
  const lastPositionRef = useRef(new CANNON.Vec3(0, 1, 0.5));

  const loadTexture = async (image) => {
    const texture = new THREE.TextureLoader().load(image);
    return texture;
  };

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF4B7D1);
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const textures = [
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-four.png')) }), // right (+X)
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-one.png')) }),  // left (-X)
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-three.png')) }), // top (+Y)
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-six.png')) }),  // bottom (-Y)
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-five.png')) }), // front (+Z)
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('../assets/dice/dice-six-faces-two.png')) }),  // back (-Z)
    ];

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, textures);
    cube.scale.set(0.4, 0.4, 0.4);
    cube.position.set(0, 0.5, 0.5);
    scene.add(cube);
    cubeRef.current = cube;

    // Add second cube and body
    const cube2 = new THREE.Mesh(geometry.clone(), textures);
    cube2.scale.set(0.4, 0.4, 0.4);
    cube2.position.set(0.5, 0.5, 0.5);
    scene.add(cube2);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.set(0, 2.2, 3);
    camera.lookAt(0, 0.2, 0);

    // --- Cannon-es Physics Setup ---
    const world = new CANNON.World();
    world.gravity.set(0, -15, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    // Dice physics body
    const shape = new CANNON.Box(new CANNON.Vec3(0.2, 0.2, 0.2));
    const body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0, 1, 0.5),
      angularDamping: 0.05,
      linearDamping: 0.05,
    });
    world.addBody(body);
    cube.userData.physicsBody = body;

    // Add second cube's physics body after shape is declared
    const body2 = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0.5, 1, 0.5),
      angularDamping: 0.05,
      linearDamping: 0.05,
    });
    world.addBody(body2);
    cube2.userData.physicsBody = body2;
    cubeRef2.current = cube2;

    // Ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Side walls to contain the dice (left and right) with elastic bounce
    const sideWallMaterial = new CANNON.Material('sideWallMaterial');
    const contactMaterial = new CANNON.ContactMaterial(
      sideWallMaterial,
      sideWallMaterial,
      { restitution: 0.6 } // bounce effect
    );
    world.addContactMaterial(contactMaterial);

    const sideWallShape = new CANNON.Box(new CANNON.Vec3(0.1, 1, 1.5));

    const leftWall = new CANNON.Body({ mass: 0, material: sideWallMaterial });
    leftWall.addShape(sideWallShape);
    leftWall.position.set(-1.3, 1, 0.5);
    world.addBody(leftWall);

    const rightWall = new CANNON.Body({ mass: 0, material: sideWallMaterial });
    rightWall.addShape(sideWallShape);
    rightWall.position.set(1.3, 1, 0.5);
    world.addBody(rightWall);

    // Back wall (upper screen from camera view)
    const backWallShape = new CANNON.Box(new CANNON.Vec3(1.5, 1, 0.1));
    const backWall = new CANNON.Body({ mass: 0 });
    backWall.addShape(backWallShape);
    backWall.position.set(0, 1, -1);
    world.addBody(backWall);


    // Animation loop: sync cube with physics
    const animate = () => {
      requestAnimationFrame(animate);
      world.step(1 / 60);
      // Sync cube to physics
      cube.position.copy(body.position);
      cube.quaternion.copy(body.quaternion);

      if (cubeRef2.current && cubeRef2.current.userData.physicsBody) {
        const body2 = cubeRef2.current.userData.physicsBody;
        cubeRef2.current.position.copy(body2.position);
        cubeRef2.current.quaternion.copy(body2.quaternion);
      }

      // Keep dice within tray bounds (constrain only x-axis)
      const maxX = 1.2;
      if (body.position.x > maxX) {
        body.position.x = maxX;
        body.velocity.x *= -0.5;
      } else if (body.position.x < -maxX) {
        body.position.x = -maxX;
        body.velocity.x *= -0.5;
      }

      if (cubeRef2.current && cubeRef2.current.userData.physicsBody) {
        const body2 = cubeRef2.current.userData.physicsBody;
        if (body2.position.x > maxX) {
          body2.position.x = maxX;
          body2.velocity.x *= -0.5;
        } else if (body2.position.x < -maxX) {
          body2.position.x = -maxX;
          body2.velocity.x *= -0.5;
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  // Dice roll animation handler using cannon-es physics
  const handlePress = () => {
    const cube = cubeRef.current;
    if (!cube || !cube.userData.physicsBody) return;
    const body = cube.userData.physicsBody;

    // Reset camera position
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2.2, 3);
      cameraRef.current.lookAt(0, 0.2, 0);
    }

    // Reset state: always launch from zoomed-in center location
    body.velocity.setZero();
    body.angularVelocity.setZero();
    body.position.set(lastPositionRef.current.x, 1, lastPositionRef.current.z);
    body.quaternion.set(0, 0, 0, 1);

    // Mostly upward impulse with some randomness for spin and variation
    const force = new CANNON.Vec3(
      (Math.random() - 0.5) * 2,
      4 + Math.random() * 2,
      (Math.random() - 0.5) * 2
    );
    const torque = new CANNON.Vec3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    body.applyImpulse(force, body.position);
    body.angularVelocity.set(torque.x, torque.y, torque.z);

    // Add second die reset and impulse
    const body2 = cubeRef2.current.userData.physicsBody;
    body2.velocity.setZero();
    body2.angularVelocity.setZero();
    body2.position.set(lastPositionRef.current.x + 0.5, 1, lastPositionRef.current.z);
    body2.quaternion.set(0, 0, 0, 1);

    const force2 = new CANNON.Vec3(
      (Math.random() - 0.5) * 2,
      4 + Math.random() * 2,
      (Math.random() - 0.5) * 2
    );
    const torque2 = new CANNON.Vec3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    body2.applyImpulse(force2, body2.position);
    body2.angularVelocity.set(torque2.x, torque2.y, torque2.z);

    // Watch for rest state to determine face
    let settleTimer = 0;
    const interval = setInterval(() => {
      const velocity = body.velocity.length();
      const angular = body.angularVelocity.length();
      const velocity2 = body2.velocity.length();
      const angular2 = body2.angularVelocity.length();
      if (velocity < 0.05 && angular < 0.05 && velocity2 < 0.05 && angular2 < 0.05) {
        clearInterval(interval);

        // Face detection for die 1
        const up = new THREE.Vector3(0, 1, 0);
        const cube = cubeRef.current;
        const normals = [
          { face: 2, vector: new THREE.Vector3(0, 0, -1) },
          { face: 6, vector: new THREE.Vector3(0, -1, 0) },
          { face: 1, vector: new THREE.Vector3(-1, 0, 0) },
          { face: 4, vector: new THREE.Vector3(1, 0, 0) },
          { face: 3, vector: new THREE.Vector3(0, 1, 0) },
          { face: 5, vector: new THREE.Vector3(0, 0, 1) },
        ];

        let maxDot = -Infinity;
        let top = 1;

        normals.forEach(({ face, vector }) => {
          const worldNormal = vector.clone().applyQuaternion(cube.quaternion).normalize();
          const dot = worldNormal.dot(up);
          if (dot > maxDot) {
            maxDot = dot;
            top = face;
          }
        });

        setTopFace(top);
        lastPositionRef.current = body.position.clone();

        // Face detection for die 2
        const up2 = new THREE.Vector3(0, 1, 0);
        const cube2 = cubeRef2.current;
        const normals2 = [
          { face: 2, vector: new THREE.Vector3(0, 0, -1) },
          { face: 6, vector: new THREE.Vector3(0, -1, 0) },
          { face: 1, vector: new THREE.Vector3(-1, 0, 0) },
          { face: 4, vector: new THREE.Vector3(1, 0, 0) },
          { face: 3, vector: new THREE.Vector3(0, 1, 0) },
          { face: 5, vector: new THREE.Vector3(0, 0, 1) },
        ];
        let maxDot2 = -Infinity;
        let top2 = 1;
        normals2.forEach(({ face, vector }) => {
          const worldNormal2 = vector.clone().applyQuaternion(cube2.quaternion).normalize();
          const dot2 = worldNormal2.dot(up2);
          if (dot2 > maxDot2) {
            maxDot2 = dot2;
            top2 = face;
          }
        });
        setTopFace2(top2);

        const frases = {
          '1-1': 'Reparte 1',
          '1-2': 'Palabras que rimen',
          '1-3': 'Cascada',
          '1-4': 'Bebe el de tu derecha',
          '1-5': 'Pasa tu turno',
          '1-6': 'Bebe 2 y tira otra vez',
          '2-2': 'Cambio de sentido',
          '2-3': 'Bebe 1',
          '2-4': 'El siguiente no tira',
          '2-5': 'Bebe el de tu izquierda',
          '2-6': 'Categorías',
          '3-3': 'Rellena tu vaso',
          '3-4': 'Pasa tu turno',
          '3-5': 'Beben los solteros',
          '3-6': 'Bebe 2',
          '4-4': 'Reparte 2',
          '4-5': 'Categorías',
          '4-6': 'Bebe 3',
          '5-5': 'Bebe 1',
          '5-6': 'Reto',
          '6-6': 'Acaba tu vaso',
          '2-1': 'Palabras que rimen',
          '3-1': 'Cascada',
          '4-1': 'Bebe el de tu derecha',
          '5-1': 'Pasa tu turno',
          '6-1': 'Bebe 2 y tira otra vez',
          '3-2': 'Bebe 1',
          '4-2': 'El siguiente no tira',
          '5-2': 'Bebe el de tu izquierda',
          '6-2': 'Categorías',
          '4-3': 'Pasa tu turno',
          '5-3': 'Beben los solteros',
          '6-3': 'Bebe 2',
          '5-4': 'Categorías',
          '6-4': 'Bebe 3',
          '6-5': 'Reto',
        };

        const clave = [top, top2].sort((a, b) => a - b).join('-');
        setFrase(frases[clave] || 'Nada especial esta vez...');

        /*
        // Animate die to center and zoom camera in a combined animation, also rotate die upright
        const startCubePos = body.position.clone();
        const targetCubePos = new CANNON.Vec3(0, startCubePos.y, 0.5);
        const startCamPos = cameraRef.current.position.clone();
        const targetCamPos = new THREE.Vector3(0, 1.5, 1.5);
        // Quaternion interpolation for die upright
        const cube = cubeRef.current;
        const startQuat = cube.quaternion.clone();
        const endQuat = new THREE.Quaternion(0, 0, 0, 1); // upright
        let progress = 0;
        const combinedInterval = setInterval(() => {
          progress += 0.025;
          if (progress >= 1) {
            progress = 1;
            clearInterval(combinedInterval);
          }
          // Interpolate cube position
          body.position.x = THREE.MathUtils.lerp(startCubePos.x, targetCubePos.x, progress);
          body.position.z = THREE.MathUtils.lerp(startCubePos.z, targetCubePos.z, progress);
          // Interpolate camera position
          cameraRef.current.position.lerpVectors(startCamPos, targetCamPos, progress);
          cameraRef.current.lookAt(0, 0.2, 0);
          // Interpolate die rotation to upright
          THREE.Quaternion.slerp(startQuat, endQuat, cube.quaternion, progress);
          body.quaternion.copy(cube.quaternion);
        }, 16);
        */
      }
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        navigation={navigation}
        showBack={true}
        backTo="Inicio"
        showInfo={false}
      />
      <View style={{ position: 'absolute', top: 20, width: '100%', alignItems: 'center', zIndex: 10 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', fontFamily: 'Satoshi-Medium' }}>
          {topFace !== null && topFace2 !== null ? `Resultado: ${topFace} + ${topFace2} = ${topFace + topFace2}` : ''}
        </Text>
        {frase !== '' && (
          <Text style={{ fontSize: 18, marginTop: 5, fontFamily: 'Satoshi-Medium' }}>{frase}</Text>
        )}
      </View>
      <TouchableWithoutFeedback onPress={handlePress}>
        <GLView style={styles.glView} onContextCreate={onContextCreate} />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4B7D1',
  },
  glView: {
    flex: 1,
  },
});

export default GameFiveScreen;