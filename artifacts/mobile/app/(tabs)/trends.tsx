import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Path, Circle, Line } from "react-native-svg";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

const C = Colors.light;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 140;

interface DataPoint {
  day: string;
  bp: number;
  risk: number;
}

const DATA_30: DataPoint[] = [
  { day: "Mar 1", bp: 118, risk: 15 },
  { day: "Mar 3", bp: 122, risk: 20 },
  { day: "Mar 5", bp: 125, risk: 22 },
  { day: "Mar 7", bp: 131, risk: 28 },
  { day: "Mar 9", bp: 135, risk: 35 },
  { day: "Mar 11", bp: 128, risk: 30 },
  { day: "Mar 13", bp: 132, risk: 33 },
  { day: "Mar 15", bp: 140, risk: 45 },
  { day: "Mar 17", bp: 145, risk: 52 },
  { day: "Mar 18", bp: 155, risk: 70 },
];

const DATA_7: DataPoint[] = DATA_30.slice(-5);
const DATA_14: DataPoint[] = DATA_30.slice(-7);

function MiniChart({
  data,
  color1,
  color2,
}: {
  data: DataPoint[];
  color1: string;
  color2: string;
}) {
  const vals1 = data.map((d) => d.bp);
  const vals2 = data.map((d) => d.risk);
  const allVals = [...vals1, ...vals2];
  const minV = Math.min(...allVals) - 5;
  const maxV = Math.max(...allVals) + 5;
  const range = maxV - minV;

  const toY = (v: number) =>
    CHART_HEIGHT - ((v - minV) / range) * CHART_HEIGHT;
  const toX = (i: number) =>
    data.length === 1 ? CHART_WIDTH / 2 : (i / (data.length - 1)) * CHART_WIDTH;

  const makePath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  return (
    <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <View
          key={t}
          style={[
            styles.gridLine,
            { top: t * CHART_HEIGHT },
          ]}
        />
      ))}
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* BP line (solid) */}
        <Path
          d={makePath(vals1)}
          fill="none"
          stroke={color1}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Risk line (dashed) */}
        <Path
          d={makePath(vals2)}
          fill="none"
          stroke={color2}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,3"
        />
        {/* BP data points */}
        {vals1.map((v, i) => (
          <Circle
            key={`bp-${i}`}
            cx={toX(i)}
            cy={toY(v)}
            r="4"
            fill={color1}
          />
        ))}
        {/* Risk data points */}
        {vals2.map((v, i) => (
          <Circle
            key={`risk-${i}`}
            cx={toX(i)}
            cy={toY(v)}
            r="3"
            fill={color2}
          />
        ))}
      </Svg>
    </View>
  );
}

const RANGES = ["7 days", "14 days", "30 days"];
const DATA_MAP: Record<string, DataPoint[]> = {
  "7 days": DATA_7,
  "14 days": DATA_14,
  "30 days": DATA_30,
};

