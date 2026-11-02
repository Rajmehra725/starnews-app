import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface OnboardingModalProps {
  visible: boolean;
  onFinish: () => void;
}

export default function OnboardingModal({ visible, onFinish }: OnboardingModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onFinish}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top Brand Header */}
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="broadcast" size={24} color="#FFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>STAR NEWS NETWORKS</Text>
              <Text style={styles.brandTagline}>LOCAL | LIVE | TRUSTED</Text>
            </View>
          </View>

          <Text style={styles.welcomeTitle}>
            मध्य प्रदेश के प्रमुख डिजिटल न्यूज़ नेटवर्क में आपका स्वागत है
          </Text>

          {/* Features Highlights */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="flash" size={20} color={BrandColors.primary} />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={styles.featureHeading}>24×7 लाइव एवं ब्रेकिंग न्यूज़</Text>
                <Text style={styles.featureSub}>
                  पन्ना, सतना, छतरपुर एवं मध्य प्रदेश की ताज़ा खबरें सबसे पहले।
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: "#EFF6FF" }]}>
                <Ionicons name="newspaper" size={20} color="#2563EB" />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={styles.featureHeading}>डिजिटल ई-पेपर एवं वीडियो बुलेटिन</Text>
                <Text style={styles.featureSub}>
                  प्रतिदिन का डिजिटल समाचार पत्र और यूट्यूब वीडियो बुलेटिन सीधे ऐप में।
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: "#F0FDF4" }]}>
                <Ionicons name="notifications" size={20} color="#16A34A" />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={styles.featureHeading}>विश्वसनीय एवं निष्पक्ष रिपोर्टिंग</Text>
                <Text style={styles.featureSub}>
                  ग्राउंड जीरो से हमारे अधिकृत संवाददाताओं द्वारा सत्यापित खबरें।
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.skipBtn} onPress={onFinish}>
              <Text style={styles.skipText}>छोड़ें (Skip)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.getStartedBtn} onPress={onFinish}>
              <Text style={styles.getStartedText}>शुरू करें (Get Started)</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: Math.min(width - 32, 420),
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    ...Shadows.lg,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.8,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primary,
    letterSpacing: 1.2,
    marginTop: 1,
  },
  welcomeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  featureIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  featureTextCol: {
    flex: 1,
  },
  featureHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 2,
  },
  featureSub: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 17,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: BrandColors.textSecondary,
  },
  getStartedBtn: {
    flex: 1,
    backgroundColor: BrandColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Shadows.sm,
  },
  getStartedText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
