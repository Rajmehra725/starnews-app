import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu } from "react-native-paper";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";
import { apiClient, NewsArticle } from "@/_services/api";

/* COMPONENTS */
import Header, { StarHeader } from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import PannaWeatherWidget from "@/components/PannaWeatherWidget";
import BannerSlider from "@/components/BannerSlider";
import NewsList from "@/components/NewsList";
import SatnaNews from "@/components/Satna";
import ChhatarpurNews from "@/components/Chhatarpur";
import CategoryBar, { HOME_CATEGORIES } from "@/components/CategoryBar";
import SearchModal from "@/components/SearchModal";
import OnboardingModal from "@/components/OnboardingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import About from "@/components/about";
import Notifications from "@/components/notifications";
import Contact from "@/components/contact";
import Privacy from "@/components/privacy";
import TermsAndConditions from "@/components/terms";

const DISTRICT_LIST = [
  { id: "panna", name: "पन्ना (Panna)", desc: "मुख्य ब्यूरो एवं स्थानीय कवरेज" },
  { id: "madhya pradesh", name: "मध्य प्रदेश (MP)", desc: "राज्य स्तरीय समाचार" },
  { id: "satna", name: "सतना (Satna)", desc: "सतना जिला एवं विंध्य क्षेत्र" },
  { id: "chhatarpur", name: "छतरपुर (Chhatarpur)", desc: "छतरपुर एवं बुंदेलखंड कवरेज" },
];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("panna");
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [allNewsForSearch, setAllNewsForSearch] = useState<NewsArticle[]>([]);

  const [activeTab, setActiveTab] = useState<
    "home" | "about" | "contact" | "privacy" | "terms" | "notifications"
  >("home");

  // Check onboarding on initial app launch
  useEffect(() => {
    AsyncStorage.getItem("@starnews_onboarding_completed").then((val) => {
      if (!val) {
        setOnboardingVisible(true);
      }
    });
  }, []);

  const handleFinishOnboarding = async () => {
    setOnboardingVisible(false);
    await AsyncStorage.setItem("@starnews_onboarding_completed", "true");
  };

  // Fetch news for global search
  useEffect(() => {
    const loadNewsForSearch = async () => {
      try {
        const res = await apiClient.get<NewsArticle[]>("/api/news");
        if (Array.isArray(res.data)) {
          setAllNewsForSearch(res.data);
        }
      } catch (e) {
        // silently ignore
      }
    };
    loadNewsForSearch();
  }, []);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSelectDistrict = (districtId: string) => {
    setSelectedCategory(districtId);
    setDistrictModalVisible(false);
  };

  const isHome = activeTab === "home";

  const getDistrictDisplayName = () => {
    if (selectedCategory === "panna") return "पन्ना";
    if (selectedCategory === "satna") return "सतना";
    if (selectedCategory === "chhatarpur") return "छतरपुर";
    if (selectedCategory === "madhya pradesh") return "मध्य प्रदेश";
    return "पन्ना";
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Editorial Header (Home or Subscreen) */}
      {isHome ? (
        <Header
          onSearchPress={() => setSearchVisible(true)}
          onNotificationsPress={() => setActiveTab("notifications")}
          onMenuPress={openMenu}
          onDistrictPress={() => setDistrictModalVisible(true)}
          currentDistrict={getDistrictDisplayName()}
          unreadNotifications={true}
        />
      ) : (
        <StarHeader
          variant="compact"
          title={
            activeTab === "notifications"
              ? "ताज़ा सूचनाएं (NEWS ALERTS)"
              : activeTab === "about"
              ? "स्टार न्यूज़ के बारे में"
              : activeTab === "contact"
              ? "हेल्पलाइन व संपर्क"
              : activeTab === "privacy"
              ? "गोपनीयता नीति (Privacy Policy)"
              : "नियम एवं शर्तें (Terms & Conditions)"
          }
          subtitle="लोकल • लाइव • भरोसेमंद | पन्ना ब्यूरो"
          onBackPress={() => setActiveTab("home")}
        />
      )}

      {/* Options Dropdown Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={{ x: 340, y: 55 }}
        contentStyle={styles.menuBox}
      >
        <Menu.Item
          leadingIcon="bookmark-outline"
          title="सहेजे गए लेख (Saved)"
          onPress={() => {
            closeMenu();
            router.push("/saved");
          }}
        />
        <Menu.Item
          leadingIcon="image-multiple-outline"
          title="फोटो गैलरी (Gallery)"
          onPress={() => {
            closeMenu();
            router.push("/gallery");
          }}
        />
        <Menu.Item
          leadingIcon="information-outline"
          title="स्टार न्यूज़ के बारे में"
          onPress={() => {
            closeMenu();
            setActiveTab("about");
          }}
        />
        <Menu.Item
          leadingIcon="phone-outline"
          title="हेल्पलाइन व संपर्क"
          onPress={() => {
            closeMenu();
            setActiveTab("contact");
          }}
        />
        <Menu.Item
          leadingIcon="shield-check-outline"
          title="गोपनीयता नीति (Privacy)"
          onPress={() => {
            closeMenu();
            setActiveTab("privacy");
          }}
        />
        <Menu.Item
          leadingIcon="document-text-outline"
          title="नियम एवं शर्तें (Terms)"
          onPress={() => {
            closeMenu();
            setActiveTab("terms");
          }}
        />
        <Menu.Item
          leadingIcon="shield-account-outline"
          title="पत्रकार लॉगिन (CMS)"
          onPress={() => {
            closeMenu();
            router.push("/login");
          }}
        />
      </Menu>

      {/* Global Search Modal */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        newsList={allNewsForSearch}
      />

      {/* Onboarding Introduction Modal */}
      <OnboardingModal
        visible={onboardingVisible}
        onFinish={handleFinishOnboarding}
      />

      {/* District Switcher Modal */}
      <Modal
        visible={districtModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDistrictModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDistrictModalVisible(false)}
        >
          <View style={styles.districtDialog}>
            <View style={styles.districtDialogHeader}>
              <View style={styles.districtHeaderLeft}>
                <Ionicons name="location-sharp" size={20} color={BrandColors.primary} />
                <Text style={styles.districtDialogTitle}>अपना क्षेत्र चुनें (Select District)</Text>
              </View>
              <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
                <Ionicons name="close" size={22} color={BrandColors.charcoal} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {DISTRICT_LIST.map((dist) => {
              const isSelected = selectedCategory === dist.id;
              return (
                <TouchableOpacity
                  key={dist.id}
                  style={[styles.districtOption, isSelected && styles.activeDistrictOption]}
                  onPress={() => handleSelectDistrict(dist.id)}
                >
                  <View style={styles.districtRadio}>
                    {isSelected && <View style={styles.districtRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.districtName, isSelected && styles.activeDistrictName]}>
                      {dist.name}
                    </Text>
                    <Text style={styles.districtDesc}>{dist.desc}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={BrandColors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>


      {/* MAIN HOME VIEW */}
      {isHome && (
        <View style={styles.homeContainer}>
          {/* District & Beat Category Bar */}
          <CategoryBar
            categories={HOME_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* Conditional Feed based on selected Category */}
          {selectedCategory === "satna" ? (
            <SatnaNews />
          ) : selectedCategory === "chhatarpur" ? (
            <ChhatarpurNews />
          ) : (
            <NewsList
              filterCategory={selectedCategory === "panna" || selectedCategory === "all" ? "" : selectedCategory}
              headerComponent={
                <View>
                  {/* Live Weather & AQI Widget */}
                  <PannaWeatherWidget />

                  {/* Breaking News Marquee Ticker */}
                  <BreakingTicker />

                  {/* Sponsored / Editorial Banner Carousel */}
                  <BannerSlider />
                </View>
              }
            />
          )}
        </View>
      )}

      {/* SECONDARY SCREENS */}
      {activeTab === "notifications" && <Notifications />}
      {activeTab === "about" && <About />}
      {activeTab === "contact" && <Contact />}
      {activeTab === "privacy" && <Privacy />}
      {activeTab === "terms" && <TermsAndConditions />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.primaryDark,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  subpageHeader: {
    backgroundColor: BrandColors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  menuBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginTop: 45,
    ...Shadows.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  districtDialog: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    ...Shadows.lg,
  },
  districtDialogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  districtHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  districtDialogTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.border,
    marginVertical: 12,
  },
  districtOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 12,
    marginBottom: 4,
  },
  activeDistrictOption: {
    backgroundColor: BrandColors.primaryGhost,
  },
  districtRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  districtRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BrandColors.primary,
  },
  districtName: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  activeDistrictName: {
    color: BrandColors.primaryDark,
    fontWeight: "900",
  },
  districtDesc: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
});