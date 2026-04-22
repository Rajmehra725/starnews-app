import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import { Video ,ResizeMode} from "expo-av";

const { width } = Dimensions.get("window");

const API = "https://starnewsbackend.onrender.com/api/banners";
const BASE = "https://starnewsbackend.onrender.com";

export default function BannerSlider() {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(API);
      setBanners(res.data);
    } catch (e) {
      console.log("Banner error", e);
    }
  };

  const getUrl = (banner: any) => {
    const file = banner.url || banner.image;
    return file?.startsWith("http") ? file : `${BASE}${file}`;
  };

  if (banners.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      
      {/* AD TEXT */}
      <Text style={styles.adText}>ADVERTISEMENT</Text>

      <Carousel
        loop
        autoPlay
        autoPlayInterval={2500}
        width={width * 0.92}
        height={120}
        data={banners}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            {/* 🎥 VIDEO */}
            {item.type === "video" ? (
              <Video
                source={{ uri: getUrl(item) }}
                style={styles.media}
               resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              />
            ) : (
              <Image
                source={{ uri: getUrl(item) }}
                style={styles.media}
              />
            )}

            {/* 📊 Overlay */}
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>❤️ {item.likes}</Text>
              <Text style={styles.overlayText}>🔁 {item.shares}</Text>
              <Text style={styles.overlayText}>👁️ {item.views}</Text>
            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    alignItems: "center",
  },

  adText: {
    color: "#9ca3af",
    fontSize: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 4,
  },

  card: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },

  media: {
    width: "100%",
    height: 120,
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopLeftRadius: 8,
    gap: 8,
  },

  overlayText: {
    color: "#fff",
    fontSize: 10,
  },
});