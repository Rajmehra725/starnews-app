import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, IconButton, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

import BreakingTicker from "@/components/BreakingTicker";
import BannerSlider from "@/components/BannerSlider";
import NewsList from "@/components/NewsList";
import SatnaNews from "@/components/Satna";
import ChhatarpurNews from "@/components/Chhatarpur";

import About from "@/components/about";
import Contact from "@/components/contact";
import Privacy from "@/components/privacy";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("panna");
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const scrollRef = useRef<FlatList<any>>(null);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const isHome = activeTab === "home";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#991b1b" />

      {/* 🔝 FLOAT BUTTON */}
      {isHome && (
        <TouchableOpacity style={styles.fab} onPress={scrollToTop}>
          <MaterialIcons name="arrow-upward" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {/* 🔴 HEADER */}
      <View style={styles.header}>
        {activeTab !== "home" ? (
          <TouchableOpacity onPress={() => setActiveTab("home")}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.logo}>STAR NEWS</Text>
            <Text style={styles.tag}>Local • Live • Trusted</Text>
          </View>
        )}

        {/* ⭐ PREMIUM MENU */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={styles.menuBox}
          anchor={
            <IconButton
              icon="dots-vertical"
              iconColor="#fff"
              size={24}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            title="Home"
            onPress={() => { setActiveTab("home"); closeMenu(); }}
            leadingIcon={() => <MaterialIcons name="home" size={20} />}
          />
          <Menu.Item
            title="About"
            onPress={() => { setActiveTab("about"); closeMenu(); }}
            leadingIcon={() => <MaterialIcons name="info" size={20} />}
          />
          <Menu.Item
            title="Contact"
            onPress={() => { setActiveTab("contact"); closeMenu(); }}
            leadingIcon={() => <MaterialIcons name="call" size={20} />}
          />
          <Divider />
          <Menu.Item
            title="Privacy Policy"
            onPress={() => { setActiveTab("privacy"); closeMenu(); }}
            leadingIcon={() => <MaterialIcons name="privacy-tip" size={20} />}
          />
        </Menu>
      </View>

      {/* 📄 HOME */}
      {isHome && (
        <FlatList
          ref={scrollRef}
          data={[{ id: "main" }]}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <>
              {/* 🔥 BREAKING */}
              <View style={styles.card}>
                <BreakingTicker />
              </View>

              {/* 🎥 BANNER */}
              <View style={styles.bannerCard}>
                <BannerSlider />
              </View>

              {/* ⚡ FILTERS */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickRow}>
                  {["Top", "24H", "Trending", "Editor's Pick"].map((item, i) => (
                    <TouchableOpacity key={i} style={styles.quickBtn}>
                      <Text style={styles.quickText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* 📍 CATEGORY */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.locationBar}>
                  {["Panna", "Satna", "Chhatarpur"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setSelectedCategory(item.toLowerCase())}
                      style={[
                        styles.chip,
                        selectedCategory === item.toLowerCase() &&
                          styles.activeChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedCategory === item.toLowerCase() &&
                            styles.activeText,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.sectionTitle}>Latest News</Text>
            </>
          )}
          renderItem={() => (
            <View style={styles.newsWrap}>
              {selectedCategory === "panna" && <NewsList />}
              {selectedCategory === "satna" && <SatnaNews />}
              {selectedCategory === "chhatarpur" && <ChhatarpurNews />}
            </View>
          )}
        />
      )}

      {activeTab === "about" && <About />}
      {activeTab === "contact" && <Contact />}
      {activeTab === "privacy" && <Privacy />}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#991b1b",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 10,
  },

  logo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },

  tag: {
    fontSize: 11,
    color: "#fecaca",
  },

  /* ⭐ MENU */
  menuBox: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 6,
    elevation: 10,
  },

  /* 🔥 CARDS */
  card: {
    backgroundColor: "#111827",
    margin: 12,
    borderRadius: 14,
    padding: 10,
  },

  bannerCard: {
    marginHorizontal: 12,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 6,
  },

  /* ⚡ FILTER */
  quickRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginVertical: 10,
  },

  quickBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 25,
    marginRight: 10,
    elevation: 3,
  },

  quickText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },

  /* 📍 CATEGORY */
  locationBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  chip: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },

  activeChip: {
    backgroundColor: "#991b1b",
  },

  chipText: {
    fontWeight: "700",
    color: "#374151",
  },

  activeText: {
    color: "#fff",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginHorizontal: 14,
    marginVertical: 8,
    color: "#111",
  },

  newsWrap: {
    paddingHorizontal: 10,
  },

  /* 🔝 FAB */
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#991b1b",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
});