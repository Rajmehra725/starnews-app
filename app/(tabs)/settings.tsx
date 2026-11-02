import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import Privacy from "@/components/privacy";
import TermsAndConditions from "@/components/terms";

export default function ProfileScreen() {
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const shareApp = async () => {
    try {
      await Share.share({
        title: "स्टार न्यूज़ नेटवर्क ऐप",
        message:
          "स्टार न्यूज़ नेटवर्क - देश और प्रदेश की ताज़ा और निष्पक्ष खबरों के लिए आज ही ऐप डाउनलोड करें:\nhttps://play.google.com/store/apps/details?id=com.prakash.starnewsnetworks2",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="broadcast" size={20} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>STAR NEWS NETWORKS</Text>
            <Text style={styles.headerSubtitle}>ब्यूरो एवं संपर्क डेस्क (Bureau & Desk)</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Bureau Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={require("./Reporter.jpg")}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>प्रकाश श्रीवास्तव</Text>
            <Text style={styles.role}>जिला ब्यूरो प्रमुख • स्टार न्यूज़ नेटवर्क</Text>
            <View style={styles.statusPill}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>सक्रिय संवाददाता (Verified Journalist)</Text>
            </View>
          </View>
        </View>

        {/* Newsroom & Features Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>📰 न्यूज़ डेस्क सेवाएं (Newsroom)</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/saved")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="bookmark" size={18} color={BrandColors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>सहेजे गए समाचार (Saved Articles)</Text>
              <Text style={styles.optionDesc}>आपके द्वारा बुकमार्क की गई विशेष खबरें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/gallery")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="images" size={18} color="#2563EB" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>फोटो गैलरी (Photo Albums)</Text>
              <Text style={styles.optionDesc}>पन्ना एवं क्षेत्रीय घटनाओं की फोटो गैलरी</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/live")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="videocam" size={18} color="#DC2626" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>लाइव बुलेटिन (Live Bulletins)</Text>
              <Text style={styles.optionDesc}>24×7 लाइव वीडियो और विशेष रिपोर्ट</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/login")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FDF2F8" }]}>
              <MaterialCommunityIcons name="shield-account" size={18} color="#DB2777" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>एडमिन पोर्टल (Newsroom CMS Login)</Text>
              <Text style={styles.optionDesc}>अधिकृत पत्रकारों एवं संपादकों के लिए प्रवेश</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Support & Helpline Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>📞 सहायता एवं हेल्पलाइन (Desk Support)</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => openUrl("https://wa.me/917987667358")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>व्हाट्सएप हेल्पलाइन (WhatsApp Desk)</Text>
              <Text style={styles.optionDesc}>समाचार सुझाव एवं विज्ञापन हेतु संपर्क: +91 7987667358</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => Linking.openURL("tel:7987667358")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="call" size={18} color="#2563EB" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>सीधा कॉल करें (Direct Call)</Text>
              <Text style={styles.optionDesc}>ब्यूरो कार्यालय फोन लाइन</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={shareApp}>
            <View style={[styles.iconBox, { backgroundColor: "#F5F3FF" }]}>
              <Ionicons name="share-social" size={18} color="#7C3AED" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>ऐप शेयर करें (Share App)</Text>
              <Text style={styles.optionDesc}>मित्रों और परिजनों के साथ साझा करें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Policies & Legal Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>⚖️ नीतियां एवं कानूनी शर्तें (Legal & Policies)</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setPrivacyVisible(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>गोपनीयता नीति (Privacy Policy)</Text>
              <Text style={styles.optionDesc}>डेटा सुरक्षा एवं उपयोगकर्ता अधिकार</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setTermsVisible(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="document-text" size={18} color="#2563EB" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>नियम एवं शर्तें (Terms & Conditions)</Text>
              <Text style={styles.optionDesc}>संपादकीय नियम एवं उपयोग की शर्तें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Social Media Channels */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>🌐 सोशल मीडिया मंच (Follow Us)</Text>

          <View style={styles.socialGrid}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => openUrl("https://youtube.com/@starnewsnetworks88")}
            >
              <Ionicons name="logo-youtube" size={20} color="#DC2626" />
              <Text style={styles.socialBtnText}>YouTube</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => openUrl("https://www.facebook.com/share/1Dj3yMqD7R/")}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => openUrl("https://www.instagram.com/reel/DSEzE6VjA1u/")}
            >
              <Ionicons name="logo-instagram" size={20} color="#E1306C" />
              <Text style={styles.socialBtnText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>STAR NEWS NETWORKS</Text>
          <Text style={styles.footerTagline}>LOCAL | LIVE | TRUSTED</Text>
          <Text style={styles.footerCopyright}>
            © 2026 Star News Networks. सर्वाधिकार सुरक्षित।
          </Text>
          <Text style={styles.versionText}>संस्करण 2.0.0 (Build 2026.1)</Text>
        </View>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal
        visible={privacyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPrivacyVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: BrandColors.charcoal }}>गोपनीयता नीति (Privacy Policy)</Text>
            <TouchableOpacity onPress={() => setPrivacyVisible(false)} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color={BrandColors.charcoal} />
            </TouchableOpacity>
          </View>
          <Privacy />
        </SafeAreaView>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={termsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTermsVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: BrandColors.charcoal }}>नियम एवं शर्तें (Terms & Conditions)</Text>
            <TouchableOpacity onPress={() => setTermsVisible(false)} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color={BrandColors.charcoal} />
            </TouchableOpacity>
          </View>
          <TermsAndConditions />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.primaryDark,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
  },
  container: {
    padding: 14,
    paddingBottom: 80,
    backgroundColor: BrandColors.background,
    gap: 14,
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: BrandColors.primary,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  role: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  statusText: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "700",
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "900",
    color: BrandColors.charcoal,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  optionDesc: {
    fontSize: 11,
    color: BrandColors.textMuted,
    marginTop: 2,
  },
  socialGrid: {
    flexDirection: "row",
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 6,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 4,
  },
  footerBrand: {
    fontSize: 13,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 1,
  },
  footerTagline: {
    fontSize: 10,
    fontWeight: "800",
    color: BrandColors.primary,
    letterSpacing: 0.8,
  },
  footerCopyright: {
    fontSize: 10,
    color: BrandColors.textMuted,
    marginTop: 4,
  },
  versionText: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },
});