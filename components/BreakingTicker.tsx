import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://starnewsbackend.onrender.com/api/breaking";

export default function BreakingNews() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  const translateX = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  /* FETCH */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(API_URL);
        setNewsList(res.data.filter((n: any) => n.isActive));
      } catch (e) {
        console.log(e);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  const current = newsList[index];

  const formatText = (item: any) => {
    if (!item) return "";
    return `${item.location ? `[${item.location}]` : ""} 🔴 ${item.text}`;
  };

  /* ANIMATION */
  useEffect(() => {
    if (!current) return;

    translateX.setValue(50);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -50,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prev) =>
          prev === newsList.length - 1 ? 0 : prev + 1
        );
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [index, newsList]);

  if (!current) return null;

  return (
    <View style={styles.container}>
      
      <View style={styles.label}>
        <Text style={styles.labelText}>BREAKING</Text>
      </View>

      <View style={styles.box}>
        <Animated.Text
          style={[
            styles.text,
            {
              transform: [{ translateX }],
              opacity,
            },
          ]}
        >
          {formatText(current)}
        </Animated.Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#000",
    height: 40,
    alignItems: "center",
  },

  label: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 10,
    height: "100%",
    justifyContent: "center",
  },

  labelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },

  box: {
    flex: 1,
    overflow: "hidden",
    paddingLeft: 10,
    justifyContent: "center",
  },

  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});