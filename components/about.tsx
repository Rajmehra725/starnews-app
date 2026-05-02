import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function About() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* 🔴 HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>STAR NEWS NETWORK</Text>
        <View style={styles.line} />
        <Text style={styles.tagline}>Local • Live • Trusted</Text>
      </View>

      {/* HERO */}
      <Text style={styles.title}>About Us</Text>

      <Text style={styles.description}>
        Star News Network is a modern digital news platform delivering fast,
        accurate, and unbiased news coverage across local and national levels.
        We focus on real-time updates, verified reporting, and meaningful stories.
      </Text>

      {/* MISSION CARD */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="flag" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Our Mission</Text>
        </View>

        <Text style={styles.cardText}>
          To provide reliable journalism powered by technology, ensuring instant
          access to truthful and relevant news.
        </Text>
      </View>

      {/* COVERAGE */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="newspaper" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>What We Cover</Text>
        </View>

        <Text style={styles.cardText}>
          • Breaking News Alerts{"\n"}
          • Local District Updates (Panna, Satna, Chhatarpur){"\n"}
          • National & Political News{"\n"}
          • Entertainment & Sports{"\n"}
          • Trending Stories & Live Reports
        </Text>
      </View>

      {/* FEATURES */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="star" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Why Choose Us</Text>
        </View>

        <Text style={styles.cardText}>
          • Fast & real-time news delivery{"\n"}
          • Clean and modern UI{"\n"}
          • Push notifications{"\n"}
          • Verified content only{"\n"}
          • Optimized performance
        </Text>
      </View>

      {/* TEAM */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="people" size={20} color="#dc2626" />
          <Text style={styles.cardTitle}>Our Team</Text>
        </View>

        <Text style={styles.cardText}>
          A dedicated team of developers, journalists, and content creators
          working continuously to deliver accurate and timely news.
        </Text>
      </View>

      {/* DISCLAIMER */}
      <View style={styles.cardLight}>
        <Text style={styles.disclaimerTitle}>Disclaimer</Text>

        <Text style={styles.disclaimerText}>
          News content is sourced from trusted channels and editorial inputs.
          Users are advised to verify critical information independently.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Star News Network
        </Text>

        <Text style={styles.footerTextSmall}>
          Contact: 7987667358 | starnewsnetworks1988@gmail.com
        </Text>
      </View>

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

  tagline: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },

  /* TITLE */
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 18,
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
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  cardText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },

  /* DISCLAIMER */
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#dc2626",
    marginBottom: 6,
  },

  disclaimerText: {
    fontSize: 13,
    color: "#6b7280",
  },

  /* FOOTER */
  footer: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 12,
    marginTop: 10,
  },

  footerText: {
    fontSize: 13,
    color: "#6b7280",
  },

  footerTextSmall: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
});