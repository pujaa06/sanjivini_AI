import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const C = Colors.light;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  channel: string;
  avatar: IconName;
  color: string;
  lastAlert: string | null;
}

const CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Amma",
    role: "Primary Caregiver",
    phone: "+91 9845 XXXXX",
    channel: "WhatsApp",
    avatar: "account-heart",
    color: "#E91E63",
    lastAlert: "2 days ago",
  },
  {
    id: "2",
    name: "Anna",
    role: "Emergency Contact",
    phone: "+91 9987 XXXXX",
    channel: "SMS",
    avatar: "account-star",
    color: "#2196F3",
    lastAlert: "1 week ago",
  },
  {
    id: "3",
    name: "Dr. Sharma",
    role: "Family Doctor",
    phone: "+91 9876 XXXXX",
    channel: "Call",
    avatar: "doctor",
    color: C.tint,
    lastAlert: null,
  },
];

interface AlertHistoryItem {
  id: string;
  type: "high" | "medium" | "normal";
  message: string;
  time: string;
  sentTo: string;
}

const HISTORY: AlertHistoryItem[] = [
  {
    id: "h1",
    type: "high",
    message: "BP elevated to 155 mmHg — caregiver notified",
    time: "2 days ago, 9:14 AM",
    sentTo: "Amma",
  },
  {
    id: "h2",
    type: "medium",
    message: "Symptom score 3/5 — routine check reminder sent",
    time: "1 week ago, 3:00 PM",
    sentTo: "Anna",
  },
  {
    id: "h3",
    type: "normal",
    message: "Daily health report sent — all vitals normal",
    time: "2 weeks ago, 8:00 AM",
    sentTo: "Amma, Anna",
  },
];

function ContactCard({ contact }: { contact: Contact }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.contactCard}>
      <View style={[styles.avatarWrap, { backgroundColor: contact.color + "15" }]}>
        <MaterialCommunityIcons name={contact.avatar} size={26} color={contact.color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactRole}>{contact.role}</Text>
        <View style={styles.contactMeta}>
          <View style={[styles.channelBadge, { backgroundColor: contact.color + "15" }]}>
            <Text style={[styles.channelText, { color: contact.color }]}>{contact.channel}</Text>
          </View>
          {contact.lastAlert && (
            <Text style={styles.lastAlert}>Last: {contact.lastAlert}</Text>
          )}
        </View>
      </View>
      <Pressable
        style={[styles.sendBtn, sent ? styles.sendBtnSuccess : {}, { borderColor: contact.color }]}
        onPress={handleSend}
        disabled={sending || sent}
      >
        {sending ? (
          <ActivityIndicator size="small" color={contact.color} />
        ) : sent ? (
          <MaterialCommunityIcons name="check" size={18} color={C.tint} />
        ) : (
          <MaterialCommunityIcons name="send" size={18} color={contact.color} />
        )}
      </Pressable>
    </Animated.View>
  );
}

function HistoryItem({ item }: { item: AlertHistoryItem }) {
  const color = item.type === "high" ? C.danger : item.type === "medium" ? C.warning : C.tint;
  const icon: IconName =
    item.type === "high" ? "alert-circle" : item.type === "medium" ? "alert" : "check-circle";

  return (
    <View style={styles.historyItem}>
      <View style={[styles.historyDot, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={14} color={color} />
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyMsg}>{item.message}</Text>
        <View style={styles.historyMeta}>
          <Text style={styles.historyTime}>{item.time}</Text>
          <View style={styles.historyToRow}>
            <Feather name="users" size={10} color={C.textMuted} />
            <Text style={styles.historyTo}>{item.sentTo}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const [testSending, setTestSending] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleTestAlert = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTestSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setTestSending(false);
    setTestSent(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Family Alerts</Text>
        <Text style={styles.subtitle}>Keep your loved ones informed instantly</Text>
      </View>

      <View style={styles.testCard}>
        <View style={styles.testCardLeft}>
          <View style={[styles.testIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <MaterialCommunityIcons name="bell-ring" size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.testTitle}>Send Test Alert</Text>
            <Text style={styles.testSub}>Simulate emergency notification</Text>
          </View>
        </View>
        <Pressable
          style={[styles.testBtn, testSent && styles.testBtnSuccess]}
          onPress={handleTestAlert}
          disabled={testSending || testSent}
        >
          {testSending ? (
            <ActivityIndicator size="small" color={C.tint} />
          ) : testSent ? (
            <>
              <MaterialCommunityIcons name="check-all" size={16} color={C.tint} />
              <Text style={[styles.testBtnText, { color: C.tint }]}>Sent!</Text>
            </>
          ) : (
            <Text style={styles.testBtnText}>Test</Text>
          )}
        </Pressable>
      </View>

      {testSent && (
        <Animated.View entering={FadeInDown} style={styles.alertPreview}>
          <MaterialCommunityIcons name="whatsapp" size={16} color="#25D366" />
          <Text style={styles.alertPreviewText}>
            "Grandma's BP is elevated at 155 mmHg. Please check in on her!"
          </Text>
        </Animated.View>
      )}

      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      {CONTACTS.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}

      <Text style={styles.sectionTitle}>Alert History</Text>
      <View style={styles.historyCard}>
        {HISTORY.map((item, i) => (
          <View key={item.id}>
            <HistoryItem item={item} />
            {i < HISTORY.length - 1 && <View style={styles.historyDivider} />}
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="information-outline" size={18} color={C.textSecondary} />
        <Text style={styles.infoText}>
          Alerts are sent via WhatsApp, SMS, or direct call based on each contact's preferred channel.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 16 },
  header: { marginBottom: 20 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: C.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, marginTop: 2 },
  testCard: {
    backgroundColor: C.danger,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  testCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  testIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  testTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
  testSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.75)" },
  testBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  testBtnSuccess: { backgroundColor: "rgba(255,255,255,0.2)" },
  testBtnText: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.danger },
  alertPreview: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  alertPreviewText: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.text, flex: 1, lineHeight: 18 },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: C.text,
    marginBottom: 12,
    marginTop: 4,
  },
  contactCard: {
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrap: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  contactInfo: { flex: 1 },
  contactName: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  contactRole: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary, marginTop: 1 },
  contactMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  channelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  channelText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  lastAlert: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnSuccess: { borderColor: C.tint },
  historyCard: {
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  historyItem: { flexDirection: "row", gap: 12, paddingVertical: 10 },
  historyDot: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 1 },
  historyContent: { flex: 1 },
  historyMsg: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.text, lineHeight: 18, marginBottom: 4 },
  historyMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  historyTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  historyToRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  historyTo: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted },
  historyDivider: { height: 1, backgroundColor: C.border, marginLeft: 42 },
  infoCard: {
    backgroundColor: C.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  infoText: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, flex: 1, lineHeight: 18 },
});
