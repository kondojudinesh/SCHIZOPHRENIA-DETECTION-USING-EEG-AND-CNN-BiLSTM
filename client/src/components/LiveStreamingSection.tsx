import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Activity, Wifi, WifiOff } from "lucide-react";
import EEGChart from "./EEGChart";
import { AppContext } from "../context/AppContext";

interface EEGData {
  timestamp: number;
  channels: number[];
}

const LiveStreamingSection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const maxDataPoints = 100;

  const { eegStreamData, setEegStreamData } = useContext(AppContext);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket("ws://127.0.0.1:8000/ws/stream");

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          const newDataPoint: EEGData = {
            timestamp: Date.now(),
            channels:
              data.channels?.[0] ||
              Array(8)
                .fill(0)
                .map(() => Math.random() * 100 - 50),
          };

          setEegStreamData((prev) => [...prev, newDataPoint].slice(-maxDataPoints));
        } catch (err) {
          console.error("Error parsing WebSocket data:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsStreaming(false);
        console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        setConnectionError("Failed to connect to WebSocket server");
        setIsConnected(false);
        console.error("WebSocket error:", error);
      };

      wsRef.current = ws;
    } catch (err) {
      setConnectionError("Unable to establish WebSocket connection");
      console.error("WebSocket connection error:", err);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsStreaming(false);
  };

  const toggleStreaming = () => {
    if (isStreaming) {
      setIsStreaming(false);
    } else {
      if (!isConnected) {
        connectWebSocket();
      }
      setIsStreaming(true);
    }
  };

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // Simulated data for demo when not connected
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming && !isConnected) {
      interval = setInterval(() => {
        const newDataPoint: EEGData = {
          timestamp: Date.now(),
          channels: Array(8)
            .fill(0)
            .map(() => Math.sin(Date.now() / 1000) * 50 + Math.random() * 20 - 10),
        };

        setEegStreamData((prev) => [...prev, newDataPoint].slice(-maxDataPoints));
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, isConnected, setEegStreamData]);

  // Calculate dynamic values
  const samplingRate =
    eegStreamData.length > 1
      ? Math.round(
          1000 /
            ((eegStreamData[eegStreamData.length - 1].timestamp -
              eegStreamData[eegStreamData.length - 2].timestamp) || 1)
        )
      : 0;

  const channelCount =
    eegStreamData.length > 0 ? eegStreamData[0].channels.length : 0;

  const bufferSize = eegStreamData.length;

  // Tailwind-safe static color map
  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
    },
  };

  return (
    <section className="min-h-screen py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live EEG Streaming
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Monitor real-time EEG signals with our advanced streaming interface.
            Watch brain activity patterns as they happen.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={`font-medium ${
                      isConnected
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                {isStreaming && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Live
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={toggleStreaming}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isStreaming
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isStreaming ? (
                    <>
                      <Pause className="h-5 w-5" />
                      <span>Stop Stream</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>Start Stream</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Connection Error */}
            <AnimatePresence>
              {connectionError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <strong>Demo Mode:</strong> {connectionError}. Showing simulated data.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* EEG Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Multi-Channel EEG Signals
              </h3>
            </div>

            {isStreaming ? (
              <EEGChart data={eegStreamData} />
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-center">
                  <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Start streaming to view live EEG data
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Click "Start Stream" to begin monitoring
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { title: "Sampling Rate", value: "256", icon: Activity, color: "blue" },
              { title: "Channels", value: `${channelCount} Active`, icon: Wifi, color: "green" },
              { title: "Buffer Size", value: "100", icon: Activity, color: "purple" },
            ].map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`inline-flex p-3 rounded-full mb-4 ${colorClasses[info.color].bg}`}>
                  <info.icon className={`h-6 w-6 ${colorClasses[info.color].text}`} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h4>
                <p className={`text-2xl font-bold ${colorClasses[info.color].text}`}>
                  {info.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStreamingSection;


