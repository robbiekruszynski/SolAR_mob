import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMission } from '../context/MissionContext';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { selectedMission, setShowMissionDetails, setIsMissionActive } = useMission();

  const handleCameraPress = () => {
    const currentRoute = state.routes[state.index];
    
    if (currentRoute.name === 'Explore') {
      // If we're on the Explore tab, handle the camera button logic
      if (selectedMission) {
        // If mission is selected, show details or start camera
        setShowMissionDetails(true);
      }
      // If no mission selected, the ARHuntingScreen will handle it
    } else {
      // Navigate to Explore tab
      navigation.navigate('Explore');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name) as string;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Explore') {
          iconName = isFocused ? 'camera' : 'camera-outline';
        } else if (route.name === 'User') {
          iconName = isFocused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        // Special styling for camera button
        if (route.name === 'Explore') {
          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.cameraButton,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                }
              ]}
              onPress={handleCameraPress}
              activeOpacity={0.7}
            >
              <Ionicons name={iconName} size={28} color="#FFFFFF" />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isFocused ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.label,
              { color: isFocused ? colors.primary : colors.textSecondary }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default CustomTabBar; 