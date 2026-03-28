import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useToast } from "../components/ui/ToastProvider";
import { sessionService } from "../services/session";

export const useSession = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  useEffect(() => {
    sessionService.setCallbacks(
      () => {
        // Session expired
        router.replace("/login?message=session_expired");
      },
      () => {
        // Session warning
        setIsWarningVisible(true);
        showToast({
          type: "info",
          message: "Your session will expire in 5 minutes due to inactivity.",
        });
      },
    );

    // Initial check
    sessionService.updateActivity();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const resetActivity = () => {
    sessionService.updateActivity();
    if (isWarningVisible) {
      setIsWarningVisible(false);
    }
  };

  return {
    resetActivity,
    isWarningVisible,
  };
};
