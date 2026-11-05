import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";

export const APP_BUNDLE_ID = "com.prakash.starnewsnetworks2";
export const APP_ORIGIN = `https://${APP_BUNDLE_ID}`;

/**
 * Extracts 11-character YouTube video ID from various URL formats
 */
export const extractYouTubeId = (url?: string): string => {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : "";
};

/**
 * Generates high quality YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (urlOrId?: string): string => {
  const id = urlOrId && urlOrId.length === 11 ? urlOrId : extractYouTubeId(urlOrId);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800";
};

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
  isMuted?: boolean;
  showControls?: boolean;
  loop?: boolean;
  playsinline?: boolean;
}

/**
 * Builds YouTube embed URL with strict origin, enablejsapi, and referrer parameters
 * to completely eliminate Error 153 (Video Player Configuration Error).
 */
export const buildYouTubeEmbedUrl = (
  videoId: string,
  options: YouTubeEmbedOptions = {}
): string => {
  const {
    autoplay = true,
    isMuted = false,
    showControls = true,
    loop = false,
    playsinline = true,
  } = options;

  const params: string[] = [
    `autoplay=${autoplay ? "1" : "0"}`,
    `mute=${isMuted ? "1" : "0"}`,
    `controls=${showControls ? "1" : "0"}`,
    `playsinline=${playsinline ? "1" : "0"}`,
    "rel=0",
    "modestbranding=1",
    "enablejsapi=1",
    `origin=${encodeURIComponent(APP_ORIGIN)}`,
    `widget_referrer=${encodeURIComponent(APP_ORIGIN)}`,
  ];

  if (loop) {
    params.push("loop=1");
    params.push(`playlist=${videoId}`);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.join("&")}`;
};

/**
 * Creates self-contained HTML page embedding the YouTube player
 * with explicit strict-origin-when-cross-origin metadata and styles.
 */
export const buildYouTubeHtml = (
  videoId: string,
  options: YouTubeEmbedOptions = {}
): string => {
  const embedUrl = buildYouTubeEmbedUrl(videoId, options);

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; background-color: #000; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
      outline: none;
    }
  </style>
</head>
<body>
  <iframe
    id="star-news-player"
    src="${embedUrl}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
</body>
</html>`;
};

/**
 * Builds the WebView source object passing matching HTML, baseUrl, and Referer headers.
 * Resolves YouTube Error 153 on all Android and iOS devices.
 */
export const getYouTubeWebViewSource = (
  videoId: string,
  options: YouTubeEmbedOptions = {}
) => {
  const html = buildYouTubeHtml(videoId, options);

  return {
    html,
    baseUrl: APP_ORIGIN,
    headers: {
      Referer: APP_ORIGIN,
      Origin: APP_ORIGIN,
    },
  };
};

export interface StarVideoPlayerProps {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  autoplay?: boolean;
  isMuted?: boolean;
  showControls?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onError?: (error: any) => void;
  onLoad?: () => void;
}

/**
 * StarVideoPlayer: Enterprise YouTube Player component for Star News Networks.
 * Fixes Error 153 (Video player configuration error) across all platforms.
 */
export default function StarVideoPlayer({
  videoId: propVideoId,
  videoUrl,
  title,
  autoplay = true,
  isMuted = false,
  showControls = true,
  loop = false,
  style,
  containerStyle,
  onError,
  onLoad,
}: StarVideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const resolvedVideoId = useMemo(() => {
    if (propVideoId && propVideoId.length === 11) return propVideoId;
    return extractYouTubeId(videoUrl || propVideoId);
  }, [propVideoId, videoUrl]);

  const webViewSource = useMemo(() => {
    if (!resolvedVideoId) return null;
    return getYouTubeWebViewSource(resolvedVideoId, {
      autoplay,
      isMuted,
      showControls,
      loop,
    });
  }, [resolvedVideoId, autoplay, isMuted, showControls, loop]);

  const rawEmbedUrl = useMemo(() => {
    if (!resolvedVideoId) return "";
    return buildYouTubeEmbedUrl(resolvedVideoId, {
      autoplay,
      isMuted,
      showControls,
      loop,
    });
  }, [resolvedVideoId, autoplay, isMuted, showControls, loop]);

  const handleOpenExternal = useCallback(() => {
    const directUrl = resolvedVideoId
      ? `https://www.youtube.com/watch?v=${resolvedVideoId}`
      : videoUrl;
    if (directUrl) {
      Linking.openURL(directUrl).catch((err) =>
        console.log("Failed to open external YouTube link:", err)
      );
    }
  }, [resolvedVideoId, videoUrl]);

  if (!resolvedVideoId) {
    return (
      <View style={[styles.placeholderContainer, containerStyle]}>
        <Ionicons name="videocam-off-outline" size={36} color="#64748B" />
        <Text style={styles.placeholderText}>वीडियो लिंक उपलब्ध नहीं है</Text>
      </View>
    );
  }

  // Graceful fallback UI in case a specific video has embedding strictly disabled by owner
  if (hasError) {
    return (
      <View style={[styles.errorContainer, containerStyle]}>
        <MaterialCommunityIcons name="youtube" size={44} color="#DC2626" />
        <Text style={styles.errorTitle}>
          {title || "स्टार न्यूज़ लाइव प्रसारण"}
        </Text>
        <Text style={styles.errorSub}>
          यह वीडियो सीधे यूट्यूब ऐप में देखने के लिए तैयार है।
        </Text>
        <TouchableOpacity style={styles.openYouTubeBtn} onPress={handleOpenExternal}>
          <MaterialCommunityIcons name="open-in-app" size={18} color="#FFF" />
          <Text style={styles.openYouTubeBtnText}>यूट्यूब ऐप में देखें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Web Platform: Render direct DOM iframe
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, containerStyle]}>
        {/* @ts-ignore */}
        <iframe
          src={rawEmbedUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            backgroundColor: "#000",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </View>
    );
  }

  // Native Platform: Render secure WebView with injected Referer & BaseUrl
  return (
    <View style={[styles.container, containerStyle]}>
      {webViewSource && (
        <WebView
          source={webViewSource}
          style={[styles.webView, style]}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["*"]}
          mixedContentMode="always"
          cacheEnabled
          userAgent="Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => {
            setLoading(false);
            onLoad?.();
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log("StarVideoPlayer WebView error:", nativeEvent);
            setLoading(false);
            setHasError(true);
            onError?.(nativeEvent);
          }}
        />
      )}

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="small" color={BrandColors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
    position: "relative",
  },
  webView: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  placeholderText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  errorContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0B0C10",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  errorTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  errorSub: {
    color: "#94A3B8",
    fontSize: 11,
    textAlign: "center",
  },
  openYouTubeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
    ...Shadows.sm,
  },
  openYouTubeBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