export default function TrendsScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState("30 days");
  const data = DATA_MAP[range];
  const latestBP = data[data.length - 1].bp;
  const latestRisk = data[data.length - 1].risk;
  const avgBP = Math.round(data.reduce((s, d) => s + d.bp, 0) / data.length);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const bpTrend = data[data.length - 1].bp > data[0].bp ? "up" : "down";
  const riskTrend = data[data.length - 1].risk > data[0].risk ? "up" : "down";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Health Trends</Text>
        <Text style={styles.subtitle}>30-day tracking & insights</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name={bpTrend === "up" ? "trending-up" : "trending-down"}
            size={20}
            color={bpTrend === "up" ? C.danger : C.tint}
          />
          <Text style={styles.statValue}>{latestBP}</Text>
          <Text style={styles.statLabel}>BP Systolic</Text>
          <Text style={styles.statUnit}>mmHg</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name={riskTrend === "up" ? "trending-up" : "trending-down"}
            size={20}
            color={riskTrend === "up" ? C.danger : C.tint}
          />
          <Text style={styles.statValue}>{latestRisk}%</Text>
          <Text style={styles.statLabel}>Risk Score</Text>
          <Text style={styles.statUnit}>today</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="chart-bell-curve-cumulative"
            size={20}
            color={C.tint}
          />
          <Text style={styles.statValue}>{avgBP}</Text>
          <Text style={styles.statLabel}>Avg BP</Text>
          <Text style={styles.statUnit}>period</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>BP & Risk Trend</Text>
          <View style={styles.rangeRow}>
            {RANGES.map((r) => (
              <Pressable
                key={r}
                onPress={() => {
                  Haptics.selectionAsync();
                  setRange(r);
                }}
                style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
              >
                <Text
                  style={[
                    styles.rangeBtnText,
                    range === r && styles.rangeBtnTextActive,
                  ]}
                >
                  {r.split(" ")[0]}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.danger }]} />
            <Text style={styles.legendText}>BP (mmHg)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: C.warning }]} />
            <Text style={styles.legendText}>Risk %</Text>
          </View>
        </View>

        <View style={styles.chartWrap}>
          <MiniChart data={data} color1={C.danger} color2={C.warning} />
        </View>

        <View style={styles.xLabels}>
          <Text style={styles.xLabel}>{data[0].day}</Text>
          <Text style={styles.xLabel}>
            {data[Math.floor(data.length / 2)].day}
          </Text>
          <Text style={styles.xLabel}>{data[data.length - 1].day}</Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.springify()} style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <MaterialCommunityIcons name="brain" size={22} color={C.tint} />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>AI Insight</Text>
          <Text style={styles.insightBody}>
            Your blood pressure shows an upward trend over the past 30 days
            (+37 mmHg). This is consistent with pre-hypertension. Consider a
            lifestyle review and consult your family doctor.
          </Text>
        </View>
      </Animated.View>

      <Text style={styles.sectionTitle}>Daily Log</Text>
      <View style={styles.logCard}>
        {data
          .slice()
          .reverse()
          .map((d, i) => (
            <View key={i}>
              <View style={styles.logRow}>
                <Text style={styles.logDay}>{d.day}</Text>
                <View style={styles.logValues}>
                  <View
                    style={[
                      styles.logBadge,
                      {
                        backgroundColor:
                          d.bp > 140
                            ? C.danger + "18"
                            : C.backgroundSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.logBadgeText,
                        { color: d.bp > 140 ? C.danger : C.text },
                      ]}
                    >
                      {d.bp} mmHg
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.logBadge,
                      {
                        backgroundColor:
                          d.risk > 50
                            ? C.warning + "18"
                            : C.backgroundSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.logBadgeText,
                        { color: d.risk > 50 ? C.warning : C.text },
                      ]}
                    >
                      {d.risk}% risk
                    </Text>
                  </View>
                </View>
              </View>
              {i < data.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 16 },
  header: { marginBottom: 20 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textSecondary,
    marginTop: 2,
  },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 2,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: C.text },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: C.textSecondary,
  },
  statUnit: { fontFamily: "Inter_400Regular", fontSize: 10, color: C.textMuted },
  card: {
    backgroundColor: C.backgroundCard,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chartTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text },
  rangeRow: { flexDirection: "row", gap: 4 },
  rangeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: C.backgroundSecondary,
  },
  rangeBtnActive: { backgroundColor: C.tint },
  rangeBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: C.textSecondary,
  },
  rangeBtnTextActive: { color: "#fff" },
  legendRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLine: { width: 16, height: 2, borderRadius: 1 },
  legendText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.textSecondary,
  },
  chartWrap: { marginBottom: 8 },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.border,
    opacity: 0.5,
  },
  xLabels: { flexDirection: "row", justifyContent: "space-between" },
  xLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: C.textMuted,
  },
  insightCard: {
    backgroundColor: C.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: C.tint,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.tint + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  insightContent: { flex: 1 },
  insightTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: C.text,
    marginBottom: 4,
  },
  insightBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: C.text,
    marginBottom: 12,
  },
  logCard: {
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    padding: 16,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  logDay: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.text,
    width: 70,
  },
  logValues: { flexDirection: "row", gap: 8 },
  logBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  logBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  divider: { height: 1, backgroundColor: C.border },
});
