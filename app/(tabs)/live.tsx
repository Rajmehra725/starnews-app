import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Live() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 🔴 Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Live News 🔴</Text>
          <Text style={styles.tagline}>Watch Live Updates Now ⚡</Text>
        </View>

        {/* 📺 Live Video Card */}
        <View style={styles.liveCard}>
          <Text style={styles.liveText}>🔴 LIVE NOW</Text>
          <Text style={styles.videoTitle}>
            India Breaking News Live Streaming
          </Text>

          {/* ▶️ Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Watch Live</Text>
          </TouchableOpacity>
        </View>

        {/* 📰 Live Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Updates</Text>

          <View style={styles.updateCard}>
            <Text style={styles.updateText}>
              🔴 Government announces new tech policy in 2026.
            </Text>
          </View>

          <View style={styles.updateCard}>
            <Text style={styles.updateText}>
              🔴 Cricket match highlights streaming live now.
            </Text>
          </View>

          <View style={styles.updateCard}>
            <Text style={styles.updateText}>
              🔴 Stock market shows rapid growth today.
            </Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: 40, // 👈 SAME TOP MARGIN
    paddingBottom: 30,
  },

  header: {
    marginBottom: 20,
  },

  logo: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#f43f5e", // 🔴 red highlight for live
  },

  tagline: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: width * 0.035,
  },

  liveCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },

  liveText: {
    color: "#f43f5e",
    fontWeight: "bold",
    marginBottom: 10,
  },

  videoTitle: {
    color: "#fff",
    fontSize: width * 0.045,
    textAlign: "center",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#f43f5e",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 10,
  },

  updateCard: {
    backgroundColor: "#334155",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  updateText: {
    color: "#fff",
  },
});