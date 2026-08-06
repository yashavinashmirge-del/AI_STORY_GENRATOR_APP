import { EXAMPLE_PROMPTS } from "@/constant";
import { Colors, Theme } from "@/constant/theme";

import { Link, useRouter } from "expo-router";
import { BookOpen, Sparkles, Wand2 } from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
export default function Index() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        console.error("Story generation failed:", result?.error ?? result);
        return;
      }

      router.push({
        pathname: "/story",
        params: {
          data: JSON.stringify(result),
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <BookOpen color={Theme.primary} size={32} />
            </View>
            <Text style={styles.title}>AI Story Generator</Text>
            <Text style={styles.subtitle}>
              Powered by OpenRouter • Create magical stories
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Describe your story idea... (e.g., A brave knight discovers a hidden portal to a magical realm)"
              placeholderTextColor={Theme.textSecondary}
              multiline
              numberOfLines={4}
              value={prompt}
              onChangeText={setPrompt}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator color={Colors.zinc[950]} />
                <Text style={styles.buttonText}>Generating...</Text>
              </>
            ) : (
              <>
                <Wand2 color={Colors.zinc[950]} size={20} />
                <Text style={styles.buttonText}>Generate Story</Text>
                <Sparkles color={Colors.zinc[950]} size={20} />
              </>
            )}
          </TouchableOpacity>

          {EXAMPLE_PROMPTS.length > 0 && (
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Example Prompts</Text>
              <View style={styles.examplesGrid}>
                {EXAMPLE_PROMPTS.map((example, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exampleCard}
                    onPress={() => handleExamplePrompt(example)}
                    disabled={loading}
                  >
                    <Text style={styles.exampleText} numberOfLines={2}>
                      {example}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        <Link href={"/story"}>
          <Text style={{ color: "white" }}>Go to story</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  content: {
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.zinc[900],
    borderWidth: 2,
    borderColor: Theme.primary,
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Theme.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: Colors.zinc[900],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Theme.border,
    borderStyle: "dotted",
    padding: 16,
  },
  input: {
    fontSize: 16,
    color: Theme.text,
    minHeight: 120,
  },
  button: {
    backgroundColor: Theme.primary,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.zinc[950],
  },
  examplesContainer: {
    gap: 12,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Theme.text,
  },
  examplesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  exampleCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.zinc[900],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Theme.border,
    borderStyle: "dotted",
  },
  exampleText: {
    fontSize: 13,
    color: Theme.textSecondary,
    lineHeight: 18,
  },
  historyContainer: {
    gap: 12,
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Theme.text,
  },
  storyCard: {
    backgroundColor: Colors.zinc[900],
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Theme.border,
    borderStyle: "dotted",
  },
  storyCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.text,
    marginBottom: 4,
  },
  storyCardPrompt: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginBottom: 4,
  },
  storyCardDate: {
    fontSize: 11,
    color: Theme.textSecondary,
    opacity: 0.7,
  },
});
