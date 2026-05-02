import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Privacy() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* 🔴 HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>STAR NEWS NETWORK</Text>
        <View style={styles.line} />
        <Text style={styles.section}>PRIVACY POLICY</Text>
      </View>

      {/* TITLE */}
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last Updated: May 2026</Text>

      {/* INTRO */}
      <Text style={styles.description}>
        Star News Network operates a digital news platform delivering real-time
        updates, breaking news alerts, and regional information. This Privacy
        Policy explains how we handle user data and protect your privacy.
      </Text>

      {/* SECTION CARD */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="information-circle" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Information We Collect</Text>
        </View>

        <Text style={styles.cardText}>
          We collect minimal information such as device details, notification
          tokens, and usage analytics to improve performance. We do NOT collect
          sensitive personal data like passwords or banking details.
        </Text>
      </View>

      {/* USE */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="settings" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>How We Use Information</Text>
        </View>

        <Text style={styles.cardText}>
          • Send breaking news alerts{"\n"}
          • Improve app performance{"\n"}
          • Personalize news content{"\n"}
          • Ensure stability and security
        </Text>
      </View>

      {/* PUSH */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="notifications" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Push Notifications</Text>
        </View>

        <Text style={styles.cardText}>
          Notifications are used only for important news alerts. You can disable
          them anytime from device settings.
        </Text>
      </View>

      {/* THIRD PARTY */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="cloud" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Third-Party Services</Text>
        </View>

        <Text style={styles.cardText}>
          We may use services like Firebase, Google Analytics, or Expo for
          performance monitoring. These services collect anonymous usage data.
        </Text>
      </View>

      {/* SECURITY */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Data Security</Text>
        </View>

        <Text style={styles.cardText}>
          We use industry-standard practices to protect your data, but no system
          is 100% secure.
        </Text>
      </View>

      {/* CHILDREN */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Children's Privacy</Text>
        </View>

        <Text style={styles.cardText}>
          Our service is not intended for children under 13. We do not knowingly
          collect data from children.
        </Text>
      </View>

      {/* CHANGES */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="refresh" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Policy Updates</Text>
        </View>

        <Text style={styles.cardText}>
          We may update this policy occasionally. Changes will be posted inside
          the app.
        </Text>
      </View>

      {/* CONTACT */}
      <View style={styles.cardLight}>
        <Text style={styles.contactTitle}>Contact Us</Text>

        <Text style={styles.contactText}>
          📧 starnews@email.com{"\n"}
          📞 7509291446
        </Text>
      </View>

      {/* AGREEMENT */}
      <Text style={styles.agree}>
        By using Star News Network, you agree to this Privacy Policy.
      </Text>

      {/* FOOTER */}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} Star News Network • All Rights Reserved
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },

  /* HEADER */
  header: {
    marginBottom: 14,
  },

  brand: {
    fontSize: 18,
    fontWeight: "900",
    color: "#dc2626",
    letterSpacing: 1,
  },

  line: {
    height: 2,
    width: 60,
    backgroundColor: "#dc2626",
    marginVertical: 6,
  },

  section: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "700",
  },

  /* TITLE */
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
  },

  updated: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 16,
  },

  /* CARD */
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  cardLight: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  cardText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 20,
  },

  /* CONTACT */
  contactTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#dc2626",
    marginBottom: 6,
  },

  contactText: {
    fontSize: 13,
    color: "#374151",
  },

  /* FOOTER */
  agree: {
    fontSize: 12,
    color: "#dc2626",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },

  footer: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 6,
  },
});