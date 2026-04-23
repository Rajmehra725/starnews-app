import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// 🔔 Sample Notifications Data
const notifications = [
  {
    id: "1",
    title: "Breaking News: Market Crash",
    desc: "Stock market dropped 2% in early trading session.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Cricket Update",
    desc: "India won the match against Australia by 6 wickets.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: "3",
    title: "Tech News",
    desc: "New AI model launched with advanced features.",
    time: "1 hr ago",
    unread: false,
  },
  {
    id: "4",
    title: "Elections Update",
    desc: "Voting percentage increased in Madhya Pradesh.",
    time: "3 hr ago",
    unread: false,
  },
];

export default function Notifications() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* 🔔 Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Notifications</Text>
            <Text style={styles.tagline}>Latest news alerts for you ⚡</Text>
          </View>

          <TouchableOpacity style={styles.clearBtn}>
            <Ionicons name="checkmark-done" size={22} color="#38bdf8" />
          </TouchableOpacity>
        </View>

        {/* 📩 Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              
              {/* 🔴 Unread Dot */}
              {item.unread && <View style={styles.dot} />}

              {/* Icon */}
              <View style={styles.iconBox}>
                <Ionicons name="notifications" size={22} color="#38bdf8" />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>

                <Text style={styles.time}>{item.time}</Text>
              </View>

            </TouchableOpacity>
          )}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#38bdf8",
  },

  tagline: {
    color: "#94a3b8",
    fontSize: width * 0.035,
    marginTop: 4,
  },

  clearBtn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
    position: "relative",
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },

  desc: {
    color: "#94a3b8",
    fontSize: width * 0.033,
    marginTop: 4,
  },

  time: {
    color: "#38bdf8",
    fontSize: width * 0.03,
    marginTop: 6,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    position: "absolute",
    left: 8,
    top: 15,
  },
});