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
  const cameraRef = useRef();
  const lastPositionRef = useRef(new CANNON.Vec3(0, 1, 0.5));

  const loadTexture = async (image) => {
    const texture = new THREE.TextureLoader().load(image);
    return texture;
  };

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffe4e1); // pastel pink
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

    const cube2 = new THREE.Mesh(geometry.clone(), textures);
    cube2.scale.set(0.4, 0.4, 0.4);
    cube2.position.set(0.5, 0.5, 0.5);
    scene.add(cube2);
    cubeRef2.current = cube2;

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

    const body2 = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0.5, 1, 0.5),
      angularDamping: 0.05,
      linearDamping: 0.05,
    });
    world.addBody(body2);
    cube2.userData.physicsBody = body2;

    // Ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Side walls to contain the dice (left and right)
    const sideWallShape = new CANNON.Box(new CANNON.Vec3(0.1, 1, 1.5));
    const leftWall = new CANNON.Body({ mass: 0 });
    leftWall.addShape(sideWallShape);
    leftWall.position.set(-1.3, 1, 0.5);
    world.addBody(leftWall);

    const rightWall = new CANNON.Body({ mass: 0 });
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

      cube2.position.copy(body2.position);
      cube2.quaternion.copy(body2.quaternion);

      // Keep dice within tray bounds (constrain only x-axis)
      const maxX = 1.2;
      if (body.position.x > maxX) {
        body.position.x = maxX;
        body.velocity.x *= -0.5;
      } else if (body.position.x < -maxX) {
        body.position.x = -maxX;
        body.velocity.x *= -0.5;
      }

      if (body2.position.x > maxX) {
        body2.position.x = maxX;
        body2.velocity.x *= -0.5;
      } else if (body2.position.x < -maxX) {
        body2.position.x = -maxX;
        body2.velocity.x *= -0.5;
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

    const cube2 = cubeRef2.current;
    if (!cube2 || !cube2.userData.physicsBody) return;
    const body2 = cube2.userData.physicsBody;

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

    body2.velocity.setZero();
    body2.angularVelocity.setZero();
    body2.position.set(lastPositionRef.current.x + 0.5, 1, lastPositionRef.current.z);
    body2.quaternion.set(0, 0, 0, 1);

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

        // Face detection
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

        // Detect second die result
        const up2 = new THREE.Vector3(0, 1, 0);
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
          const worldNormal2 = vector.clone().applyQuaternion(cubeRef2.current.quaternion).normalize();
          const dot2 = worldNormal2.dot(up2);
          if (dot2 > maxDot2) {
            maxDot2 = dot2;
            top2 = face;
          }
        });
        setTopFace2(top2);

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
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
          {topFace !== null && topFace2 !== null ? `Resultado: ${topFace} + ${topFace2} = ${topFace + topFace2}` : ''}
        </Text>
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
    backgroundColor: '#fff',
  },
  glView: {
    flex: 1,
  },
});

export default GameFiveScreen;