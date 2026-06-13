import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const C = Colors.light;
const TRACK_WIDTH = Dimensions.get("window").width - 64 - 40;

interface RiskGaugeProps {
  risk: number;
}

export default function RiskGauge({ risk }: RiskGaugeProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(risk / 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [risk]);

  const barStyle = useAnimatedStyle(() => {
    const fillColor = interpolateColor(
      progress.value,
      [0, 0.4, 0.7, 1],
      [C.tint, C.tint, C.warning, C.danger]
    );
    return {
      width: interpolate(progress.value, [0, 1], [0, TRACK_WIDTH]),
      backgroundColor: fillColor,
    };
  });

  const riskColor = risk > 70 ? C.danger : risk > 40 ? C.warning : C.tint;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.gaugeLabel}>Risk Score</Text>
        <Text style={[styles.riskNumber, { color: riskColor }]}>{risk}%</Text>
      </View>
      <View style={[styles.track, { width: TRACK_WIDTH }]}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
      <View style={[styles.scaleRow, { width: TRACK_WIDTH }]}>
        <Text style={[styles.scaleText, { color: C.tint }]}>Low</Text>
        <Text style={[styles.scaleText, { color: C.warning }]}>Moderate</Text>
        <Text style={[styles.scaleText, { color: C.danger }]}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  gaugeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  riskNumber: { fontFamily: "Inter_700Bold", fontSize: 28 },
  track: {
    height: 10,
    backgroundColor: C.backgroundSecondary,
    borderRadius: 10,
    overflow: "hidden",
  },
  fill: {
    height: 10,
    borderRadius: 10,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  scaleText: { fontFamily: "Inter_400Regular", fontSize: 11 },
});
