import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";

export default function About() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandTitleRow}>
          <Text style={styles.brandWhite}>STAR </Text>
          <Text style={styles.brandRed}>NEWS</Text>
        </View>
        <Text style={styles.parentBrand}>NETWORKS</Text>
        <View style={styles.taglineBadge}>
          <Text style={styles.taglineText}>Local • Live • Trusted | लोकल • लाइव • भरोसेमंद</Text>
        </View>
      </View>

      {/* HERO SECTION */}
      <View style={styles.hero}>
        <MaterialCommunityIcons name="broadcast" size={40} color="#fff" />
        <Text style={styles.heroTitle}>पन्ना एवं बुंदेलखंड का निष्पक्ष आवाज़</Text>
        <Text style={styles.heroSubtitle}>
          सत्य, गति और विश्वसनीयता के साथ पन्ना जिला, मध्य प्रदेश एवं देश-दुनिया की प्रामाणिक पत्रकारिता।
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24×7</Text>
          <Text style={styles.statLabel}>लाइव कवरेज</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>पन्ना</Text>
          <Text style={styles.statLabel}>मुख्य केंद्र</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>सत्यापित समाचार</Text>
        </View>
      </View>

      {/* BRAND & BUREAU IDENTITY */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>स्टार न्यूज़ नेटवर्क परिचय</Text>
        </View>
        <Text style={styles.cardText}>
          स्टार न्यूज़ (Star News) मध्य प्रदेश के पन्ना जिले से संचालित अग्रणी डिजिटल एवं ज़मीनी समाचार नेटवर्क है। हमारा लक्ष्य पन्ना, सतना, छतरपुर, रीवा और समूचे बुंदेलखंड क्षेत्र के नागरिकों तक विश्वसनीय, त्वरित और निष्पक्ष समाचार पहुँचाना है।
        </Text>
      </View>

      {/* EDITORIAL MISSION */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="flag" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>हमारा संपादकीय संकल्प</Text>
        </View>
        <Text style={styles.cardText}>
          • जनहित एवं जनसरोकारों को प्राथमिकता{"\n"}
          • भ्रामक एवं असत्यापित खबरों से मुक्त रिपोर्टिंग{"\n"}
          • ग्रामीण एवं ज़मीनी मुद्दों को मुख्यधारा में लाना{"\n"}
          • डिजिटल क्रांति के ज़रिए त्वरित सूचना प्रसारण
        </Text>
      </View>

      {/* COVERAGE BEATS */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="globe-outline" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>मुख्य कवरेज क्षेत्र</Text>
        </View>
        <Text style={styles.cardText}>
          📍 मुख्य केंद्र: पन्ना (Panna, Madhya Pradesh){"\n"}
          📍 क्षेत्रीय कवरेज: सतना, छतरपुर, रीवा, बुंदेलखंड{"\n"}
          📍 राष्ट्रीय एवं प्रादेशिक: भोपाल, मध्य प्रदेश, देश-दुनिया{"\n"}
          📍 विशेष बीट्स: अपराध, राजनीति, शिक्षा, खेल, मनोरंजन, व्यापार
        </Text>
      </View>

      {/* BUREAU DESK */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>ब्यूरो नेतृत्व</Text>
        </View>
        <Text style={styles.cardText}>
          जिला ब्यूरो प्रमुख: {BrandIdentity.bureauChief}{"\n"}
          संपादकीय डेस्क: पन्ना, मध्य प्रदेश{"\n"}
          हेल्पलाइन: {BrandIdentity.helplinePhone}{"\n"}
          ईमेल: {BrandIdentity.helplineEmail}
        </Text>
      </View>

      {/* DISCLAIMER */}
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>संपादकीय घोषणा</Text>
        <Text style={styles.noticeText}>
          स्टार न्यूज़ नेटवर्क पर प्रकाशित समस्त समाचार, लेख एवं विचार पत्रकारिता के सर्वोच्च मानकों एवं सूचना प्रौद्योगिकी अधिनियम के दिशा-निर्देशों के अनुरूप प्रकाशित किए जाते हैं।
        </Text>
      </View>

      <View style={styles.footerSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  brandTitleRow: {
    flexDirection: "row",
  },
  brandWhite: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  brandRed: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FCA5A5",
    letterSpacing: 1,
  },
  parentBrand: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.75)",
    letterSpacing: 4,
    marginTop: 2,
  },
  taglineBadge: {
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  taglineText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  hero: {
    backgroundColor: BrandColors.charcoal,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 12,
    marginTop: -10,
    borderRadius: 14,
    ...Shadows.md,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 12,
    marginVertical: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.primaryDark,
  },
  statLabel: {
    fontSize: 10,
    color: BrandColors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  cardText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
  },
  noticeCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.primaryDark,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 11,
    color: "#7F1D1D",
    lineHeight: 16,
  },
  footerSpacing: {
    height: 40,
  },
});