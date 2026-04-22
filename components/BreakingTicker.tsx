import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const { width } = Dimensions.get("window");

interface BreakingNews {
  _id: string;
  text: string;
  isActive: boolean;
  priority: number;
}

const API_URL = "https://starnewsbackend.onrender.com/api/breaking";

export default function BreakingNews() {
  const [newsList, setNewsList] = useState<BreakingNews[]>([]);
  const [loaded, setLoaded] = useState(false);

  const translateX = useRef(new Animated.Value(width)).current;

  const fetchNews = async () => {
    try {
      const res = await axios.get(API_URL);

      const sorted = [...res.data].sort(
        (a, b) => a.priority - b.priority
      );

      setNewsList(sorted);
      setLoaded(true);
    } catch (err: any) {
      console.log("Breaking API Error:", err?.message);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchNews();

    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (newsList.length === 0) return;

    startAnimation();
  }, [newsList]);

  const startAnimation = () => {
    translateX.setValue(width);

    Animated.loop(
      Animated.timing(translateX, {
        toValue: -width * 2,
        duration: 30000, // speed control
        useNativeDriver: true,
      })
    ).start();
  };

  const activeNews = newsList.filter((item) => item.isActive);

  if (!loaded || activeNews.length === 0) return null;

  const text = activeNews.map((item) => ` 🔴 ${item.text} `).join("   ");

  return (
    <View style={styles.container}>
      
      {/* 🔴 BREAKING LABEL */}
      <View style={styles.label}>
        <Text style={styles.labelText}>BREAKING</Text>
      </View>

      {/* 📰 MARQUEE */}
      <View style={styles.marquee}>
        <Animated.Text
          style={[
            styles.text,
            { transform: [{ translateX }] },
          ]}
        >
          {text + text} {/* duplicate for loop */}
        </Animated.Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#dc2626",
    height: 40,
    alignItems: "center",
     marginTop: 50,
  },

  label: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
  },

  labelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  marquee: {
    flex: 1,
    overflow: "hidden",
    paddingLeft: 10,
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});