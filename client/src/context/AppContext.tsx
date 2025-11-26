import React, { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  analysisResult: any | null;
  setAnalysisResult: (result: any | null) => void;
  eegStreamData: any[];
  setEegStreamData: (data: any[]) => void;
}

export const AppContext = createContext<AppContextProps>({
  selectedFile: null,
  setSelectedFile: () => {},
  analysisResult: null,
  setAnalysisResult: () => {},
  eegStreamData: [],
  setEegStreamData: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [eegStreamData, setEegStreamData] = useState<any[]>([]);

  return (
    <AppContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        analysisResult,
        setAnalysisResult,
        eegStreamData,
        setEegStreamData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
