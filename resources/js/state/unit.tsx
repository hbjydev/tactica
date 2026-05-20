import { Unit } from '@/types/units';
import { createContext, useContext } from 'react';

export type UnitState = {
    currentUnit?: Unit;
};

const unitContext = createContext<UnitState>({});

export const UnitProvider = ({
    unit,
    children,
}: {
    unit: Unit;
    children: React.ReactNode;
}) => {
    return (
        <unitContext.Provider value={{ currentUnit: unit }}>
            {children}
        </unitContext.Provider>
    );
};

export const useUnit = () => {
    const context = useContext(unitContext);
    if (!context || !context.currentUnit) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context.currentUnit;
};
