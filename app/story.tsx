import { Colors, Theme } from "@/constant/theme";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Share2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const Story = () => {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const storyData = useMemo(() => {
    if (typeof data !== "string") {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, [data]);

  const story = storyData ?? {
    title: "The Knight and the Hidden Portal",
    paragraphs: [
      {
        paragraph:
          "In a quiet village at the edge of the forest, a young knight named Elara spent her days training with the old swordmaster. She had heard rumors of a glowing portal deep in the woods—a gateway to another world that appeared only under the full moon.",
        promptToImage:
          "A young female knight in armor standing in a medieval village at dusk, forest in background, fairy tale style, warm lighting",
      },
      {
        paragraph:
          "On the night of the full moon, Elara ventured into the forest alone. The path was lit by silver light filtering through the trees. When she reached the ancient oak, she found it: a swirling portal of blue and gold, humming with unknown magic.",
        promptToImage:
          "Magical glowing portal in a dark forest, blue and gold light, full moon, fantasy atmosphere, cinematic",
      },
      {
        paragraph:
          "She stepped through and found herself in a realm where the sky was purple and two suns hung low on the horizon. Strange, friendly creatures approached her—they had been waiting for someone from her world to break an old curse.",
        promptToImage:
          "Fantasy landscape with purple sky and two suns, alien but peaceful creatures, otherworldly, vivid colors",
      },
      {
        paragraph:
          "With her courage and the help of her new allies, Elara found the cursed crystal and shattered it. The realm burst into celebration. Before she left through the portal, the elders gave her a small glowing stone—a key that would let her return whenever she wished.",
        promptToImage:
          "Knight holding a glowing crystal in a festive fantasy village, confetti and light, triumphant mood",
      },
      {
        paragraph:
          "Back in her village, no one believed her tale—except the swordmaster, who smiled and said he had once stepped through the same portal. Elara kept the stone close, knowing that her greatest adventures had only just begun.",
        promptToImage:
          "Medieval village at sunset, young knight looking at a glowing stone in her hand, nostalgic and hopeful mood",
      },
    ],
  };

  const handleShare = () => {};

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Story not found.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={Theme.primary} size={20} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={Theme.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {story.title}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 color={Theme.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {story.paragraphs.map((part, index) => {
          const hasError = imageErrors[index];
          const isLoading = imageLoading[index];
          const placeholderUri = `https://api.dicebear.com/9.x/glass/png?seed=${index}-${story.title.replace(/\s/g, "")}`;
          return (
            <View key={`story-part-${index}`} style={styles.partContainer}>
              <View style={styles.imageContainer}>
                {isLoading && (
                  <View style={styles.imageLoader}>
                    <ActivityIndicator color={Theme.primary} size="large" />
                  </View>
                )}

                <Image
                  source={{ uri: placeholderUri }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                  onLoadStart={() => {
                    setImageLoading((prev) => ({ ...prev, [index]: true }));
                    setImageErrors((prev) => ({ ...prev, [index]: false }));
                  }}
                  onLoadEnd={() =>
                    setImageLoading((prev) => ({ ...prev, [index]: false }))
                  }
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [index]: true }));
                    setImageLoading((prev) => ({ ...prev, [index]: false }));
                  }}
                />

                {hasError && !isLoading && (
                  <View style={styles.imageError}>
                    <Text style={styles.imageErrorText}>
                      Failed to load image
                    </Text>
                  </View>
                )}

                <View style={styles.imageBadge}>
                  <Text style={styles.imageBadgeText}>{index + 1}</Text>
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{part.paragraph}</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerText}>The End</Text>
          <View style={styles.footerDivider} />
          <Text style={styles.footerSubtext}>
            Generated with AI Story Generator
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Story;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    backgroundColor: Theme.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: Theme.text,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.background,
    padding: 24,
    gap: 16,
  },
  errorText: {
    color: Theme.text,
    fontSize: 18,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.zinc[900],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  backButtonText: {
    color: Theme.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  partContainer: {
    marginBottom: 40,
    gap: 16,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: Colors.zinc[900],
    borderWidth: 2,
    borderColor: Theme.border,
    borderStyle: "dotted",
    position: "relative",
  },
  imageLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.zinc[900],
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.zinc[800],
  },
  placeholderText: {
    color: Theme.textSecondary,
    fontSize: 14,
  },
  imageError: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.zinc[900],
    opacity: 0.9,
  },
  imageErrorText: {
    color: Theme.textSecondary,
    fontSize: 12,
    textAlign: "center",
    padding: 16,
  },
  imageBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: Theme.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageBadgeText: {
    color: Colors.zinc[950],
    fontWeight: "bold",
    fontSize: 14,
  },
  textContainer: {
    padding: 20,
    backgroundColor: Colors.zinc[900],
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Theme.primary,
    borderWidth: 1,
    borderColor: Theme.border,
    borderStyle: "dotted",
  },
  text: {
    fontSize: 17,
    lineHeight: 28,
    color: Theme.text,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    gap: 12,
  },
  footerText: {
    color: Theme.primary,
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  footerDivider: {
    width: 60,
    height: 2,
    backgroundColor: Theme.primary,
    opacity: 0.5,
  },
  footerSubtext: {
    color: Theme.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
});
