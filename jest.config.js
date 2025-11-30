module.exports = {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@gluestack-ui|nativewind|@legendapp/motion)"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/coverage/",
    "/scripts/",
    "eslint.config.js",
    "metro.config.js",
    "babel.config.js"
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/scripts/",
    "/jest.setup.js",
    "/babel.config.js",
    "/expo-env.d.ts",
    "/.expo/",
    "/.vscode/",
    "/coverage/",
    "eslint.config.js",
    "metro.config.js",
    "babel.config.js",
    "tailwind.config.js",
    "nativewind-env.d.ts"
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "collectCoverage": true,
  "collectCoverageFrom": [
    "**/*.{ts,tsx,js,jsx}",
    "!**/components/ui/**"
  ]
}