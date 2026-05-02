import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Contact() {
  const phone = "7987667358";
  const email = "starnewsnetworks1988@gmail.com";

  const openDialer = () => Linking.openURL(`tel:${phone}`);
  const openEmail = () => Linking.openURL(`mailto:${email}`);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* 🔴 NEWS HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>STAR NEWS NETWORK</Text>
        <View style={styles.line} />
        <Text style={styles.section}>CONTACT DESK</Text>
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>
          Editorial • Support • Business Enquiries
        </Text>
      </View>

      {/* PHONE */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="call" size={20} color="#dc2626" />
        </View>

        <Text style={styles.cardTitle}>Phone Support</Text>
        <Text style={styles.cardDesc}>
          For urgent queries and breaking news tips.
        </Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={openDialer}>
          <Text style={styles.btnText}>Call Now</Text>
        </TouchableOpacity>
      </View>

      {/* EMAIL */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail" size={20} color="#111827" />
        </View>

        <Text style={styles.cardTitle}>Email Support</Text>
        <Text style={styles.cardDesc}>
          Feedback, complaints & business enquiries.
        </Text>

        <TouchableOpacity style={styles.secondaryBtn} onPress={openEmail}>
          <Text style={styles.btnTextDark}>Send Email</Text>
        </TouchableOpacity>
      </View>

      {/* OFFICE */}
      <View style={styles.officeCard}>
        <Text style={styles.officeTitle}>Newsroom Office</Text>

        <Text style={styles.officeText}>
          Star News Network{"\n"}
          Digital Media Division{"\n\n"}
          🕒 10:00 AM – 8:00 PM{"\n"}
          📍 India
        </Text>
      </View>

      {/* DISCLAIMER */}
      <Text style={styles.disclaimer}>
        Response time may vary depending on query volume. For urgent tips,
        please use phone support.
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
    marginBottom: 16,
  },

  brand: {
    fontSize: 18,
    fontWeight: "900",
    color: "#dc2626",
    letterSpacing: 1,
  },

  line: {
    height: 2,
    backgroundColor: "#dc2626",
    width: 60,
    marginVertical: 6,
  },

  section: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
  },

  /* HERO */
  hero: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  /* CARD */
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  iconCircle: {
    backgroundColor: "#fef2f2",
    padding: 10,
    borderRadius: 50,
    width: 40,
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  cardDesc: {
    fontSize: 13,
    color: "#6b7280",
    marginVertical: 8,
  },

  primaryBtn: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  secondaryBtn: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  btnTextDark: {
    color: "#111827",
    textAlign: "center",
    fontWeight: "700",
  },

  /* OFFICE */
  officeCard: {
    backgroundColor: "#fafafa",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },

  officeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#dc2626",
    marginBottom: 8,
  },

  officeText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  /* FOOTER */
  disclaimer: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
  },

  footer: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 6,
  },
});