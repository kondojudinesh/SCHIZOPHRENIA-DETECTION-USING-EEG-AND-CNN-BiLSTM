import { createContext, useState, ReactNode } from 'react';

interface EEGContextProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  analysisResults: any | null;
  setAnalysisResults: (results: any | null) => void;
}

export const EEGContext = createContext<EEGContextProps>({
  selectedFile: null,
  setSelectedFile: () => {},
  analysisResults: null,
  setAnalysisResults: () => {},
});

export const EEGProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);

  return (
    <EEGContext.Provider value={{ selectedFile, setSelectedFile, analysisResults, setAnalysisResults }}>
      {children}
    </EEGContext.Provider>
  );
};

