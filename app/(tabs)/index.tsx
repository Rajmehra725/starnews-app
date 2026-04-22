import { View, StyleSheet, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BreakingTicker from "@/components/BreakingTicker";
import BannerSlider from "@/components/BannerSlider";
import NewsList from "@/components/NewsList";
import panchang from "@/components/panchang"
export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>

      <FlatList
        data={[{ key: "main" }]}
        keyExtractor={(item) => item.key}

        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <View>

            {/* 🔥 APP HEADER */}
            <View style={styles.header}>
              <Text style={styles.logo}>STAR NEWS</Text>

              <View style={styles.liveBox}>
                <View style={styles.dot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <Text style={styles.tagline}>
              Breaking • Trusted • Fast Updates ⚡
            </Text>

            {/* 🔴 Breaking */}
            <View style={styles.section}>
              <BreakingTicker />
            </View>

            {/* 📢 Banner */}
            <View style={styles.banner}>
              <BannerSlider />
            </View>

            {/* 📰 Section Title */}
            <Text style={styles.title}>📰 Top Headlines</Text>

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
    backgroundColor: "#0f172a",
  },

  header: {
    paddingHorizontal: 15,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#38bdf8",
    letterSpacing: 1,
  },

  liveBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  dot: {
    width: 6,
    height: 6,
    backgroundColor: "white",
    borderRadius: 50,
    marginRight: 5,
  },

  liveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  tagline: {
    color: "#94a3b8",
    fontSize: 12,
    paddingHorizontal: 15,
    marginTop: 4,
    marginBottom: 10,
  },

  section: {
    marginBottom: 10,
  },

  banner: {
    marginVertical: 10,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
});