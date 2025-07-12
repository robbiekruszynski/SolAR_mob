import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

const { width, height } = Dimensions.get('window');

// 3D Background Component
const SpaceBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Directional light for depth */}
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      
      {/* Main rotating sphere */}
      <mesh ref={meshRef} position={[0, 0, -8]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Orbiting spheres */}
      <group ref={groupRef}>
        <mesh position={[-4, 2, -6]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#FF6B35" transparent opacity={0.7} />
        </mesh>
        
        <mesh position={[4, -2, -7]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>
        
        <mesh position={[0, 3, -5]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
        
        <mesh position={[-3, -1, -8]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#9C27B0" transparent opacity={0.5} />
        </mesh>
        
        <mesh position={[3, 1, -6]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#2196F3" transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            -10 - Math.random() * 10
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} />
        </mesh>
      ))}
    </>
  );
};

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state, connectWallet } = useApp();
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 3D Background */}
      <View style={styles.canvasContainer}>
        <Canvas
          style={styles.canvas}
          camera={{ position: [0, 0, 5], fov: 75 }}
        >
          <SpaceBackground />
        </Canvas>
      </View>
      
      {/* Content Overlay */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>SOL.AR FIELD</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Discover in the real world</Text>
        </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Ionicons name="trophy" size={24} color={colors.secondary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{state.discoveredTreasures.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Treasures Found</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Ionicons name="wallet" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{state.wallet.bonkBalance}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>BONK Earned</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Ionicons name="people" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {state.leaderboard.stats?.totalPlayers || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Players</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('User')}
        >
          <Ionicons name="wallet" size={32} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            {state.wallet.connected ? 'Manage Wallet' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('User')}
        >
          <Ionicons name="trophy" size={32} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>View Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('User')}
        >
          <Ionicons name="create" size={32} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Create NFTs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>How to Play</Text>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Walk around to find treasure locations</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="camera" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Use AR to scan and discover treasures</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="wallet" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Mint NFTs and earn BONK rewards</Text>
        </View>
      </View>
      </ScrollView>
    </View>
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
    zIndex: 0,
  },
  canvas: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
});

export default HomeScreen; 