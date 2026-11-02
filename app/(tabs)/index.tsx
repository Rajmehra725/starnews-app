import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu } from "react-native-paper";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { BrandColors } from "@/constants/theme";
import { apiClient, NewsArticle } from "@/_services/api";

/* COMPONENTS */
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import BannerSlider from "@/components/BannerSlider";
import NewsList from "@/components/NewsList";
import SatnaNews from "@/components/Satna";
import ChhatarpurNews from "@/components/Chhatarpur";
import CategoryBar from "@/components/CategoryBar";
import SearchModal from "@/components/SearchModal";
import OnboardingModal from "@/components/OnboardingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import About from "@/components/about";
import Notifications from "@/components/notifications";
import Contact from "@/components/contact";
import Privacy from "@/components/privacy";
import TermsAndConditions from "@/components/terms";

const DISTRICT_CATEGORIES = ["Panna", "Satna", "Chhatarpur", "Madhya Pradesh", "Desh", "Crime", "Sports"];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("panna");
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [allNewsForSearch, setAllNewsForSearch] = useState<NewsArticle[]>([]);

  const [activeTab, setActiveTab] = useState<
    "home" | "about" | "contact" | "privacy" | "terms" | "notifications"
  >("home");

  // Check onboarding
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

  const isHome = activeTab === "home";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Branded Header */}
      <Header
        onSearchPress={() => setSearchVisible(true)}
        onNotificationsPress={() => setActiveTab("notifications")}
        onMenuPress={openMenu}
        unreadNotifications={true}
      />

      {/* Options Menu Modal/Dropdown */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={{ x: 340, y: 55 }}
        contentStyle={styles.menuBox}
      >
        <Menu.Item
          leadingIcon="bookmark-outline"
          title="Saved Articles"
          onPress={() => {
            closeMenu();
            router.push("/saved");
          }}
        />
        <Menu.Item
          leadingIcon="information-outline"
          title="About Star News"
          onPress={() => {
            closeMenu();
            setActiveTab("about");
          }}
        />
        <Menu.Item
          leadingIcon="phone-outline"
          title="Contact Helpline"
          onPress={() => {
            closeMenu();
            setActiveTab("contact");
          }}
        />
        <Menu.Item
          leadingIcon="shield-check-outline"
          title="Privacy Policy"
          onPress={() => {
            closeMenu();
            setActiveTab("privacy");
          }}
        />
        <Menu.Item
          leadingIcon="document-text-outline"
          title="Terms & Conditions"
          onPress={() => {
            closeMenu();
            setActiveTab("terms");
          }}
        />
        <Menu.Item
          leadingIcon="shield-account-outline"
          title="Journalist / Admin Login"
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

      {/* Subpage Header if not in home */}
      {!isHome && (
        <View style={styles.subpageHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveTab("home")}
          >
            <Ionicons name="arrow-back" size={20} color={BrandColors.charcoal} />
            <Text style={styles.backText}>Back to Headlines</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* HOME VIEW */}
      {isHome && (
        <View style={styles.homeContainer}>
          {/* Category Bar */}
          <CategoryBar
            categories={DISTRICT_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* News Feed based on Category */}
          {selectedCategory === "satna" ? (
            <SatnaNews />
          ) : selectedCategory === "chhatarpur" ? (
            <ChhatarpurNews />
          ) : (
            <NewsList
              filterCategory={selectedCategory === "panna" ? "" : selectedCategory}
              headerComponent={
                <View>
                  {/* Breaking News Ticker */}
                  <BreakingTicker />

                  {/* Sponsored / Editorial Banners */}
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
    borderRadius: 8,
    marginTop: 45,
  },
});