import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Simple 3D Background Component with Interactive Blob Shapes
const AnimatedBackground: React.FC<{ rotationX: number; rotationY: number }> = ({ 
  rotationX, 
  rotationY
}) => {
  const mainBlobRef = useRef<THREE.Mesh>(null);
  const secondaryBlobRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mainBlobRef.current) {
      mainBlobRef.current.rotation.x = rotationX + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      mainBlobRef.current.rotation.y = rotationY + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    
    if (secondaryBlobRef.current) {
      secondaryBlobRef.current.rotation.x = rotationX * 0.7 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      secondaryBlobRef.current.rotation.y = rotationY * 0.7 + Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* Main Large Blob */}
      <mesh
        ref={mainBlobRef}
        position={[0, 0, -5]}
      >
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          color="#4A4A6A" 
          transparent 
          opacity={0.9}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>
      
      {/* Secondary Blob */}
      <mesh 
        ref={secondaryBlobRef}
        position={[-3, 2, -4]}
      >
        <dodecahedronGeometry args={[2]} />
        <meshStandardMaterial 
          color="#6A4A6A" 
          transparent 
          opacity={0.8}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Floating Elements */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            -8 - Math.random() * 10
          ]}
          rotation={[
            rotationX * 0.2 + Math.sin(i * 0.5) * 0.1,
            rotationY * 0.2 + Math.cos(i * 0.3) * 0.1,
            0
          ]}
        >
          <icosahedronGeometry args={[0.8 + Math.random() * 0.8]} />
          <meshStandardMaterial 
            color={i % 3 === 0 ? "#4A4A6A" : i % 3 === 1 ? "#6A4A6A" : "#4A6A6A"} 
            transparent 
            opacity={0.7 + Math.random() * 0.3}
            roughness={0.4 + Math.random() * 0.3}
            metalness={0.3 + Math.random() * 0.3}
          />
        </mesh>
      ))}
      
      {/* Particle Field */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            -12 - Math.random() * 15
          ]}
          rotation={[
            rotationX * 0.05 + Math.sin(i * 0.1) * 0.02,
            rotationY * 0.05 + Math.cos(i * 0.08) * 0.02,
            0
          ]}
        >
          <sphereGeometry args={[0.1 + Math.random() * 0.2, 8, 8]} />
          <meshStandardMaterial 
            color={i % 4 === 0 ? "#FF6B35" : i % 4 === 1 ? "#9C27B0" : i % 4 === 2 ? "#2196F3" : "#4CAF50"} 
            transparent 
            opacity={0.6 + Math.random() * 0.4}
          />
        </mesh>
      ))}
      
      {/* Fog Effect */}
      <fog attach="fog" args={['#2A2A2A', 8, 25]} />
    </>
  );
};

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { colors, setTheme } = useTheme();
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  // Set dark mode by default
  React.useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  const handleEnter = () => {
    navigation.replace('MainApp');
  };

  const onGestureEvent = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    
    // Responsive gesture controls
    setRotationY(prev => prev + translationX * 0.01);
    setRotationX(prev => prev - translationY * 0.01);
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      // Add momentum effect
      const { velocityX, velocityY } = event.nativeEvent;
      if (Math.abs(velocityX) > 50 || Math.abs(velocityY) > 50) {
        setRotationY(prev => prev + velocityX * 0.0005);
        setRotationX(prev => prev - velocityY * 0.0005);
      }
    }
  };

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: '#2A2A2A' }]}>
      {/* 3D Background */}
      <View style={styles.canvasContainer}>
        <Canvas
          style={styles.canvas}
          camera={{ position: [0, 0, 10], fov: 60 }}
          gl={{ antialias: true }}
        >
          <AnimatedBackground 
            rotationX={rotationX}
            rotationY={rotationY}
          />
        </Canvas>
      </View>
      
      {/* Touch Gesture Handler - Full screen */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <View style={styles.gestureArea} />
      </PanGestureHandler>
      
      {/* Content Overlay - Always on top */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          SOL.AR FIELD
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Augmented Reality Treasure Exploration
        </Text>
        
        <TouchableOpacity
          style={[styles.enterButton, { backgroundColor: colors.primary }]}
          onPress={handleEnter}
          activeOpacity={0.8}
        >
          <Text style={[styles.enterButtonText, { color: colors.text }]}>
            ENTER
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  canvas: {
    flex: 1,
  },
  gestureArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  enterButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  enterButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen; 