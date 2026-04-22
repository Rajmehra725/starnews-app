import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Search() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 🔍 Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Search</Text>
          <Text style={styles.tagline}>Find your news instantly ⚡</Text>
        </View>

        {/* 🔎 Search Box */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search news..."
            placeholderTextColor="#94a3b8"
            style={styles.input}
          />
        </View>

        {/* 🔥 Trending Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>#India</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>#Elections</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>#Cricket</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tag}>
              <Text style={styles.tagText}>#Technology</Text>
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
    paddingTop: 40, // 👈 SAME TOP MARGIN
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

  searchBox: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },

  input: {
    color: "#fff",
    fontSize: width * 0.04,
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tag: {
    backgroundColor: "#334155",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: width * 0.44,
    alignItems: "center",
  },

  tagText: {
    color: "#fff",
    fontWeight: "600",
  },
});