# Zenlot Agent

## Overview
This document describes the Zenlot Agent, its responsibilities, and integration points within the Zenlot React Native application.

## Purpose
The Zenlot Agent is responsible for:
- Managing user authentication and session state
- Handling API requests and token refresh logic
- Providing context and state management for trade, user, and auth data
- Facilitating communication between UI components and backend services

## Key Responsibilities
- **Authentication:** Manages login, logout, signup, and token refresh flows using context providers.
- **API Integration:** Handles secure API calls, token storage, and automatic token refresh using AsyncStorage and custom API helpers.
- **Context Providers:** Supplies `AuthProvider`, `UserProvider`, and `TradeProvider` to ensure all components have access to necessary state and actions.
- **Error Handling:** Provides error boundaries and fallback UI for robust user experience.
- **State Synchronization:** Listens for updates via WebSocket and synchronizes user/trade state across the app.

## Integration Points
- **Providers:** Wraps the main navigation stack in `_layout.tsx` to ensure all screens/components have access to context.
- **API Layer:** Uses `api/index.ts` and related modules for all backend communication.
- **Modals/Portals:** Supports context bridging for modal components rendered outside the main React tree.
- **Trade Logic:** Manages trade entry, updates, and validation through context and utility functions.

## Best Practices
- Always wrap screens/components that use context hooks with the appropriate provider.
- Use context bridging for modals or portals rendered outside the provider tree.
- Store only string values in AsyncStorage for tokens.
- Refactor circular dependencies to avoid require cycles and initialization bugs.
- Use error boundaries for graceful error handling and recovery.

## Troubleshooting
- If context hooks return undefined, check provider placement and import paths.
- For token refresh issues, ensure only string tokens are stored and returned by the backend.
- Resolve require cycle warnings by importing components directly and avoiding barrel file overuse.

## References
- [Atomic Design Pattern](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Context Bridging](https://react.dev/reference/react/useContext)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/docs/usage/)
- [Expo Router](https://expo.github.io/router/docs)

---
This file serves as a guide for developers and maintainers working with the Zenlot Agent and its integration in the Zenlot app.