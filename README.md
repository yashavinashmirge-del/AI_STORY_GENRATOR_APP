# AI Story Generator 📖✨

An AI-powered mobile app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev) that generates creative stories on the fly using AI models via [OpenRouter](https://openrouter.ai).

## Features

- 🤖 AI-generated stories powered by the [Vercel AI SDK](https://sdk.vercel.ai) and OpenRouter
- 📱 Cross-platform: runs on iOS, Android, and Web
- 🧭 File-based navigation with [Expo Router](https://docs.expo.dev/router/introduction/)
- 💾 Local persistence with `@react-native-async-storage/async-storage`
- 🎨 Clean UI with `lucide-react-native` icons and Expo's vector icon set
- ✅ Runtime validation with [Zod](https://zod.dev)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Expo (SDK 54), React Native 0.81 |
| Language | TypeScript |
| Navigation | Expo Router, React Navigation |
| AI | `ai` SDK, `@ai-sdk/react`, `@openrouter/ai-sdk-provider` |
| Storage | AsyncStorage |
| Validation | Zod |

## Project Structure

```
AI_STORY_GENRATOR_APP/
├── app/              # App screens & routes (Expo Router file-based routing)
├── assets/images/    # App images and icons
├── constant/         # Shared constants/config
├── lib/              # Utility and helper functions
├── app.json          # Expo app configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm or [bun](https://bun.sh/) (a `bun.lock` file is included)
- An [OpenRouter](https://openrouter.ai/) API key
- The [Expo Go](https://expo.dev/go) app (optional, for quick testing on a physical device)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yashavinashmirge-del/AI_STORY_GENRATOR_APP.git
   cd AI_STORY_GENRATOR_APP
   ```

2. Install dependencies

   ```bash
   npm install/bun install
   ```

3. Set up environment variables

   Create a `.env` file in the project root and add your OpenRouter API key:

   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. Start the development server

   ```bash
   npx expo start/ bunx expo start
   ```

   From the output, you can open the app in:
   - a [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - an Android emulator
   - an iOS simulator
   - [Expo Go](https://expo.dev/go)

### Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run android` | Start the app on an Android emulator/device |
| `npm run ios` | Start the app on an iOS simulator/device |
| `npm run web` | Start the app in a web browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset to a blank starter project |

## How It Works

The app sends a user prompt (genre, characters, theme, etc.) to an AI model through OpenRouter using the Vercel AI SDK, then streams back and displays a generated story within the app.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project currently has no license specified. Contact the repository owner for usage terms.
