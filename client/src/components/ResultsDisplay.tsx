import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  BarChart,
  Brain,
  Clock,
  FileText,
  Activity,
  Target,
  Lightbulb,
  Heart,
  Calendar,
} from "lucide-react";

interface AIReport {
  severity?: string;
  treatment?: string[];
  lifestyle?: string[];
  prevention?: string[];
  notes?: string[];
  follow_up?: string[];
}

interface AnalysisResult {
  prediction: string;
  confidence: number; // Model accuracy
  risk_confidence?: number; // Real model probability (0–1)
  heatmap?: string;
  explanation?: string;
  ai_report?: AIReport;
}

interface ResultsDisplayProps {
  results: AnalysisResult;
  fileName?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, fileName }) => {
  const isHealthy = results.prediction.toLowerCase().includes("healthy");
  const uploadTime = new Date().toLocaleString();

  // Convert risk_confidence (0–1) → percentage
  const riskLevel = results.risk_confidence
    ? Math.round(results.risk_confidence * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Main Results Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Analysis Results</h2>
          </div>
          <p className="opacity-90">AI-powered EEG signal analysis complete</p>
        </div>

        <div className="p-6">
          {/* Model Accuracy + Prediction + Brain Risk Level */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Model Accuracy (Left - Blue) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
            >
              <div className="flex items-center space-x-3 mb-3">
                <BarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Model Accuracy
                  </h3>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {results.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-1000 bg-blue-500"
                  style={{ width: `${results.confidence}%` }}
                />
              </div>
            </motion.div>

            {/* Prediction (Middle - Green/Red) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl border-2 ${
                isHealthy
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                {isHealthy ? (
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Prediction
                  </h3>
                  <p
                    className={`text-xl font-bold ${
                      isHealthy
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {results.prediction}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Brain Risk Level (Right - based on % color) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Brain Risk Level
                  </h3>
                  <p
                    className={`text-xl font-bold ${
                      riskLevel >= 55
                        ? "text-red-700 dark:text-red-300"
                        : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {riskLevel}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    riskLevel >= 55 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${riskLevel}%` }}
                />
              </div>
            </motion.div>
          </div>

          {/* Heatmap */}
          {results.heatmap && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Brain Activity Heatmap</span>
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <img
                  src={`http://localhost:8000${results.heatmap}`}
                  alt="EEG Heatmap"
                  className="w-full h-64 object-contain rounded-lg"
                />
              </div>
            </motion.div>
          )}

          {/* Explanation */}
          {results.explanation && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>AI Explanation</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {results.explanation}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Comprehensive AI Report */}
      {results.ai_report && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Comprehensive AI Report</span>
            </h2>
          </div>
          <div className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
            {results.ai_report.severity && (
              <div>
                <h3 className="font-bold flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span>Severity Assessment</span>
                </h3>
                <p className="mt-2 text-orange-800 dark:text-orange-200 font-medium">
                  {results.ai_report.severity}
                </p>
              </div>
            )}

            {results.ai_report.treatment && results.ai_report.treatment.length > 0 && (
              <div>
                <h3 className="font-bold flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span>Treatment Recommendations</span>
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {results.ai_report.treatment.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.ai_report.lifestyle && results.ai_report.lifestyle.length > 0 && (
              <div>
                <h3 className="font-bold flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span>Lifestyle Guidance</span>
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {results.ai_report.lifestyle.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.ai_report.prevention && results.ai_report.prevention.length > 0 && (
              <div>
                <h3 className="font-bold flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span>Prevention Tips</span>
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {results.ai_report.prevention.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.ai_report.notes && results.ai_report.notes.length > 0 && (
              <div>
                <h3 className="font-bold flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Notes</span>
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {results.ai_report.notes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.ai_report.follow_up && results.ai_report.follow_up.length > 0 && (
              <div>
                <h3 className="font-bold flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span>Follow-up Recommendations</span>
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {results.ai_report.follow_up.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Analysis Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {fileName && (
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-600 dark:text-gray-300">
                File: {fileName}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Model: CNN + BiLSTM
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Analyzed: {uploadTime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;
