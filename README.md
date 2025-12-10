<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Suno Architect

**AI-Powered Audio Analysis and Architecture Tool**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/rickai0118/SUNO-)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)

</div>

## 📋 Project Overview

Suno Architect is an advanced AI-powered audio analysis and architecture tool built with React and TypeScript. It leverages Google Gemini API to provide comprehensive audio analysis capabilities with an intuitive user interface.

## ✨ Core Features

- **AI-Powered Audio Analysis**: Utilizes Google Gemini API for advanced audio processing
- **API Key Management**: Secure input and storage of API keys with visibility toggle
- **Usage Monitoring**: Daily API call limit tracking and display
- **Responsive Design**: Optimized for various screen sizes
- **Multi-language Support**: English and Chinese language options
- **Local Storage**: Persistent API key storage for convenience
- **Real-time Validation**: Immediate feedback on API key input

## 🛠️ Environment Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Google Gemini API Key**: Required for audio analysis functionality

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/rickai0118/SUNO-.git
cd SUNO-
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure API Key

You have two options to configure your Google Gemini API key:

#### Option A: Environment Variable (Recommended for Production)

Create a `.env.local` file in the project root and add your API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### Option B: In-App Configuration

You can also configure your API key directly through the app's user interface after launching it.

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified in the output).

## 🚀 Usage Guide

### 1. API Key Setup

- Upon first launch, you'll be prompted to enter your Google Gemini API key
- Toggle the visibility icon to show/hide the API key while typing
- The daily API call limit (100 calls/day) is displayed for reference
- Click "Save" to store your API key locally

### 2. Audio Analysis

- Upload or select an audio file for analysis
- The AI will process the audio and provide detailed insights
- View and interact with the analysis results in the intuitive dashboard

### 3. Navigation

- Use the sidebar menu to access different features
- Switch between languages using the language selector
- View your API usage statistics

## 📖 API Documentation

### Google Gemini API Integration

The application uses the Google Gemini API for audio analysis. Key endpoints utilized:

- **Audio Analysis Endpoint**: Processes audio files and returns detailed analysis
- **Usage Statistics**: Provides information on API call limits and usage

### Rate Limits

- **Daily Limit**: 100 API calls per day
- **Request Rate**: Limited by Google's API policies
- **Error Handling**: Comprehensive error messages for API failures

## 🤝 Contribution Guide

We welcome contributions to Suno Architect! Here's how you can contribute:

### Reporting Issues

- Use GitHub Issues to report bugs or request new features
- Include detailed descriptions, screenshots, and reproduction steps

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes with clear, concise commits
4. Test your changes thoroughly
5. Submit a pull request with a detailed description

### Code Style Guidelines

- Follow the existing TypeScript and React best practices
- Use consistent indentation (2 spaces)
- Write clear, descriptive commit messages
- Include tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

### Project Maintainer

- **GitHub**: [rickai0118](https://github.com/rickai0118)

### Support

For support or questions, please:
- Open an issue on GitHub
- Check the project's [Discussions](https://github.com/rickai0118/SUNO-/discussions) tab

## 📊 Project Status

- **Current Version**: 1.0.0
- **Development Status**: Active
- **Last Update**: December 2025

## 🛡️ Security

- API keys are stored locally in browser storage
- No sensitive data is transmitted to third-party servers except Google Gemini API
- Regular security updates are applied

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

---

<div align="center">

Made with ❤️ using React and TypeScript

</div>