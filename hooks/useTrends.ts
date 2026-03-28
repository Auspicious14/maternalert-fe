import { useState, useEffect } from "react";
import { trendService, TrendAlert } from "../services/trends";
import { useHealthData } from "./useHealthData";
import { TokenStorage } from "../api/storage";

const TRENDS_LOG_KEY = "maternalert_trends_log";

export const useTrends = () => {
  const { bpHistory = [] } = useHealthData();
  const [trendAlerts, setTrendAlerts] = useState<TrendAlert[]>([]);

  useEffect(() => {
    const loadTrends = async () => {
      const stored = await TokenStorage.getTokenStorageItem(TRENDS_LOG_KEY);
      if (stored) {
        setTrendAlerts(JSON.parse(stored));
      }
    };
    loadTrends();
  }, []);

  const analyzeLatestTrends = async () => {
    const newAlerts = trendService.detectTrends(bpHistory);
    if (newAlerts.length > 0) {
      const updatedAlerts = [...newAlerts, ...trendAlerts].slice(0, 20); // Keep last 20
      setTrendAlerts(updatedAlerts);
      await TokenStorage.saveTokenStorageItem(TRENDS_LOG_KEY, JSON.stringify(updatedAlerts));
      await trendService.triggerTrendNotifications(newAlerts);
      return newAlerts;
    }
    return [];
  };

  return {
    trendAlerts,
    analyzeLatestTrends,
  };
};
