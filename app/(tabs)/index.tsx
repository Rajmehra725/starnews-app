import { View, StyleSheet, FlatList, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BreakingTicker from "@/components/BreakingTicker";
import BannerSlider from "@/components/BannerSlider";
import NewsList from "@/components/NewsList";

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      <FlatList
        data={[{ key: "main" }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <View>

            {/* 🔴 HEADER */}
            <View style={styles.header}>
              <Text style={styles.logo}>STAR NEWS</Text>

              <View style={styles.live}>
                <View style={styles.dot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            {/* 🔥 BREAKING (No Gap) */}
            <View style={styles.breakingWrap}>
              <BreakingTicker />
            </View>

            {/* 📢 BANNER */}
            <View style={styles.banner}>
              <BannerSlider />
            </View>

            {/* 📰 TITLE */}
            <Text style={styles.title}>Top Headlines</Text>

          </View>
        }

        renderItem={() => <NewsList />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  /* 🔴 HEADER (AajTak Style) */
  header: {
    height: 46,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#dc2626",
  },

  logo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },

  live: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },

  dot: {
    width: 5,
    height: 5,
    backgroundColor: "#ef4444",
    borderRadius: 50,
    marginRight: 4,
  },

  liveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  /* 🔥 BREAKING STRIP */
  breakingWrap: {
    backgroundColor: "#111",
    paddingVertical: 6,
  },

  /* 📢 Banner */
  banner: {
    marginVertical: 6,
  },

  /* 📰 TITLE */
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 10,
    marginTop: 6,
    marginBottom: 4,
  },
});