# Tealink Attendance - Project Documentation

## Project Overview

**Tealink Attendance** is a robust React Native application designed for efficient worker management, attendance tracking, and productivity monitoring in agricultural environments, such as tea gardens. The app is built with an **offline-first** philosophy, ensuring that critical data can be recorded in remote areas with limited connectivity and synchronized once a network is available.

---

## 🛠 Technology Stack

-   **Framework**: [React Native](https://reactnative.dev/) (v0.80.1)
-   **Language**: TypeScript / JavaScript
-   **Database (Local)**: [WatermelonDB](https://nozbe.github.io/WatermelonDB/) (Offline-first, high-performance SQLite-based)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest)
-   **Navigation**: [React Navigation](https://reactnavigation.org/) (Stack & Drawer)
-   **Camera & Face Detection**: [Vision Camera](https://mrousavy.com/react-native-vision-camera/) with Face Detector
-   **Storage**: [MMKV](https://github.com/mrousavy/react-native-mmkv) (Fast key-value storage)
-   **Hardware Integration**: NFC Manager, Bluetooth Classic
-   **Forms & Validation**: React Hook Form & Zod
-   **UI/UX**: Reanimated, Skia, Linear Gradient, Vector Icons

---

## 📂 Project Structure

```text
src/
├── assets/         # Images, fonts, and static resources
├── common/         # Common UI elements and styles
├── components/     # Reusable UI components (Cards, Buttons, Watchers)
├── config/         # App configuration and environment variables
├── constants/      # API endpoints, theme constants, and fixed data
├── hooks/          # Custom React hooks (logic separation from UI)
├── model/          # WatermelonDB models and schema definitions
├── navigations/    # Navigation configuration (MainRoute)
├── screens/        # Individual app screens (Dashboard, Login, etc.)
├── services/       # Core business logic (DB, API, NFC, Sound services)
├── store/          # Redux store and slices
├── types/          # TypeScript definitions and interfaces
└── utils/          # Utility functions (date helpers, dimensions, etc.)
```

---

## 🗄 Database Architecture (WatermelonDB)

The project uses a sophisticated schema to handle complex worker relationships and offline synchronization.

### Key Models:

-   **WorkerMaster**: Detailed information about workers (name, code, ID, gender, image path).
-   **AttendanceMaster**: Tracks check-in/check-out events.
-   **PluckedQuantityMaster**: Specifically for recording the weight/quantity of tea plucked.
-   **KamjariMaster**: Defines task types or job roles.
-   **OfflineMaster**: A "queue" for outgoing requests. Stores data to be synced when the network is online.
-   **SectionMaster / BatchMaster / ShiftMaster**: Logical groupings for tea garden operations.

---

## 🚀 Key Modules & Features

### 1. Robust Attendance System

-   **Face Detection**: Uses Vision Camera to verify workers during attendance.
-   **Shift Management**: Supports multiple batches and shifts.
-   **In/Out Tracking**: Dedicated screens for marking "In Time" and "Out Time".

### 2. Productivity Tracking

-   **Record Plucking**: Capture weight data with weighment numbers and section codes.
-   **Record Non-Plucking**: Tracks other activities performed by workers.
-   **Print Records**: Integration for printing physical receipts or reports.

### 3. Offline & Sync Engine

-   **Queue Management**: Failed requests are stored in `OfflineMaster`.
-   **Auto-Sync**: A background watcher (`AutoSyncWatcher`) periodically attempts to push offline data to the server.
-   **Network Watcher**: Monitors connectivity state to trigger sync actions.

### 4. Hardware Integration

-   **NFC Support**: For worker ID cards.
-   **Bluetooth/BLE Logs**: For interacting with external hardware devices (e.g., weighing scales).
-   **Sound Alerts**: Auditory feedback for successful/failed operations.

---

## 🔄 Core Services Logic

### `databaseServices.ts`

The heart of the app's data logic. It handles:

-   **Initialization**: Hydrating the local DB from server data on login.
-   **Operations**: CRUD for attendance, workers, and quantities.
-   **Synchronization**: The `syncData` function intelligently processes the offline queue, supporting both standard JSON requests and multi-part Form Data (for images).
-   **Database Backup**: Support for exporting the SQLite database to the device's storage.

### `apiServices.ts`

A wrapper around Axios/Fetch for consistent API communication, handling base URLs, headers, and error parsing.

---

## 🛠 Development Workflow

### Scripts

-   `npm run android`: Build and run the Android app.
-   `npm run ios`: Build and run the iOS app.
-   `npm run lint`: Run ESLint to check for code quality.
-   `npm start`: Start the Metro bundler.

### Testing

Tests are located in the `__tests__` directory and can be run using `npm test`. The project uses Jest and React Native Testing Library.
