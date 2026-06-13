import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const C = Colors.light;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface HealthSliderProps {
  label: string;
  icon: IconName;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onValueChange: (val: number) => void;
  dangerThreshold?: number;
  warningThreshold?: number;
  labels?: string[];
}

export default function HealthSlider({
  label,
  icon,
  value,
  min,
  max,
  step = 1,
  unit,
  onValueChange,
  dangerThreshold,
  warningThreshold,
  labels,
}: HealthSliderProps) {
  let trackColor = C.tint;
  if (dangerThreshold && value >= dangerThreshold) {
    trackColor = C.danger;
  } else if (warningThreshold && value >= warningThreshold) {
    trackColor = C.warning;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: trackColor + "18" }]}>
          <MaterialCommunityIcons name={icon} size={16} color={trackColor} />
        </View>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.valueBadge, { backgroundColor: trackColor + "18" }]}>
          <Text style={[styles.valueText, { color: trackColor }]}>
            {value}{unit ? ` ${unit}` : ""}
          </Text>
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={(v) => onValueChange(Math.round(v))}
        minimumTrackTintColor={trackColor}
        maximumTrackTintColor={C.border}
        thumbTintColor={trackColor}
      />
      {labels && (
        <View style={styles.labelsRow}>
          {labels.map((l, i) => (
            <Text
              key={i}
              style={[
                styles.scaleLabel,
                value === i && { color: trackColor, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.text,
  },
  valueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  valueText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  slider: { width: "100%", height: 36 },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: -4,
  },
  scaleLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: C.textMuted,
  },
});
