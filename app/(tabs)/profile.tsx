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

export default function Profile() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 👤 Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Profile</Text>
          <Text style={styles.tagline}>Manage your account ⚡</Text>
        </View>

        {/* 👤 User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>

          <Text style={styles.name}>Raaz Mehra</Text>
          <Text style={styles.email}>raaz@email.com</Text>
        </View>

        {/* ⚙️ Options */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>📝 Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>🔔 Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>⚙️ Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>🚪 Logout</Text>
          </TouchableOpacity>
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

  profileCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#38bdf8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  avatarText: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },

  email: {
    color: "#94a3b8",
    marginTop: 4,
  },

  section: {
    marginTop: 10,
  },

  option: {
    backgroundColor: "#334155",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  optionText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});