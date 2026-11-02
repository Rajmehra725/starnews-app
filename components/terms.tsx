import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";

export default function TermsAndConditions() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>STAR NEWS NETWORKS</Text>
        <View style={styles.line} />
        <Text style={styles.section}>TERMS & CONDITIONS (नियम एवं शर्तें)</Text>
      </View>

      <Text style={styles.title}>उपयोग के नियम एवं शर्तें</Text>
      <Text style={styles.updated}>अंतिम अद्यतन: नवंबर 2026</Text>

      <Text style={styles.description}>
        स्टार न्यूज़ नेटवर्क (Star News Networks) के मोबाइल एप्लिकेशन एवं डिजिटल सेवाओं का उपयोग करने पर आप निम्नलिखित नियमों व शर्तों के अधीन हैं।
      </Text>

      {/* CARD 1: CONTENT ACCURACY */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="newspaper" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>समाचार एवं संपादकीय सत्यनिष्ठा</Text>
        </View>
        <Text style={styles.cardText}>
          हम सत्य, निष्पक्ष और सत्यापित समाचार प्रदान करने के लिए प्रतिबद्ध हैं। हमारे अधिकृत संवाददाता स्थानीय स्तर पर तथ्यों की पुष्टि करते हैं।
        </Text>
      </View>

      {/* CARD 2: CITIZEN REPORTING */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="people" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>नागरिक एवं संवाददाता सबमिशन</Text>
        </View>
        <Text style={styles.cardText}>
          उपयोगकर्ताओं और स्वतंत्र संवाददाताओं द्वारा प्रेषित समाचार संपादकीय समीक्षा के बाद ही प्रकाशित किए जाते हैं। किसी भी भ्रामक या गैरकानूनी सामग्री के लिए प्रेषक स्वयं उत्तरदायी होगा।
        </Text>
      </View>

      {/* CARD 3: INTELLECTUAL PROPERTY */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>बौद्धिक संपदा एवं कॉपीराइट</Text>
        </View>
        <Text style={styles.cardText}>
          स्टार न्यूज़ नेटवर्क पर प्रकाशित सभी लेख, छायाचित्र, वीडियो और ई-पेपर संस्करण कॉपीराइट कानून के तहत संरक्षित हैं। अनधिकृत पुनर्प्रकाशन प्रतिबंधित है।
        </Text>
      </View>

      {/* CARD 4: JURISDICTION */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="business" size={20} color={BrandColors.primary} />
          <Text style={styles.cardTitle}>क्षेत्राधिकार एवं हेल्पलाइन</Text>
        </View>
        <Text style={styles.cardText}>
          किसी भी कानूनी विवाद का समाधान मध्य प्रदेश न्यायालय के अधिकार क्षेत्र में होगा। संपादकीय सुझाव या शिकायत के लिए हमारे व्हाट्सएप डेस्क (+91 7987667358) पर संपर्क करें।
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  brand: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 1,
  },
  line: {
    width: 40,
    height: 3,
    backgroundColor: BrandColors.primary,
    marginVertical: 6,
    borderRadius: 2,
  },
  section: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 4,
  },
  updated: {
    fontSize: 12,
    color: BrandColors.textMuted,
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  cardText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 19,
  },
});
