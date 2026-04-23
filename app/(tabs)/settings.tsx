import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  TextInput,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type ModalType =
  | "about"
  | "version"
  | "terms"
  | "privacy"
  | "help"
  | "contact"
  | "news"
  | "";

export default function Settings() {
  const [modal, setModal] = useState<ModalType>("");

  const openModal = (type: ModalType) => setModal(type);
  const closeModal = () => setModal("");

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>Settings</Text>
          <Text style={styles.tagline}>Manage your app experience ⚡</Text>
        </View>

        {/* PROFILE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Profiles</Text>

          <View style={styles.profileRow}>
            <Image
              source={require("@/assets/images/Reporter.jpg")}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Prakash Shrivashtava</Text>
              <Text style={styles.role}>News Reporter</Text>
            </View>
          </View>

          <View style={styles.profileRow}>
            <Image
              source={{ uri: "https://raaz-universe.vercel.app/static/media/raj.4d0a96b1326489011457.png" }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Raj Mehra</Text>
              <Text style={styles.role}>Full Stack Developer</Text>
            </View>
          </View>
        </View>

        {/* APP SETTINGS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>⚙️ App Settings</Text>

          <Option label="About App" icon="info" onPress={() => openModal("about")} />
          <Option label="App Version" icon="smartphone" onPress={() => openModal("version")} />
          <Option label="📰 Submit News" icon="edit" onPress={() => openModal("news")} />
        </View>

        {/* LEGAL */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📄 Legal</Text>

          <Option label="Terms & Conditions" icon="file-text" onPress={() => openModal("terms")} />
          <Option label="Privacy Policy" icon="shield" onPress={() => openModal("privacy")} />
        </View>

        {/* SUPPORT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🛟 Support</Text>

          <Option label="Help Center" icon="help-circle" onPress={() => openModal("help")} />
          <Option label="Contact Us" icon="mail" onPress={() => openModal("contact")} />
        </View>

      </ScrollView>

      {/* MODAL */}
      <Modal visible={modal !== ""} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, modal === "news" && { height: "90%" }]}>

            <Text style={styles.modalTitle}>
              {modal === "news" ? "📰 Submit News" : modal.toUpperCase()}
            </Text>

            {/* CONTENT */}
            {modal !== "news" ? (
              <Text style={styles.modalContent}>
                {getContent(modal)}
              </Text>
            ) : (
              <NewsForm />
            )}

            <Pressable style={styles.closeBtn} onPress={closeModal}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* OPTION COMPONENT */
const Option = ({ label, icon, onPress }: any) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <Feather name={icon} size={18} color="#38bdf8" />
    <Text style={styles.optionText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#64748b" />
  </TouchableOpacity>
);

/* NEWS FORM */
const NewsForm = () => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    content: "",
  });

  return (
    <ScrollView>

      <TextInput
        placeholder="Your Name"
        placeholderTextColor="#aaa"
        style={news.input}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />

      <TextInput
        placeholder="News Title"
        placeholderTextColor="#aaa"
        style={news.input}
        onChangeText={(t) => setForm({ ...form, title: t })}
      />

      <TextInput
        placeholder="Location"
        placeholderTextColor="#aaa"
        style={news.input}
        onChangeText={(t) => setForm({ ...form, location: t })}
      />

      <TextInput
        placeholder="News Content"
        placeholderTextColor="#aaa"
        multiline
        style={[news.input, { height: 100 }]}
        onChangeText={(t) => setForm({ ...form, content: t })}
      />

      <TouchableOpacity style={news.btn}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Submit News
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

/* CONTENT */
const getContent = (type: ModalType): string => {
  switch (type) {
    case "about":
      return "Star News App - Modern news platform with real-time updates.";

    case "version":
      return "Version 1.0.0";

    case "terms":
      return "Use app responsibly and follow content guidelines.";

    case "privacy":
      return "Your data is secure and not shared.";

    case "help":
      return "Contact support for help anytime.";

    case "contact":
      return "📞 +91 7987667358";

    default:
      return "";
  }
};

/* MAIN STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },

  container: { padding: 16, paddingBottom: 40 },

  header: { marginBottom: 15 },

  logo: { fontSize: 26, color: "#38bdf8", fontWeight: "bold" },

  tagline: { color: "#94a3b8" },

  card: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 15,
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#94a3b8",
    marginBottom: 10,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    marginRight: 12,
  },

  name: { color: "#38bdf8", fontWeight: "bold" },

  role: { color: "#fff", fontSize: 12 },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  optionText: {
    color: "#fff",
    flex: 1,
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    color: "#38bdf8",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  modalContent: {
    color: "#fff",
    marginBottom: 15,
  },

  closeBtn: {
    backgroundColor: "#38bdf8",
    padding: 10,
    borderRadius: 10,
  },

  closeText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

/* NEWS FORM STYLE */
const news = StyleSheet.create({
  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
});