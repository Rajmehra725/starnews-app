import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";
import { Video ,ResizeMode} from "expo-av";

const API = "https://starnewsbackend.onrender.com/api/advertisement";
const { width } = Dimensions.get("window");

export default function AdvertisementSystem() {
  const [ads, setAds] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(API);
      setAds(res.data);
    } catch (err) {
      console.log("Ad fetch error:", err);
    }
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      
      {/* LABEL */}
      <Text style={{ fontSize: 10, color: "#777", marginBottom: 4 }}>
        ADVERTISEMENT
      </Text>

      {/* CAROUSEL */}
      <FlatList
        data={ads}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AdCard ad={item} isActive={index === activeIndex} />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );
}

/* -----------------------
   AD CARD COMPONENT
------------------------*/
function AdCard({ ad, isActive }: any) {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (ad.mediaType === "video" && videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isActive]);

  return (
    <View
      style={{
        width,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* MEDIA */}
        {ad.mediaType === "video" ? (
          <Video
            ref={videoRef}
            source={{ uri: ad.url }}
            style={{ width: "100%", height: 160 }}
           resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={false}
            isMuted
          />
        ) : (
          <Image
            source={{ uri: ad.url }}
            style={{ width: "100%", height: 160 }}
            resizeMode="cover"
          />
        )}

        {/* CLICK AREA */}
        <TouchableOpacity
          onPress={() => Linking.openURL(ad.link)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />

        {/* AD TAG */}
        <View
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            backgroundColor: "red",
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 8 }}>AD</Text>
        </View>

        {/* TITLE */}
        {ad.title && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: 4,
            }}
          >
            <Text style={{ color: "white", fontSize: 10 }}>
              {ad.title}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}