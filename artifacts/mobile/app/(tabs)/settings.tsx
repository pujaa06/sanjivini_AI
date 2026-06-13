import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const C = Colors.light;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  icon: IconName;
  color: string;
  alertsEnabled: boolean;
  channel: string;
}

const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    name: "Grandma Lakshmi",
    role: "Elder",
    icon: "account-heart-outline",
    color: "#E91E63",
    alertsEnabled: true,
    channel: "SMS",
  },
  {
    id: "2",
    name: "Amma",
    role: "Caregiver",
    icon: "account-child-outline",
    color: C.tint,
    alertsEnabled: true,
    channel: "WhatsApp",
  },
  {
    id: "3",
    name: "Anna",
    role: "Family",
    icon: "account-outline",
    color: "#2196F3",
    alertsEnabled: false,
    channel: "SMS",
  },
];

const LANGUAGES = ["Kannada", "Hindi", "Telugu", "Tamil", "Bengali", "English"];
const CHANNELS = ["WhatsApp", "SMS", "App Only"];

function SettingRow({
  icon,
  label,
  value,
  onPress,
  iconColor,
  showArrow = true,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  iconColor?: string;
  showArrow?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: (iconColor ?? C.tint) + "15" }]}>
        <MaterialCommunityIcons name={icon} size={18} color={iconColor ?? C.tint} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <MaterialCommunityIcons name="chevron-right" size={18} color={C.textMuted} />}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [language, setLanguage] = useState("Kannada");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [alertChannel, setAlertChannel] = useState("WhatsApp");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const toggleMemberAlert = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, alertsEnabled: !m.alertsEnabled } : m))
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Family Settings</Text>
        <Text style={styles.subtitle}>Manage your health network</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <MaterialCommunityIcons name="shield-account" size={30} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Grandma Lakshmi</Text>
          <Text style={styles.profileRole}>Primary User — Elder</Text>
          <View style={styles.profileBadge}>
            <MaterialCommunityIcons name="star-circle" size={12} color={C.tint} />
            <Text style={styles.profileBadgeText}>Protected by Sanjivini AI</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Family Members</Text>
      <View style={styles.card}>
        {members.map((member, i) => (
          <View key={member.id}>
            <View style={styles.memberRow}>
              <View style={[styles.memberAvatar, { backgroundColor: member.color + "18" }]}>
                <MaterialCommunityIcons name={member.icon} size={22} color={member.color} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={styles.memberMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: member.color + "15" }]}>
                    <Text style={[styles.roleText, { color: member.color }]}>{member.role}</Text>
                  </View>
                  <Text style={styles.memberChannel}>{member.channel}</Text>
                </View>
              </View>
              <Switch
                value={member.alertsEnabled}
                onValueChange={() => toggleMemberAlert(member.id)}
                trackColor={{ false: C.border, true: C.tint + "80" }}
                thumbColor={member.alertsEnabled ? C.tint : "#f4f3f4"}
                ios_backgroundColor={C.border}
              />
            </View>
            {i < members.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Regional Support</Text>
      <View style={styles.card}>
        <SettingRow
          icon="translate"
          label="Voice Language"
          value={language}
          onPress={() => {
            Haptics.selectionAsync();
            setShowLangPicker(!showLangPicker);
          }}
        />
        {showLangPicker && (
          <View style={styles.langPicker}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                onPress={() => {
                  Haptics.selectionAsync();
                  setLanguage(lang);
                  setShowLangPicker(false);
                }}
                style={[styles.langOption, language === lang && styles.langOptionActive]}
              >
                <Text style={[styles.langOptionText, language === lang && styles.langOptionTextActive]}>
                  {lang}
                </Text>
                {language === lang && <MaterialCommunityIcons name="check" size={16} color={C.tint} />}
              </Pressable>
            ))}
          </View>
        )}
        <View style={styles.divider} />
        <SettingRow
          icon="message-outline"
          label="Alert Channel"
          value={alertChannel}
          onPress={() => {
            const next = CHANNELS[(CHANNELS.indexOf(alertChannel) + 1) % CHANNELS.length];
            Haptics.selectionAsync();
            setAlertChannel(next);
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <View style={[styles.settingIcon, { backgroundColor: C.tint + "15" }]}>
              <MaterialCommunityIcons name="bell-outline" size={18} color={C.tint} />
            </View>
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(v) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setNotifications(v);
            }}
            trackColor={{ false: C.border, true: C.tint + "80" }}
            thumbColor={notifications ? C.tint : "#f4f3f4"}
            ios_backgroundColor={C.border}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <View style={[styles.settingIcon, { backgroundColor: "#FF9800" + "15" }]}>
              <MaterialCommunityIcons name="alarm" size={18} color="#FF9800" />
            </View>
            <Text style={styles.settingLabel}>Daily Reminder (8:00 AM)</Text>
          </View>
          <Switch
            value={dailyReminder}
            onValueChange={(v) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setDailyReminder(v);
            }}
            trackColor={{ false: C.border, true: C.tint + "80" }}
            thumbColor={dailyReminder ? C.tint : "#f4f3f4"}
            ios_backgroundColor={C.border}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <SettingRow icon="information-outline" label="Version" value="1.0.0 — Innovate Bharat" showArrow={false} />
        <View style={styles.divider} />
        <SettingRow icon="trophy-outline" label="Track" value="AIIS206" iconColor="#FF9800" showArrow={false} />
        <View style={styles.divider} />
        <SettingRow icon="account-group-outline" label="Team" value="Healix" iconColor="#2196F3" showArrow={false} />
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="heart" size={14} color={C.tint} />
        <Text style={styles.footerText}>
          Innovate Bharat Hackathon 2026 · AIIS Track
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
  profileCard: {
    backgroundColor: C.tint,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 17, color: "#fff" },
  profileRole: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  profileBadge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  profileBadgeText: { fontFamily: "Inter_500Medium", fontSize: 11, color: "rgba(255,255,255,0.9)" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.textSecondary, marginBottom: 10, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  card: {
    backgroundColor: C.backgroundCard,
    borderRadius: 18,
    padding: 4,
    marginBottom: 20,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  memberAvatar: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  memberInfo: { flex: 1 },
  memberName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  memberMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  roleText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  memberChannel: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  divider: { height: 1, backgroundColor: C.border, marginLeft: 16 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  settingIcon: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15, color: C.text },
  settingRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  settingValue: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.textSecondary },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  switchLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  langPicker: {
    backgroundColor: C.backgroundSecondary,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 14,
  },
  langOptionActive: { backgroundColor: C.tint + "18" },
  langOptionText: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.text },
  langOptionTextActive: { color: C.tint, fontFamily: "Inter_600SemiBold" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
  },
  footerText: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
});
