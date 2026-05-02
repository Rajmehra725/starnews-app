import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  TextInput,
  Share,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FontAwesome,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= ACTIONS ================= */

  const shareApp = async () => {
    await Share.share({
      message:
        "📢 Star News App - Latest Breaking News 🔥\nDownload now & stay updated!",
    });
  };

  const open = (url: string) => Linking.openURL(url);

  const callNow = () => Linking.openURL("tel:7987667358");

  const whatsapp = () => Linking.openURL("https://wa.me/917987667358");

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>STAR NEWS</Text>
          <Text style={styles.tagline}>Trusted Local News Platform</Text>

          <View style={styles.timeBox}>
            <Text style={styles.timeText}>🕒 {formatTime(time)}</Text>
            <Text style={styles.dateText}>📅 {formatDate(time)}</Text>
          </View>
        </View>

        {/* TEAM */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Team</Text>

          <View style={styles.profileRow}>
            <Image
              source={require("@/assets/images/Reporter.jpg")}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>Prakash Shrivashtava</Text>
              <Text style={styles.role}>Senior Reporter</Text>
            </View>
          </View>

          <View style={styles.profileRow}>
            <Image
              source={{
                uri: "https://raaz-universe.vercel.app/static/media/raj.4d0a96b1326489011457.png",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>Raj Mehra</Text>
              <Text style={styles.role}>Tech Lead</Text>
            </View>
          </View>
        </View>

        {/* CONNECT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📲 Connect & Share</Text>

          <Option
            icon={<Feather name="share-2" size={18} color="#d32f2f" />}
            label="Share App"
            onPress={shareApp}
          />

          <Option
            icon={<FontAwesome name="whatsapp" size={18} color="#25D366" />}
            label="WhatsApp Support"
            onPress={whatsapp}
          />

          <Option
            icon={<Feather name="phone" size={18} color="#1877F2" />}
            label="Call Us"
            onPress={callNow}
          />
        </View>

        {/* SOCIAL MEDIA */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌐 Social Media</Text>

          <Option
            icon={<FontAwesome name="instagram" size={18} color="#E1306C" />}
            label="Instagram"
            onPress={() =>
              open(
                "https://www.instagram.com/reel/DSEzE6VjA1u/?igsh=enR1OGZ0ZmN4enhz"
              )
            }
          />

          <Option
            icon={<FontAwesome name="facebook" size={18} color="#1877F2" />}
            label="Facebook"
            onPress={() =>
              open("https://www.facebook.com/share/1Dj3yMqD7R/")
            }
          />

          <Option
            icon={<FontAwesome name="youtube-play" size={18} color="#FF0000" />}
            label="YouTube"
            onPress={() =>
              open(
                "https://youtube.com/@starnewsnetworks88?si=HHAEJevcHq48Fdrh"
              )
            }
          />

          <Option
            icon={<FontAwesome name="twitter" size={18} color="#000" />}
            label="X (Twitter)"
            onPress={() => open("https://x.com/starnews88")}
          />
        </View>

        {/* LEGAL */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📄 Legal</Text>

          <Option
            icon={<Feather name="file-text" size={18} color="#d32f2f" />}
            label="Terms & Conditions"
            onPress={() => setModal("terms")}
          />

          <Option
            icon={<Feather name="shield" size={18} color="#d32f2f" />}
            label="Privacy Policy"
            onPress={() => setModal("privacy")}
          />
        </View>

      </ScrollView>

      {/* MODAL */}
      <Modal visible={modal !== ""} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modal === "news" ? "📰 Submit News" : modal.toUpperCase()}
            </Text>

            {modal !== "news" ? (
              <Text style={styles.modalContent}>{getContent(modal)}</Text>
            ) : (
              <NewsForm />
            )}

            <Pressable style={styles.closeBtn} onPress={() => setModal("")}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* OPTION COMPONENT */
const Option = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <View style={styles.iconBox}>{icon}</View>
    <Text style={styles.optionText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#aaa" />
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
      <TextInput placeholder="Your Name" style={news.input} />
      <TextInput placeholder="News Title" style={news.input} />
      <TextInput placeholder="Location" style={news.input} />
      <TextInput
        placeholder="News Content"
        style={[news.input, { height: 100 }]}
        multiline
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
const getContent = (type: ModalType) => {
  switch (type) {
    case "terms":
      return "Use app responsibly and follow guidelines.";
    case "privacy":
      return "Your data is safe and encrypted.";
    default:
      return "";
  }
};

/* STYLES */
const styles = StyleSheet.create({
  /* APP BACKGROUND */
  safe: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },

  container: {
    padding: 18,
    paddingBottom: 60,
  },

  /* HEADER */
  header: {
    marginBottom: 20,
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#B71C1C",
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  /* TIME BOX (PREMIUM CARD STYLE) */
  timeBox: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,

    borderLeftWidth: 5,
    borderLeftColor: "#D32F2F",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  timeText: {
    color: "#D32F2F",
    fontSize: 13,
    fontWeight: "700",
  },

  dateText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },

  /* MAIN CARD */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#EEF0F3",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  /* PROFILE */
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#F1F1F1",
  },

  name: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  role: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  /* OPTION ROW (MODERN LIST ITEM) */
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginRight: 12,
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#B71C1C",
    marginBottom: 12,
  },

  modalContent: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },

  closeBtn: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },

  closeText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 14,
  },
});

/* NEWS FORM (PREMIUM INPUT STYLE) */
const news = StyleSheet.create({
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  btn: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
});