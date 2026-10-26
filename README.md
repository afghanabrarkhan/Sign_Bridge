# SignBridge – Accessible Communication and Learning Platform

## 1. Introduction

SignBridge is a web-based communication and learning platform designed to support deaf and hard-of-hearing individuals and people who experience speech difficulties.

The website provides simple communication tools, vocabulary exploration, learning categories, quizzes, and accessibility settings. Its objective is to make digital communication more accessible and user-friendly.

## 2. Problem Statement

Communication can be challenging when people use different communication methods or have difficulty hearing or speaking. Many individuals also face barriers when accessing digital learning resources.

SignBridge aims to provide an accessible web interface with simple communication tools and learning activities that can support everyday interactions.

## 3. Objectives

- Develop a user-friendly communication website.
- Provide quick messages for common communication needs.
- Offer vocabulary exploration and learning categories.
- Include an interactive quiz to support learning.
- Provide text-to-speech functionality.
- Support speech recognition where the browser permits it.
- Include accessibility settings such as text resizing, high contrast, and reading mode.
- Connect the frontend with a backend API.

## 4. Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Development Tools
- Visual Studio Code
- Web browser
- Node.js and npm

## 5. Main Features

### 5.1 Home Page
Provides an introduction to SignBridge and access to its main features.

### 5.2 Quick Messages
Displays common messages that users can select to support everyday communication.

### 5.3 Learning Categories
Loads learning categories from the backend API.

### 5.4 Vocabulary Explorer
Allows users to search and explore English vocabulary and meanings.

### 5.5 Interactive Quiz
Provides questions, answer feedback, progress tracking, and a final score.

### 5.6 Text-to-Speech
Uses browser speech synthesis to read supported text aloud.

### 5.7 Speech Recognition
Uses browser speech recognition when supported and permitted by the browser.

### 5.8 Accessibility Settings
Includes:
- Increase and decrease text size.
- High Contrast mode.
- Reading Mode.
- Reset Settings.

### 5.9 Language Selection
Provides a language selection interface according to the languages supported by the current implementation.

## 6. Project Structure

SignBridge/
|
|-- index.html
|-- style.css
|-- app.js
|-- README.md
|
|-- backend/
    |-- server.js
    |-- package.json
    |-- package-lock.json
    |-- node_modules/

Note: The exact backend files may vary depending on the installed dependencies.

## 7. Installation and Execution

### Prerequisites

Install Node.js and use a modern web browser.

### Step 1: Open the Project

Open the SignBridge project folder in Visual Studio Code.

### Step 2: Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install the dependencies if necessary:

```bash
npm install
```

Start the backend server:

```bash
node server.js
```

The server should run at:

http://localhost:3000

Keep this terminal open while using the website.

### Step 3: Open the Frontend

Open `index.html` using the development server configured for the project.

If the project is configured to use the backend at `http://localhost:3000/api`, make sure the backend is running before testing API-based features.

## 8. Backend API

The backend provides API endpoints for communication-related content.

Example endpoints:

- `GET /api` – Check the API response.
- `GET /api/categories` – Retrieve learning categories.
- `GET /api/quick-messages` – Retrieve quick messages.

These endpoints should be tested with the running backend.

## 9. Accessibility and Limitations

SignBridge includes several interface accessibility options and browser-based speech features.

Browser support and microphone permissions may affect speech recognition and speech synthesis.

The vocabulary section provides English words and meanings. Emoji illustrations are placeholders and must not be treated as verified sign-language demonstrations.

Accurate sign-language learning requires verified demonstrations and appropriate learning resources. The current project should not be considered a replacement for professional interpretation or accessible communication support.

## 10. Future Enhancements

- Add verified Indian Sign Language learning videos.
- Expand vocabulary and learning resources.
- Improve support for additional languages.
- Improve mobile accessibility and usability.
- Add user accounts and learning progress tracking.
- Conduct usability testing with intended users.
- Improve error handling and API reliability.

## 11. Conclusion

SignBridge demonstrates how web technologies can be used to develop an accessible communication and learning platform. By combining interactive learning tools, quick messages, browser speech features, and accessibility settings, the project provides a foundation for improving digital communication accessibility.

Further development and usability testing can help make the platform more useful, inclusive, and reliable.