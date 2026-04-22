import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

export default function AstroWeatherSection() {
  return (
    <ScrollView style={styles.container}>

      {/* HEADING */}
      <View style={styles.headingBox}>
        <Text style={styles.heading}>
          राशिफल और पंचांग & मौसम
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
        <View style={styles.cardWeather}>
          <WebView
            source={{
              uri: "https://api.wo-cloud.com/content/widget/?geoObjectKey=16143051&language=en&region=IN&timeFormat=HH:mm&windUnit=kmh&systemOfMeasurement=metric&temperatureUnit=celsius",
            }}
            style={styles.webviewWeather}
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
    backgroundColor: "#f3f4f6",
    padding: 10,
  },

  headingBox: {
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
    paddingLeft: 10,
    marginBottom: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  grid: {
    flexDirection: "column",
    gap: 15,
  },

  card: {
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },

  cardWeather: {
    height: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  webview: {
    flex: 1,
  },

  webviewWeather: {
    width: 300,
    height: 320,
  },
});