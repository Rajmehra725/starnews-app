import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";
import { apiClient } from "@/_services/api";
import Privacy from "@/components/privacy";
import TermsAndConditions from "@/components/terms";
import About from "@/components/about";
import Contact from "@/components/contact";
import StarHeader from "@/components/StarHeader";
import { StarButtonLoader } from "@/components/StarBrandLoader";

export default function ProfileScreen() {
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [citizenModalVisible, setCitizenModalVisible] = useState(false);

  // Citizen Journalist State
  const [citizenName, setCitizenName] = useState("");
  const [citizenMobile, setCitizenMobile] = useState("");
  const [citizenDistrict, setCitizenDistrict] = useState("पन्ना (Panna)");
  const [citizenTitle, setCitizenTitle] = useState("");
  const [citizenContent, setCitizenContent] = useState("");
  const [submittingCitizen, setSubmittingCitizen] = useState(false);

  // Settings Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const shareApp = async () => {
    try {
      await Share.share({
        title: "स्टार न्यूज़ नेटवर्क ऐप",
        message:
          "🔴 स्टार न्यूज़ नेटवर्क (Star News Networks)\nलोकल • लाइव • भरोसेमंद पत्रकारिता\nपन्ना, मध्य प्रदेश और देश-दुनिया की ताज़ा खबरों के लिए आज ही ऐप डाउनलोड करें:\nhttps://play.google.com/store/apps/details?id=com.prakash.starnewsnetworks2",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.log(err));
  };

  const handleSubmitCitizenNews = async () => {
    if (!citizenName.trim() || !citizenMobile.trim() || !citizenTitle.trim() || !citizenContent.trim()) {
      Alert.alert("अनिवार्य फ़ील्ड", "कृपया नाम, मोबाइल नंबर, शीर्षक और खबर का विवरण भरें।");
      return;
    }

    try {
      setSubmittingCitizen(true);
      await apiClient.post("/api/newsSubmit", {
        name: citizenName.trim(),
        mobile: citizenMobile.trim(),
        district: citizenDistrict,
        title: citizenTitle.trim(),
        content: citizenContent.trim(),
      });

      Alert.alert(
        "खबर प्रेषित की गई 🎉",
        "आपकी खबर स्टार न्यूज़ संपादकीय टीम को सत्यापन एवं प्रकाशन हेतु प्राप्त हो गई है। धन्यवाद!"
      );
      setCitizenName("");
      setCitizenMobile("");
      setCitizenTitle("");
      setCitizenContent("");
      setCitizenModalVisible(false);
    } catch (e) {
      Alert.alert("त्रुटि", "खबर सबमिट करने में विफल। कृपया सीधे व्हाट्सएप पर भेजें।");
    } finally {
      setSubmittingCitizen(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Unified Star Header */}
      <StarHeader
        variant="compact"
        title="STAR NEWS NETWORKS"
        subtitle="ब्यूरो डेस्क एवं पाठक प्रोफाइल (Profile & Bureau)"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Bureau Chief Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={require("./Reporter.jpg")}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{BrandIdentity.bureauChief}</Text>
              <MaterialCommunityIcons name="check-decagram" size={16} color="#2563EB" />
            </View>
            <Text style={styles.role}>{BrandIdentity.bureauTitle}</Text>
            <Text style={styles.region}>स्टार न्यूज़ नेटवर्क • मध्य प्रदेश</Text>
            <View style={styles.statusPill}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>अधिकृत मुख्य संवाददाता (Verified Bureau)</Text>
            </View>
          </View>
        </View>

        {/* Citizen Journalism Card (सिटीजन रिपोर्टर) */}
        <TouchableOpacity
          style={styles.citizenBanner}
          activeOpacity={0.9}
          onPress={() => setCitizenModalVisible(true)}
        >
          <View style={styles.citizenBannerLeft}>
            <View style={styles.citizenIconWrap}>
              <MaterialCommunityIcons name="bullhorn" size={22} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.citizenBannerTitle}>आप भी बनें स्टार न्यूज़ रिपोर्टर</Text>
              <Text style={styles.citizenBannerDesc}>
                अपने गांव या शहर की समस्या या खबर सीधे हमारे संपादकीय डेस्क को भेजें
              </Text>
            </View>
          </View>
          <View style={styles.citizenActionBtn}>
            <Text style={styles.citizenActionText}>खबर भेजें →</Text>
          </View>
        </TouchableOpacity>

        {/* Newsroom Services Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>📰 न्यूज़ डेस्क सेवाएं (Newsroom Services)</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/saved")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="bookmark" size={18} color={BrandColors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>सहेजे गए समाचार (Saved Articles)</Text>
              <Text style={styles.optionDesc}>ऑफलाइन पढ़ने के लिए बुकमार्क की गई खबरें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/gallery")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="images" size={18} color="#2563EB" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>फोटो गैलरी (Photo Albums)</Text>
              <Text style={styles.optionDesc}>पन्ना एवं क्षेत्रीय घटनाओं की फोटो गैलरी</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/(tabs)/live")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="videocam" size={18} color="#DC2626" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>लाइव टीवी एवं बुलेटिन (Live Broadcasts)</Text>
              <Text style={styles.optionDesc}>24×7 लाइव वीडियो और विशेष रिपोर्ट</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/(tabs)/epaper")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
              <MaterialCommunityIcons name="newspaper" size={18} color="#16A34A" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>दैनिक ई-पेपर (E-Paper Edition)</Text>
              <Text style={styles.optionDesc}>आज का डिजिटल प्रिंट अखबार पढ़ें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/login")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FDF2F8" }]}>
              <MaterialCommunityIcons name="shield-account" size={18} color="#DB2777" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>एडमिन पोर्टल (Newsroom CMS Login)</Text>
              <Text style={styles.optionDesc}>अधिकृत पत्रकारों एवं संपादकों के लिए प्रवेश</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Desk Support & Helpline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>📞 सहायता एवं हेल्पलाइन (Helpline Desk)</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => openUrl(`https://wa.me/91${BrandIdentity.helplineDisplay}`)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>व्हाट्सएप हेल्पलाइन (WhatsApp Desk)</Text>
              <Text style={styles.optionDesc}>समाचार सुझाव एवं विज्ञापन: {BrandIdentity.helplinePhone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => Linking.openURL(`tel:${BrandIdentity.helplineDisplay}`)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="call" size={18} color="#2563EB" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>सीधा फोन कॉल (Direct Phone Call)</Text>
              <Text style={styles.optionDesc}>न्यूज़रूम डेस्क: +91 {BrandIdentity.helplineDisplay}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setContactVisible(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons name="mail" size={18} color={BrandColors.charcoal} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>संदेश भेजें (Send Feedback)</Text>
              <Text style={styles.optionDesc}>संपादकीय डेस्क को ईमेल या पत्र भेजें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Preferences & Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>⚙️ ऐप सेटिंग्स एवं जानकारी (Settings & Info)</Text>

          <View style={styles.optionRow}>
            <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="notifications" size={18} color={BrandColors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>ब्रेकिंग न्यूज़ नोटिफिकेशन</Text>
              <Text style={styles.optionDesc}>महत्वपूर्ण समाचारों के तत्काल अलर्ट</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#CBD5E1", true: BrandColors.primaryLight }}
              thumbColor={notificationsEnabled ? BrandColors.primary : "#94A3B8"}
            />
          </View>

          <TouchableOpacity style={styles.optionRow} onPress={shareApp}>
            <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="share-social" size={18} color="#2563EB" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>ऐप शेयर करें (Share App)</Text>
              <Text style={styles.optionDesc}>मित्रों और परिजनों को स्टार न्यूज़ भेजें</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => setAboutVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons name="information-circle" size={18} color={BrandColors.charcoal} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>स्टार न्यूज़ के बारे में (About)</Text>
              <Text style={styles.optionDesc}>हमारा इतिहास, मिशन एवं संपादकीय सिद्धांत</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => setPrivacyVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons name="shield-checkmark" size={18} color="#059669" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>गोपनीयता नीति (Privacy Policy)</Text>
              <Text style={styles.optionDesc}>डेटा सुरक्षा एवं निजता नियम</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => setTermsVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons name="document-text" size={18} color={BrandColors.charcoal} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>नियम एवं शर्तें (Terms & Conditions)</Text>
              <Text style={styles.optionDesc}>उपयोगकर्ता दिशा-निर्देश</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={BrandColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerBrand}>STAR NEWS NETWORKS</Text>
          <Text style={styles.footerTagline}>{BrandIdentity.tagline} • {BrandIdentity.taglineHindi}</Text>
          <Text style={styles.footerVersion}>संस्करण 2.0.0 Pro • पन्ना, मध्य प्रदेश</Text>
        </View>
      </ScrollView>

      {/* Citizen News Submission Modal */}
      <Modal
        visible={citizenModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCitizenModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalHeaderTitle}>सिटीजन रिपोर्टर (Citizen Journalism)</Text>
              <Text style={styles.modalHeaderSub}>संपादकीय डेस्क को स्थानीय खबर भेजें</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setCitizenModalVisible(false)}
            >
              <Ionicons name="close" size={22} color={BrandColors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>आपका पूरा नाम (Name) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. राजेश कुमार"
                placeholderTextColor={BrandColors.textMuted}
                value={citizenName}
                onChangeText={setCitizenName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>मोबाइल नंबर (Mobile Number) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. 9876543210"
                placeholderTextColor={BrandColors.textMuted}
                value={citizenMobile}
                onChangeText={setCitizenMobile}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>जिला / क्षेत्र (District)</Text>
              <TextInput
                style={styles.textInput}
                value={citizenDistrict}
                onChangeText={setCitizenDistrict}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>खबर का शीर्षक (News Title) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="घटना या समस्या का संक्षिप्त शीर्षक"
                placeholderTextColor={BrandColors.textMuted}
                value={citizenTitle}
                onChangeText={setCitizenTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>खबर का पूरा विवरण (Details) *</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: "top" }]}
                placeholder="घटना कहाँ और कब हुई, पूरी जानकारी लिखें..."
                placeholderTextColor={BrandColors.textMuted}
                value={citizenContent}
                onChangeText={setCitizenContent}
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.submitNewsBtn}
              onPress={handleSubmitCitizenNews}
              disabled={submittingCitizen}
            >
              {submittingCitizen ? (
                <StarButtonLoader label="संपादकीय डेस्क को भेजा जा रहा है..." color="#FFF" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="#FFF" />
                  <Text style={styles.submitNewsText}>संपादकीय डेस्क को भेजें</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* About Modal */}
      <Modal visible={aboutVisible} animationType="slide" onRequestClose={() => setAboutVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.modalSubHeader}>
            <TouchableOpacity onPress={() => setAboutVisible(false)} style={styles.modalBackBtn}>
              <Ionicons name="arrow-back" size={22} color={BrandColors.charcoal} />
              <Text style={styles.modalBackText}>वापस जाएं</Text>
            </TouchableOpacity>
          </View>
          <About />
        </SafeAreaView>
      </Modal>

      {/* Contact Modal */}
      <Modal visible={contactVisible} animationType="slide" onRequestClose={() => setContactVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.modalSubHeader}>
            <TouchableOpacity onPress={() => setContactVisible(false)} style={styles.modalBackBtn}>
              <Ionicons name="arrow-back" size={22} color={BrandColors.charcoal} />
              <Text style={styles.modalBackText}>वापस जाएं</Text>
            </TouchableOpacity>
          </View>
          <Contact />
        </SafeAreaView>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={privacyVisible} animationType="slide" onRequestClose={() => setPrivacyVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.modalSubHeader}>
            <TouchableOpacity onPress={() => setPrivacyVisible(false)} style={styles.modalBackBtn}>
              <Ionicons name="arrow-back" size={22} color={BrandColors.charcoal} />
              <Text style={styles.modalBackText}>वापस जाएं</Text>
            </TouchableOpacity>
          </View>
          <Privacy />
        </SafeAreaView>
      </Modal>

      {/* Terms Modal */}
      <Modal visible={termsVisible} animationType="slide" onRequestClose={() => setTermsVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.modalSubHeader}>
            <TouchableOpacity onPress={() => setTermsVisible(false)} style={styles.modalBackBtn}>
              <Ionicons name="arrow-back" size={22} color={BrandColors.charcoal} />
              <Text style={styles.modalBackText}>वापस जाएं</Text>
            </TouchableOpacity>
          </View>
          <TermsAndConditions />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.primaryDark,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...Shadows.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#FCA5A5",
    fontWeight: "600",
    marginTop: 1,
  },
  container: {
    padding: 14,
    paddingBottom: 90,
    backgroundColor: BrandColors.background,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 12,
    alignItems: "center",
    ...Shadows.sm,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: BrandColors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  role: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.primaryDark,
    marginTop: 2,
  },
  region: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
    alignSelf: "flex-start",
    gap: 5,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#065F46",
  },
  citizenBanner: {
    backgroundColor: BrandColors.primaryDeep,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#B91C1C",
    ...Shadows.sm,
  },
  citizenBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  citizenIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  citizenBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFF",
  },
  citizenBannerDesc: {
    fontSize: 11,
    color: "#FEE2E2",
    lineHeight: 15,
    marginTop: 2,
  },
  citizenActionBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  citizenActionText: {
    fontSize: 11,
    fontWeight: "800",
    color: BrandColors.primaryDark,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  optionDesc: {
    fontSize: 11,
    color: BrandColors.textMuted,
    marginTop: 2,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 4,
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.8,
  },
  footerTagline: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  footerVersion: {
    fontSize: 10,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  modalSafe: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  modalHeaderSub: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalContent: {
    padding: 16,
    gap: 12,
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: BrandColors.charcoal,
  },
  submitNewsBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 10,
  },
  submitNewsText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  modalSubHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  modalBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalBackText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
});