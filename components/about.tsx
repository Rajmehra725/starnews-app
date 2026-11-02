import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function About() {
  

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>STAR NEWS NETWORK</Text>
        <Text style={styles.tagline}>
          Fast • Reliable • Unbiased Journalism
        </Text>
      </View>

      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Ionicons name="newspaper-outline" size={45} color="#fff" />

        <Text style={styles.heroTitle}>
          Trusted Journalism for Everyone
        </Text>

        <Text style={styles.heroSubtitle}>
          Bringing verified news, live updates, and meaningful stories from
          local districts to national headlines.
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24×7</Text>
          <Text style={styles.statLabel}>Live Updates</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Articles</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50K+</Text>
          <Text style={styles.statLabel}>Readers</Text>
        </View>
      </View>

      {/* ABOUT */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="information-circle" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>About Star News Network</Text>
        </View>

        <Text style={styles.cardText}>
          Star News Network is a modern digital news platform dedicated to
          delivering accurate, fast, and unbiased news coverage. We focus on
          local district news, national developments, politics, sports,
          entertainment, and breaking stories that matter.
        </Text>
      </View>

      {/* MISSION */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="flag" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>Our Mission</Text>
        </View>

        <Text style={styles.cardText}>
          To empower citizens with trustworthy journalism and real-time
          information through innovative technology and responsible reporting.
        </Text>
      </View>

      {/* COVERAGE */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="globe-outline" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>News Coverage</Text>
        </View>

        <Text style={styles.cardText}>
          • Breaking News{"\n"}
          • Local District News{"\n"}
          • Politics & Government{"\n"}
          • Sports Updates{"\n"}
          • Entertainment News{"\n"}
          • Business & Economy{"\n"}
          • Education & Jobs{"\n"}
          • Live Reports
        </Text>
      </View>

      {/* FEATURES */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="star" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>App Features</Text>
        </View>

        <Text style={styles.cardText}>
          • Live News Updates{"\n"}
          • E-Paper Reading{"\n"}
          • Push Notifications{"\n"}
          • Bookmark Articles{"\n"}
          • Reading History{"\n"}
          • Photo Gallery{"\n"}
          • Dark Mode Support{"\n"}
          • Fast Performance
        </Text>
      </View>

      {/* VALUES */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>Our Values</Text>
        </View>

        <Text style={styles.cardText}>
          ✓ Truth & Transparency{"\n"}
          ✓ Ethical Journalism{"\n"}
          ✓ Independent Reporting{"\n"}
          ✓ Public Interest First{"\n"}
          ✓ Accuracy & Credibility
        </Text>
      </View>

      {/* TEAM */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="people" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>Our Team</Text>
        </View>

        <Text style={styles.cardText}>
          Our team consists of experienced journalists, editors, reporters,
          photographers, and developers who work together to provide reliable
          and timely news content.
        </Text>
      </View>

      {/* DISCLAIMER */}
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Disclaimer</Text>

        <Text style={styles.noticeText}>
          News content is collected from verified sources and editorial
          reporting. Readers are advised to independently verify important
          information before taking any action.
        </Text>
      </View>

      {/* CONTACT */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="call" size={22} color="#dc2626" />
          <Text style={styles.cardTitle}>Contact Us</Text>
        </View>

        <Text style={styles.contactText}>
          📞 +91 7987667358
        </Text>

        <Text style={styles.contactText}>
          📧 starnewsnetworks1988@gmail.com
        </Text>

        <Text style={styles.contactText}>
          🌐 www.starnewsnetwork.com
        </Text>
      </View>

      {/* SOCIAL */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Follow Us</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity>
            <Ionicons
              name="logo-facebook"
              size={30}
              color="#1877F2"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons
              name="logo-instagram"
              size={30}
              color="#E1306C"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons
              name="logo-youtube"
              size={30}
              color="#FF0000"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons
              name="logo-twitter"
              size={30}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>
          STAR NEWS NETWORK
        </Text>

        <Text style={styles.footerText}>
          © {new Date().getFullYear()} All Rights Reserved
        </Text>

        <Text style={styles.footerText}>
          Version 1.0.0
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
  },

  brand: {
    fontSize: 24,
    fontWeight: "900",
    color: "#dc2626",
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 5,
    fontWeight: "600",
  },

  hero: {
    margin: 16,
    backgroundColor: "#dc2626",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    elevation: 6,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  heroSubtitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    opacity: 0.95,
  },

  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#dc2626",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 8,
    color: "#111827",
  },

  cardText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#6b7280",
  },

  noticeCard: {
    backgroundColor: "#fff7ed",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },

  noticeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#dc2626",
    marginBottom: 8,
  },

  noticeText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },

  contactText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 10,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 25,
    marginTop: 10,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#dc2626",
  },

  footerText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
});