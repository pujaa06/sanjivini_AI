import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const C = Colors.light;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface Tip {
  id: string;
  category: string;
  title: string;
  body: string;
  icon: IconName;
  color: string;
  source: string;
  bookmarked: boolean;
}

const TIPS: Tip[] = [
  {
    id: "1",
    category: "Hydration",
    title: "Drink 8 Glasses of Water",
    body: "Staying well-hydrated helps regulate blood pressure, flushes toxins, and keeps joints lubricated. Aim for 2–2.5L daily, more in summer.",
    icon: "water",
    color: "#2196F3",
    source: "WHO Guidelines",
    bookmarked: false,
  },
  {
    id: "2",
    category: "Movement",
    title: "Walk 30 Minutes Daily",
    body: "A daily brisk walk reduces cardiovascular risk by 35%, lowers BP by up to 8 mmHg, and boosts mood through natural endorphins.",
    icon: "walk",
    color: C.tint,
    source: "Harvard Health",
    bookmarked: false,
  },
  {
    id: "3",
    category: "Monitoring",
    title: "Check BP Every Week",
    body: "Regular BP monitoring helps detect hypertension early. Measure at the same time each morning, after 5 minutes of rest.",
    icon: "heart-flash",
    color: "#E91E63",
    source: "AHA Recommendation",
    bookmarked: false,
  },
  {
    id: "4",
    category: "Ayurveda",
    title: "Tulsi Tea for Immunity",
    body: "Holy basil (tulsi) tea has adaptogenic properties that help reduce stress hormones. Brew 5–6 leaves in hot water for 5 minutes.",
    icon: "leaf",
    color: "#4CAF50",
    source: "Ayurvedic Tradition",
    bookmarked: false,
  },
  {
    id: "5",
    category: "Sleep",
    title: "Sleep 7–8 Hours Nightly",
    body: "Quality sleep restores the immune system, balances hormones, and helps regulate blood sugar. Avoid screens 1 hour before bed.",
    icon: "sleep",
    color: "#673AB7",
    source: "Sleep Foundation",
    bookmarked: false,
  },
  {
    id: "6",
    category: "Nutrition",
    title: "Add Turmeric to Your Diet",
    body: "Curcumin in turmeric has powerful anti-inflammatory effects. Add a pinch to warm milk or dal daily for best results.",
    icon: "food-variant",
    color: "#FF9800",
    source: "NCBI Research",
    bookmarked: false,
  },
];

function TipCard({ tip, onBookmark }: { tip: Tip; onBookmark: (id: string) => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onBookmark(tip.id);
  };

  return (
    <Animated.View entering={FadeInDown.springify()} style={[styles.tipCard, animStyle]}>
      <View style={[styles.tipIconWrap, { backgroundColor: tip.color + "15" }]}>
        <MaterialCommunityIcons name={tip.icon} size={28} color={tip.color} />
      </View>
      <View style={styles.tipBody}>
        <View style={styles.tipHeader}>
          <View style={[styles.categoryChip, { backgroundColor: tip.color + "15" }]}>
            <Text style={[styles.categoryText, { color: tip.color }]}>{tip.category}</Text>
          </View>
          <Pressable onPress={handleBookmark} hitSlop={8}>
            <MaterialCommunityIcons
              name={tip.bookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={tip.bookmarked ? C.tint : C.textMuted}
            />
          </Pressable>
        </View>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipText}>{tip.body}</Text>
        <View style={styles.sourceRow}>
          <Feather name="shield" size={11} color={C.textMuted} />
          <Text style={styles.sourceText}>{tip.source}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const CATEGORIES = ["All", "Hydration", "Movement", "Monitoring", "Ayurveda", "Sleep", "Nutrition"];

export default function TipsScreen() {
  const insets = useSafeAreaInsets();
  const [tips, setTips] = useState<Tip[]>(TIPS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleBookmark = (id: string) => {
    setTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, bookmarked: !t.bookmarked } : t))
    );
  };

  const filtered =
    selectedCategory === "All"
      ? tips
      : tips.filter((t) => t.category === selectedCategory);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Health Companion</Text>
        <Text style={styles.subtitle}>Curated wisdom for your wellbeing</Text>
      </View>

      <View style={styles.featuredCard}>
        <MaterialCommunityIcons name="robot-happy-outline" size={32} color="#fff" />
        <View style={styles.featuredText}>
          <Text style={styles.featuredTitle}>Digital Elder Says</Text>
          <Text style={styles.featuredBody}>
            "Small consistent habits outperform occasional heroic efforts. Your body heals when you rest, move, and nourish it daily."
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedCategory(cat);
            }}
            style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {filtered.map((tip) => (
        <TipCard key={tip.id} tip={tip} onBookmark={handleBookmark} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 16 },
  header: { marginBottom: 20 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, marginTop: 2 },
  featuredCard: {
    backgroundColor: C.tint,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  featuredText: { flex: 1 },
  featuredTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  featuredBody: { fontFamily: "Inter_400Regular", fontSize: 14, color: "#fff", lineHeight: 20 },
  filterRow: { gap: 8, paddingBottom: 16 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.backgroundCard,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterChipActive: {
    backgroundColor: C.tint,
    borderColor: C.tint,
  },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.textSecondary },
  filterTextActive: { color: "#fff" },
  tipCard: {
    backgroundColor: C.backgroundCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: 14,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tipBody: { flex: 1 },
  tipHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  categoryChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  categoryText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  tipTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text, marginBottom: 4 },
  tipText: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, lineHeight: 18, marginBottom: 8 },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sourceText: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
});
