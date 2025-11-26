import React, { useState, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import axios from "axios";
import ResultsDisplay from "./ResultsDisplay";
import LoadingAnimation from "./LoadingAnimation";
import { AppContext } from "../context/AppContext";

interface AIReport {
  severity: string;
  treatment?: string[];
  lifestyle?: string[];
  follow_up?: string[];
  disclaimer?: string;
}

interface AnalysisResult {
  prediction: string;
  confidence: number;
  heatmap?: string;
  explanation?: string;
  ai_report: AIReport;
}

const UploadSection: React.FC = () => {
  const {
    selectedFile,
    setSelectedFile,
    analysisResult,
    setAnalysisResult,
  } = useContext(AppContext);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const acceptedFormats = [".edf", ".csv", ".mat", ".eea"];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setError(null);
      setAnalysisResult(null); // clear old results when uploading new file
    } else {
      setError("Please upload a valid EEG file (.edf, .csv, .mat, .eea)");
    }
  }, [setSelectedFile, setAnalysisResult]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setError(null);
      setAnalysisResult(null);
    } else {
      setError("Please upload a valid EEG file (.edf, .csv, .mat, .eea)");
    }
  };

  const isValidFile = (file: File) => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    return acceptedFormats.includes(extension);
  };

  const analyzeEEG = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(progress);
        },
      });

      setAnalysisResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to analyze EEG data. Please ensure the backend is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="min-h-screen py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upload EEG Data for Analysis
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your EEG files to get instant AI-powered analysis with detailed
            explanations and medical recommendations.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <input
                type="file"
                id="eeg-file"
                accept=".edf,.csv,.mat,.eea"
                onChange={handleFileSelect}
                className="hidden"
              />

              <motion.div
                animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Drop your EEG file here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or{" "}
                    <label
                      htmlFor="eeg-file"
                      className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                    >
                      browse to upload
                    </label>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supported formats: {acceptedFormats.join(", ")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Selected File Display */}
            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.button
              onClick={analyzeEEG}
              disabled={!selectedFile || isAnalyzing}
              className={`w-full mt-6 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                selectedFile && !isAnalyzing
                  ? "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg transform hover:scale-105"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              whileHover={selectedFile && !isAnalyzing ? { scale: 1.02 } : {}}
              whileTap={selectedFile && !isAnalyzing ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center space-x-2">
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing EEG Signal...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6" />
                    <span>Analyze EEG Data</span>
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>

          {/* Loading Animation */}
          <AnimatePresence>
            {isAnalyzing && <LoadingAnimation progress={uploadProgress} />}
          </AnimatePresence>

          {/* Results Display */}
          <AnimatePresence>
            {analysisResult && <ResultsDisplay results={analysisResult} />}
          </AnimatePresence>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">⚠️ Medical Disclaimer</p>
                <p>
                  This tool is for research and educational purposes only. Results should not be used
                  for medical diagnosis without consultation with qualified healthcare professionals.
                  Always seek professional medical advice for health concerns.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;

