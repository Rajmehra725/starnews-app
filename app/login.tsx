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
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";
import { StarButtonLoader } from "@/components/StarBrandLoader";

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isSmallMobile = width < 380;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // STRICT REQUIREMENT: Existing hardcoded credentials remain completely unchanged
  const ADMIN_USERNAME = "starnewsnetworks";
  const ADMIN_PASSWORD = "Starnews@2026!";

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "लॉगिन आवश्यक (Credentials Required)",
        "कृपया अपना यूज़रनेम एवं पासवर्ड दर्ज करें।"
      );
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      // Existing validation logic preserved exactly
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
      <StatusBar barStyle="light-content" backgroundColor="#0B0C10" />

      {/* Background Ambience Glow */}
      <View style={[styles.ambientGlow, { width: width * 1.4, height: width * 1.4 }]} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isDesktop && styles.desktopScroll,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Row back to Public App */}
        <View style={[styles.topBar, isDesktop && styles.desktopTopBar]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={18} color="#FFF" />
            <Text style={styles.backButtonText}>मुख्य ऐप (Back to App)</Text>
          </TouchableOpacity>

          <View style={styles.liveBroadcastPill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.liveBroadcastText}>NEWSROOM CONTROL • 24×7</Text>
          </View>
        </View>

        {/* Central Responsive Card Wrapper */}
        <View
          style={[
            styles.cardWrapper,
            isDesktop && styles.desktopCardWrapper,
            isSmallMobile && styles.smallMobileCardWrapper,
          ]}
        >
          {/* Header Brand Section */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitleWhite}>STAR </Text>
              <Text style={styles.brandTitleRed}>NEWS</Text>
            </View>
            <Text style={styles.brandSubtitle}>NETWORKS</Text>

            <View style={styles.taglineBadge}>
              <Text style={styles.taglineText}>{BrandIdentity.tagline}</Text>
            </View>
            <Text style={styles.taglineHindi}>{BrandIdentity.taglineHindi}</Text>
          </View>

          {/* Form Card */}
          <View style={styles.loginCard}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>संपादकीय प्रवेश (CMS LOGIN)</Text>
                <Text style={styles.cardSubtitle}>
                  अधिकृत पत्रकार एवं व्यवस्थापक नियंत्रण कक्ष
                </Text>
              </View>
              <View style={styles.lockBox}>
                <Ionicons name="shield-checkmark" size={20} color={BrandColors.primary} />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>यूज़रनेम (USERNAME)</Text>
              <View style={[styles.inputBox, usernameFocused && styles.inputBoxFocused]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={usernameFocused ? BrandColors.primary : BrandColors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="यूज़रनेम दर्ज करें (e.g. admin)"
                  placeholderTextColor={BrandColors.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>पासवर्ड (PASSWORD)</Text>
              <View style={[styles.inputBox, passwordFocused && styles.inputBoxFocused]}>
                <Ionicons
                  name="key-outline"
                  size={18}
                  color={passwordFocused ? BrandColors.primary : BrandColors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="सुरक्षित पासवर्ड दर्ज करें"
                  placeholderTextColor={BrandColors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                <StarButtonLoader label="सत्यापित किया जा रहा है..." color="#FFF" />
              ) : (
                <>
                  <Ionicons name="lock-open" size={17} color="#FFF" />
                  <Text style={styles.loginBtnText}>संपादकीय डेस्क में प्रवेश करें</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Security Assurance */}
            <View style={styles.securityBox}>
              <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
              <Text style={styles.securityText}>
                256-Bit SSL एन्क्रिप्टेड व्यवस्थापक सुरक्षा • पन्ना ब्यूरो
              </Text>
            </View>
          </View>

          {/* Responsive Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerBrand}>STAR NEWS NETWORKS CMS</Text>
            <Text style={styles.footerText}>
              यह नियंत्रण कक्ष केवल अधिकृत संपादकीय टीम एवं अधिकृत पत्रकारों के लिए आरक्षित है।
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C10",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  ambientGlow: {
    position: "absolute",
    top: "-15%",
    alignSelf: "center",
    borderRadius: 9999,
    backgroundColor: "rgba(229, 9, 20, 0.14)",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 20 : 35,
    paddingBottom: 40,
  },
  desktopScroll: {
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  desktopTopBar: {
    maxWidth: 480,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  liveBroadcastPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 9, 20, 0.35)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  liveBroadcastText: {
    color: "#FFF",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardWrapper: {
    width: "100%",
  },
  desktopCardWrapper: {
    maxWidth: 480,
  },
  smallMobileCardWrapper: {
    paddingHorizontal: 0,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: BrandColors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.35)",
    ...Shadows.md,
    marginBottom: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTitleWhite: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  brandTitleRed: {
    fontSize: 24,
    fontWeight: "900",
    color: BrandColors.primary,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FCA5A5",
    letterSpacing: 3,
    marginTop: 2,
  },
  taglineBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 8,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1.5,
  },
  taglineHindi: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 3,
  },
  loginCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  lockBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputBoxFocused: {
    borderColor: BrandColors.primary,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: BrandColors.charcoal,
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BrandColors.primary,
    borderRadius: 10,
    height: 48,
    gap: 8,
    marginTop: 6,
    ...Shadows.md,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  securityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  securityText: {
    fontSize: 10,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 12,
  },
  footerBrand: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  footerText: {
    color: "#64748B",
    fontSize: 10.5,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
  },
});