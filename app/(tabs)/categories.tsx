import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Categories() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* 🔥 Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Categories</Text>
          <Text style={styles.tagline}>Browse News by Topics ⚡</Text>
        </View>

        {/* 📂 Category List */}
        <View style={styles.section}>

          <View style={styles.row}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>🗳️ Politics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>🏏 Sports</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>💻 Tech</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>🎬 Entertainment</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>🌍 World</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>💰 Business</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>📚 Education</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardText}>⚕️ Health</Text>
            </TouchableOpacity>
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
    paddingTop: 40, // 👈 SAME TOP MARGIN (as Home)
    paddingBottom: 30,
  },

  header: {
    marginBottom: 20,
  },

  logo: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#38bdf8",
  },

  tagline: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: width * 0.035,
  },

  section: {
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1e293b",
    width: width * 0.44,
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",

    // 🔥 shadow (premium look)
    elevation: 5,
  },

  cardText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});