import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient } from "@/_services/api";

export default function Contact() {
  const phone = "7987667358";
  const email = "starnewsnetworks1988@gmail.com";

  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openDialer = () => Linking.openURL(`tel:${phone}`);
  const openEmail = () => Linking.openURL(`mailto:${email}`);

  const handleSendMessage = async () => {
    if (!name.trim() || !userPhone.trim() || !message.trim()) {
      Alert.alert("अनिवार्य फ़ील्ड", "कृपया नाम, फोन नंबर और संदेश भरें।");
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post("/api/contact", {
        name: name.trim(),
        phone: userPhone.trim(),
        message: message.trim(),
      });

      Alert.alert("संदेश भेजा गया", "आपका संदेश स्टार न्यूज़ डेस्क को सफलतापूर्वक भेज दिया गया है।");
      setName("");
      setUserPhone("");
      setMessage("");
    } catch (e) {
      Alert.alert("त्रुटि", "संदेश भेजने में विफल। कृपया सीधे फोन या ईमेल करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* NEWS HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>STAR NEWS NETWORKS</Text>
        <View style={styles.line} />
        <Text style={styles.section}>CONTACT & HELPLINE DESK</Text>
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.title}>संपर्क डेस्क (Get in Touch)</Text>
        <Text style={styles.subtitle}>
          संपादकीय सुझाव • शिकायत निवारण • विज्ञापन एवं सहयोग
        </Text>
      </View>

      {/* SEND MESSAGE FORM */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>संदेश भेजें (Send a Message)</Text>

        <TextInput
          style={styles.formInput}
          placeholder="आपका पूरा नाम (Your Name)"
          placeholderTextColor={BrandColors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.formInput}
          placeholder="मोबाइल नंबर (Phone Number)"
          placeholderTextColor={BrandColors.textMuted}
          value={userPhone}
          onChangeText={setUserPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.formInput, { height: 80, textAlignVertical: "top" }]}
          placeholder="अपना संदेश या समाचार सुझाव लिखें..."
          placeholderTextColor={BrandColors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSendMessage}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="send" size={16} color="#FFF" />
              <Text style={styles.submitBtnText}>संदेश प्रेषित करें</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* PHONE SUPPORT CARD */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="call" size={20} color={BrandColors.primary} />
        </View>
        <Text style={styles.cardTitle}>फोन हेल्पलाइन (Phone Helpline)</Text>
        <Text style={styles.cardDesc}>
          अति आवश्यक समाचार सूचना एवं ब्रेकिंग टिप्स के लिए सीधे बात करें: +91 7987667358
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={openDialer}>
          <Ionicons name="call-outline" size={16} color="#FFF" />
          <Text style={styles.btnText}>अभी कॉल करें (Call Now)</Text>
        </TouchableOpacity>
      </View>

      {/* EMAIL CARD */}
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: "#F3F4F6" }]}>
          <Ionicons name="mail" size={20} color={BrandColors.charcoal} />
        </View>
        <Text style={styles.cardTitle}>ईमेल संपर्क (Official Email)</Text>
        <Text style={styles.cardDesc}>
          संपादकीय पत्र, शिकायत एवं आधिकारिक पत्राचार हेतु: starnewsnetworks1988@gmail.com
        </Text>
        <TouchableOpacity style={styles.secondaryBtn} onPress={openEmail}>
          <Ionicons name="mail-outline" size={16} color={BrandColors.charcoal} />
          <Text style={styles.btnTextDark}>ईमेल भेजें (Send Email)</Text>
        </TouchableOpacity>
      </View>

      {/* OFFICE DETAILS */}
      <View style={styles.officeCard}>
        <Text style={styles.officeTitle}>न्यूज़रूम मुख्य कार्यालय (Bureau Office)</Text>
        <Text style={styles.officeText}>
          स्टार न्यूज़ नेटवर्क (Star News Networks){"\n"}
          डिजिटल मीडिया एवं प्रसारण प्रभाग{"\n\n"}
          🕒 कार्य समय: 24×7 समाचार निगरानी डेस्क{"\n"}
          📍 मध्य प्रदेश, भारत
        </Text>
      </View>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} Star News Networks • सर्वाधिकार सुरक्षित
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  brand: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.primary,
    letterSpacing: 1,
  },
  line: {
    height: 2,
    backgroundColor: BrandColors.primary,
    width: 50,
    marginVertical: 4,
  },
  section: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.textMuted,
    letterSpacing: 0.5,
  },
  hero: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  subtitle: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
    ...Shadows.sm,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: BrandColors.charcoal,
  },
  submitBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  iconCircle: {
    backgroundColor: "#FEE2E2",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  cardDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginVertical: 6,
    lineHeight: 18,
  },
  primaryBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 6,
  },
  btnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 6,
  },
  btnTextDark: {
    color: BrandColors.charcoal,
    fontSize: 13,
    fontWeight: "700",
  },
  officeCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  officeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 8,
  },
  officeText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    fontSize: 11,
    color: BrandColors.textMuted,
    textAlign: "center",
    marginBottom: 30,
  },
});