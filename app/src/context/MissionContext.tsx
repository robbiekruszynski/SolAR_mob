import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nftCount: number;
}

interface MissionContextType {
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;
  showMissionDetails: boolean;
  setShowMissionDetails: (show: boolean) => void;
  isMissionActive: boolean;
  setIsMissionActive: (active: boolean) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const useMission = () => {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};

interface MissionProviderProps {
  children: ReactNode;
}

export const MissionProvider: React.FC<MissionProviderProps> = ({ children }) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showMissionDetails, setShowMissionDetails] = useState(false);
  const [isMissionActive, setIsMissionActive] = useState(false);

  return (
    <MissionContext.Provider
      value={{
        selectedMission,
        setSelectedMission,
        showMissionDetails,
        setShowMissionDetails,
        isMissionActive,
        setIsMissionActive,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}; 