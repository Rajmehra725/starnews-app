import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BrandColors, Shadows } from "@/constants/theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Existing credentials preserved
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "लॉगिन आवश्यक",
        "कृपया अपना यूज़रनेम एवं पासवर्ड दर्ज करें।"
      );
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      if (
        username.trim() === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
      ) {
        try {
          await AsyncStorage.setItem("starnews_admin_session", "true");
        } catch (e) {
          // ignore
        }
        router.replace("/dashboard");
      } else {
        Alert.alert(
          "पहुँच अस्वीकृत (Access Denied)",
          "अमान्य यूज़रनेम या पासवर्ड। कृपया सही क्रेडेंशियल दर्ज करें।"
        );
      }
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Newsroom Editorial Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
            <Text style={styles.backButtonText}>मुख्य ऐप (App Home)</Text>
          </TouchableOpacity>

          <View style={styles.liveBadgeRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>NEWSROOM CONTROL DESK</Text>
            <Text style={styles.liveDotText}>• 24×7 LIVE</Text>
          </View>

          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="broadcast" size={36} color="#FFF" />
          </View>

          <Text style={styles.brandTitle}>STAR NEWS NETWORKS</Text>
          <Text style={styles.brandTagline}>LOCAL | LIVE | TRUSTED</Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>संपादकीय प्रवेश (CMS LOGIN)</Text>
              <Text style={styles.cardSubtitle}>
                अधिकृत पत्रकार एवं व्यवस्थापक लॉगिन
              </Text>
            </View>
            <View style={styles.lockBox}>
              <Ionicons name="lock-closed" size={20} color={BrandColors.primary} />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>यूज़रनेम (USERNAME)</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={BrandColors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="उदा. admin"
                placeholderTextColor={BrandColors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>पासवर्ड (PASSWORD)</Text>
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={18} color={BrandColors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="सुरक्षित पासवर्ड दर्ज करें"
                placeholderTextColor={BrandColors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={19}
                  color={BrandColors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={18} color="#FFF" />
                <Text style={styles.loginBtnText}>संपादकीय डेस्क में प्रवेश करें</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Security Assurance */}
          <View style={styles.securityBox}>
            <Ionicons name="shield-outline" size={14} color="#16A34A" />
            <Text style={styles.securityText}>
              256-Bit SSL एन्क्रिप्टेड व्यवस्थापक सुरक्षा
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>STAR NEWS NETWORKS CMS</Text>
          <Text style={styles.footerText}>
            यह पोर्टल केवल अधिकृत संपादकीय टीम एवं ब्यूरो प्रमुखों के लिए आरक्षित है।
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 45,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  liveBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
  },
  liveText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  liveDotText: {
    color: "#71717A",
    fontSize: 10,
    fontWeight: "700",
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FCA5A5",
    letterSpacing: 2,
    marginTop: 2,
  },
  loginCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 22,
    borderTopWidth: 4,
    borderTopColor: BrandColors.primary,
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 3,
  },
  lockBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.borderLight,
    marginVertical: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    height: 48,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.charcoal,
    height: "100%",
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    backgroundColor: BrandColors.primary,
    height: 50,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    ...Shadows.sm,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  securityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  securityText: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 24,
    gap: 4,
  },
  footerBrand: {
    fontSize: 11,
    fontWeight: "800",
    color: "#A1A1AA",
    letterSpacing: 1,
  },
  footerText: {
    fontSize: 10,
    color: "#71717A",
    textAlign: "center",
    lineHeight: 14,
  },
});