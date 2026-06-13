import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import HealthSlider from "@/components/HealthSlider";
import RiskGauge from "@/components/RiskGauge";

const C = Colors.light;

function calculateRisk(age: number, bp: number, symptoms: number): number {
  const ageFactor = (age - 18) / 72;
  const bpFactor = Math.max(0, (bp - 90) / 110);
  const symptomFactor = symptoms / 5;
  const raw = ageFactor * 0.25 + bpFactor * 0.5 + symptomFactor * 0.25;
  return Math.min(100, Math.round(raw * 100));
}

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const [age, setAge] = useState(45);
  const [bp, setBp] = useState(130);
  const [symptoms, setSymptoms] = useState(1);
  const [risk, setRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleAnalyze = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    setLoading(true);
    setAlertSent(false);
    await new Promise((r) => setTimeout(r, 900));
    const result = calculateRisk(age, bp, symptoms);
    setRisk(result);
    setLoading(false);
    if (result > 50) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setTimeout(() => setAlertSent(true), 600);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [age, bp, symptoms]);

  const isHighRisk = risk !== null && risk > 50;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="heart-pulse" size={20} color={C.tint} />
          </View>
          <View>
            <Text style={styles.appName}>Sanjivini AI</Text>
            <Text style={styles.subtitle}>Family Health Guardian</Text>
          </View>
        </View>
        <View style={styles.teamBadge}>
          <Text style={styles.teamText}>Team Healix</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Health Check</Text>
        <Text style={styles.cardDesc}>Enter your vitals to assess your risk level</Text>

        <HealthSlider
          label="Age"
          icon="human"
          value={age}
          min={18}
          max={90}
          onValueChange={setAge}
          unit="yrs"
        />

        <HealthSlider
          label="Systolic BP"
          icon="heart-flash"
          value={bp}
          min={90}
          max={200}
          onValueChange={setBp}
          unit="mmHg"
          dangerThreshold={140}
          warningThreshold={120}
        />

        <HealthSlider
          label="Symptoms"
          icon="stethoscope"
          value={symptoms}
          min={0}
          max={5}
          onValueChange={setSymptoms}
          unit=""
          step={1}
          labels={["None", "Mild", "Mod", "High", "Sev", "Crit"]}
        />

        <Animated.View style={animatedButtonStyle}>
          <Pressable style={styles.analyzeBtn} onPress={handleAnalyze} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Feather name="activity" size={18} color="#fff" />
                <Text style={styles.analyzeBtnText}>Analyze Risk</Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      </View>

      {risk !== null && !loading && (
        <View style={styles.card}>
          <RiskGauge risk={risk} />

          <View style={[styles.riskBanner, isHighRisk ? styles.riskHigh : styles.riskLow]}>
            <MaterialCommunityIcons
              name={isHighRisk ? "alert-circle" : "check-circle"}
              size={22}
              color={isHighRisk ? C.danger : C.tint}
            />
            <View style={styles.riskBannerText}>
              <Text style={[styles.riskLevel, { color: isHighRisk ? C.danger : C.tint }]}>
                {isHighRisk ? "High Risk Detected" : "Low Risk — Good Standing"}
              </Text>
              <Text style={styles.riskDetail}>
                {isHighRisk
                  ? "Consider consulting your doctor soon"
                  : "Keep up healthy habits and monitor regularly"}
              </Text>
            </View>
          </View>

          {alertSent && isHighRisk && (
            <View style={styles.alertSent}>
              <MaterialCommunityIcons name="message-alert" size={16} color={C.tint} />
              <Text style={styles.alertSentText}>
                Family alert sent to Amma & Anna
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.vitalsRow}>
        <View style={[styles.vitalCard, styles.vitalCardA]}>
          <MaterialCommunityIcons name="water" size={20} color={C.tint} />
          <Text style={styles.vitalValue}>{bp}</Text>
          <Text style={styles.vitalLabel}>BP Sys</Text>
        </View>
        <View style={[styles.vitalCard, styles.vitalCardB]}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={C.warning} />
          <Text style={[styles.vitalValue, { color: C.warning }]}>{age}</Text>
          <Text style={styles.vitalLabel}>Age</Text>
        </View>
        <View style={[styles.vitalCard, styles.vitalCardC]}>
          <MaterialCommunityIcons name="emoticon-sick-outline" size={20} color={C.danger} />
          <Text style={[styles.vitalValue, { color: C.danger }]}>{symptoms}/5</Text>
          <Text style={styles.vitalLabel}>Symptoms</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  teamBadge: {
    backgroundColor: C.tint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  teamText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#fff" },
  card: {
    backgroundColor: C.backgroundCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text, marginBottom: 4 },
  cardDesc: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, marginBottom: 24 },
  analyzeBtn: {
    backgroundColor: C.tint,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  analyzeBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  riskBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  riskHigh: { backgroundColor: "#FEF0EF" },
  riskLow: { backgroundColor: C.backgroundSecondary },
  riskBannerText: { flex: 1 },
  riskLevel: { fontFamily: "Inter_700Bold", fontSize: 15, marginBottom: 2 },
  riskDetail: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary },
  alertSent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
  },
  alertSentText: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.tint },
  vitalsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  vitalCard: {
    flex: 1,
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 4,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  vitalCardA: {},
  vitalCardB: {},
  vitalCardC: {},
  vitalValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.tint },
  vitalLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSecondary },
});
