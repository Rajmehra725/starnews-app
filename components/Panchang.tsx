import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 30) / 2; // 👈 responsive 2 column

export default function AstroWeatherSection() {
  return (
    <ScrollView style={styles.container}>

      {/* HEADING */}
      <View style={styles.headingBox}>
        <Text style={styles.heading}>
          राशिफल • पंचांग • मौसम
        </Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>

        {/* RASHIFAL */}
        <View style={styles.card}>
          <WebView
            source={{
              uri: "https://piushtrivedi.neocities.org/hindi_astrology_google_gadget_part_1_updated_html2.html",
            }}
            style={styles.webview}
            scrollEnabled={false}
          />
        </View>

        {/* PANCHANG */}
        <View style={styles.card}>
          <WebView
            source={{
              uri: "https://www.igoogleportal.com/shindig/gadgets/ifr?url=http://hosting.gmodules.com/ig/gadgets/file/109787730588197067267/hindi_panchang.xml&lang=en&country=ALL",
            }}
            style={styles.webview}
            scrollEnabled={false}
          />
        </View>

        {/* WEATHER */}
        <View style={styles.card}>
          <WebView
            source={{
              uri: "https://api.wo-cloud.com/content/widget/?geoObjectKey=16143051&language=en&region=IN&timeFormat=HH:mm&windUnit=kmh&systemOfMeasurement=metric&temperatureUnit=celsius",
            }}
            style={styles.webview}
            scrollEnabled={false}
          />
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 10,
  },

  headingBox: {
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
    paddingLeft: 10,
    marginBottom: 12,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  /* 🔥 GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* 🟦 CARD */
  card: {
    width: CARD_WIDTH,
    height: 200, // 👈 compact
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    elevation: 2,
  },

  webview: {
    flex: 1,
  },
});