import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Supervisor, SupervisorPermissions } from '../types';

const initialSupervisors: Supervisor[] = [
  {
    userId: '1',
    permissions: { canDeletePost: true, canTogglePostStatus: true, canBanUser: false },
  },
  {
    userId: '2',
    permissions: { canDeletePost: true, canTogglePostStatus: false, canBanUser: false },
  },
];

interface SupervisorsContextType {
  supervisors: Supervisor[];
  isSupervisor: (userId: string) => boolean;
  getSupervisor: (userId: string) => Supervisor | undefined;
  addSupervisor: (userId: string) => void;
  removeSupervisor: (userId: string) => void;
  updateSupervisorPermissions: (userId: string, permissions: Partial<SupervisorPermissions>) => void;
}

const SupervisorsContext = createContext<SupervisorsContextType | undefined>(undefined);

export const SupervisorsProvider = ({ children }: { children: ReactNode }) => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);

  const isSupervisor = useCallback((userId: string) => {
    return supervisors.some(s => s.userId === userId);
  }, [supervisors]);

  const getSupervisor = useCallback((userId: string) => {
    return supervisors.find(s => s.userId === userId);
  }, [supervisors]);

  const addSupervisor = useCallback((userId: string) => {
    if (isSupervisor(userId)) return;
    const newSupervisor: Supervisor = {
      userId,
      permissions: { canDeletePost: false, canTogglePostStatus: false, canBanUser: false },
    };
    setSupervisors(prev => [...prev, newSupervisor]);
  }, [isSupervisor]);

  const removeSupervisor = useCallback((userId: string) => {
    setSupervisors(prev => prev.filter(s => s.userId !== userId));
  }, []);

  const updateSupervisorPermissions = useCallback((userId: string, newPermissions: Partial<SupervisorPermissions>) => {
    setSupervisors(prev =>
      prev.map(s =>
        s.userId === userId
          ? { ...s, permissions: { ...s.permissions, ...newPermissions } }
          : s
      )
    );
  }, []);

  const value = useMemo(() => ({
    supervisors,
    isSupervisor,
    getSupervisor,
    addSupervisor,
    removeSupervisor,
    updateSupervisorPermissions,
  }), [supervisors, isSupervisor, getSupervisor, addSupervisor, removeSupervisor, updateSupervisorPermissions]);

  return (
    <SupervisorsContext.Provider value={value}>
      {children}
    </SupervisorsContext.Provider>
  );
};

export const useSupervisors = () => {
  const context = useContext(SupervisorsContext);
  if (context === undefined) {
    throw new Error('useSupervisors must be used within a SupervisorsProvider');
  }
  return context;
};
