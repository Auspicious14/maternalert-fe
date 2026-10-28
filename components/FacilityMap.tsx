import React, { useEffect, useMemo, useRef } from "react";
import { useColorScheme, View } from "react-native";
import { WebView } from "react-native-webview";

import { buildMapHtml, MapPoint } from "../services/mapHtml";
import { useTokens } from "./ds";

// Same component as maternalert-web/src/components/FacilityMap.tsx

export default function FacilityMap({
  points,
  me,
  focusId,
  onSelect,
  height = 280,
}: {
  points: MapPoint[];
  me?: { lat: number; lng: number } | null;
  focusId?: string | null;
  onSelect?: (id: string) => void;
  height?: number;
}) {
  const t = useTokens();
  const ref = useRef<WebView>(null);
  const dark = useColorScheme() === "dark";

  // Rebuild only when the set of places or the user's spot changes.
  const key = points.map((p) => p.id).join("|") + (me ? `@${me.lat},${me.lng}` : "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => buildMapHtml({ points, me, dark }), [key, dark]);

  useEffect(() => {
    if (focusId) ref.current?.postMessage(JSON.stringify({ type: "focus", id: focusId }));
  }, [focusId]);

  return (
    <View
      style={{ height, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: t.border, backgroundColor: t.surface2 }}
      accessible
      accessibilityLabel="Map of health facilities near you"
    >
      <WebView
        ref={ref}
        source={{ html, baseUrl: "https://maternalert.com.ng/" }}
        originWhitelist={["*"]}
        javaScriptEnabled
        nestedScrollEnabled
        setSupportMultipleWindows={false}
        style={{ backgroundColor: "transparent" }}
        onMessage={(e) => {
          try {
            const m = JSON.parse(e.nativeEvent.data);
            if (m?.type === "select" && typeof m.id === "string") onSelect?.(m.id);
          } catch {
            // ignore
          }
        }}
        // Links in popups (Directions) open in the phone's maps/browser app.
        onShouldStartLoadWithRequest={(req) => {
          if (req.url.startsWith("https://www.google.com/maps") || req.url.startsWith("https://www.openstreetmap.org")) {
            require("react-native").Linking.openURL(req.url);
            return false;
          }
          return true;
        }}
      />
    </View>
  );
}
