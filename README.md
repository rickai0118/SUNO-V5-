<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Suno Architect / Suno 架构师

**AI-Powered Audio Analysis and Architecture Tool / AI驱动的音频分析和架构工具**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/rickai0118/SUNO-)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)

</div>

---

## 📋 Project Overview / 项目概述

### English
Suno Architect is an advanced AI-powered audio analysis and architecture tool built with React and TypeScript. It leverages Google Gemini API to provide comprehensive audio analysis capabilities with an intuitive user interface.

### 中文
Suno Architect 是一款基于 React 和 TypeScript 构建的先进 AI 驱动音频分析和架构工具。它利用 Google Gemini API 提供全面的音频分析功能，并配有直观的用户界面。

---

## ✨ Core Features / 核心功能

### English
- **AI-Powered Audio Analysis**: Utilizes Google Gemini API for advanced audio processing
- **API Key Management**: Secure input and storage of API keys with visibility toggle
- **Usage Monitoring**: Daily API call limit tracking and display
- **Responsive Design**: Optimized for various screen sizes
- **Multi-language Support**: English and Chinese language options
- **Local Storage**: Persistent API key storage for convenience
- **Real-time Validation**: Immediate feedback on API key input

### 中文
- **AI 驱动的音频分析**: 利用 Google Gemini API 进行高级音频处理
- **API 密钥管理**: 安全输入和存储 API 密钥，支持可见性切换
- **使用情况监控**: 每日 API 调用限制跟踪和显示
- **响应式设计**: 针对各种屏幕尺寸进行优化
- **多语言支持**: 英语和中文语言选项
- **本地存储**: 便捷的持久化 API 密钥存储
- **实时验证**: API 密钥输入的即时反馈

---

## 🛠️ Environment Requirements / 环境要求

### English
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Google Gemini API Key**: Required for audio analysis functionality

### 中文
- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **Google Gemini API 密钥**: 音频分析功能所必需

---

## 📦 Installation / 安装

### English

#### Step 1: Clone the Repository
```bash
git clone https://github.com/rickai0118/SUNO-.git
cd SUNO-
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure API Key
You have two options to configure your Google Gemini API key:

##### Option A: Environment Variable (Recommended for Production)
Create a `.env.local` file in the project root and add your API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

##### Option B: In-App Configuration
You can also configure your API key directly through the app's user interface after launching it.

#### Step 4: Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified in the output).

### 中文

#### 步骤 1: 克隆仓库
```bash
git clone https://github.com/rickai0118/SUNO-.git
cd SUNO-
```

#### 步骤 2: 安装依赖
```bash
npm install
```

#### 步骤 3: 配置 API 密钥
您有两种方式配置 Google Gemini API 密钥：

##### 选项 A: 环境变量（生产环境推荐）
在项目根目录创建 `.env.local` 文件，并添加您的 API 密钥：
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

##### 选项 B: 应用内配置
您也可以在启动应用后，通过应用的用户界面直接配置 API 密钥。

#### 步骤 4: 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173`（或输出中指定的端口）可用。

---

## 🚀 Usage Guide / 使用指南

### English

#### 1. API Key Setup
- Upon first launch, you'll be prompted to enter your Google Gemini API key
- Toggle the visibility icon to show/hide the API key while typing
- The daily API call limit (100 calls/day) is displayed for reference
- Click "Save" to store your API key locally

#### 2. Audio Analysis
- Upload or select an audio file for analysis
- The AI will process the audio and provide detailed insights
- View and interact with the analysis results in the intuitive dashboard

#### 3. Navigation
- Use the sidebar menu to access different features
- Switch between languages using the language selector
- View your API usage statistics

### 中文

#### 1. API 密钥设置
- 首次启动时，系统会提示您输入 Google Gemini API 密钥
- 输入时可切换可见性图标来显示/隐藏 API 密钥
- 显示每日 API 调用限制（100 次/天）供参考
- 点击 "保存" 将 API 密钥存储在本地

#### 2. 音频分析
- 上传或选择要分析的音频文件
- AI 将处理音频并提供详细的分析结果
- 在直观的仪表板中查看和交互分析结果

#### 3. 导航
- 使用侧边栏菜单访问不同功能
- 使用语言选择器在不同语言之间切换
- 查看您的 API 使用统计信息

---

## 📖 API Documentation / API 文档

### English

#### Google Gemini API Integration
The application uses the Google Gemini API for audio analysis. Key endpoints utilized:

- **Audio Analysis Endpoint**: Processes audio files and returns detailed analysis
- **Usage Statistics**: Provides information on API call limits and usage

#### Rate Limits
- **Daily Limit**: 100 API calls per day
- **Request Rate**: Limited by Google's API policies
- **Error Handling**: Comprehensive error messages for API failures

### 中文

#### Google Gemini API 集成
该应用使用 Google Gemini API 进行音频分析。使用的主要端点：

- **音频分析端点**: 处理音频文件并返回详细分析结果
- **使用统计**: 提供 API 调用限制和使用情况信息

#### 速率限制
- **每日限制**: 每天 100 次 API 调用
- **请求速率**: 受 Google API 政策限制
- **错误处理**: API 失败时提供全面的错误信息

---

## 🤝 Contribution Guide / 贡献指南

### English

We welcome contributions to Suno Architect! Here's how you can contribute:

#### Reporting Issues
- Use GitHub Issues to report bugs or request new features
- Include detailed descriptions, screenshots, and reproduction steps

#### Submitting Pull Requests
1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes with clear, concise commits
4. Test your changes thoroughly
5. Submit a pull request with a detailed description

#### Code Style Guidelines
- Follow the existing TypeScript and React best practices
- Use consistent indentation (2 spaces)
- Write clear, descriptive commit messages
- Include tests for new functionality

### 中文

我们欢迎对 Suno Architect 的贡献！以下是您可以贡献的方式：

#### 报告问题
- 使用 GitHub Issues 报告错误或请求新功能
- 包括详细描述、截图和复现步骤

#### 提交拉取请求
1. Fork 仓库
2. 为您的功能或错误修复创建一个新分支
3. 使用清晰、简洁的提交信息进行更改
4. 彻底测试您的更改
5. 提交带有详细描述的拉取请求

#### 代码风格指南
- 遵循现有的 TypeScript 和 React 最佳实践
- 使用一致的缩进（2 个空格）
- 编写清晰、描述性的提交信息
- 为新功能添加测试

---

## 📄 License / 许可证

### English
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 中文
本项目采用 MIT 许可证 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

---

## 📞 Contact / 联系方式

### English

#### Project Maintainer
- **GitHub**: [rickai0118](https://github.com/rickai0118)

#### Support
For support or questions, please:
- Open an issue on GitHub
- Check the project's [Discussions](https://github.com/rickai0118/SUNO-/discussions) tab

### 中文

#### 项目维护者
- **GitHub**: [rickai0118](https://github.com/rickai0118)

#### 支持
如需支持或有疑问，请：
- 在 GitHub 上打开一个 issue
- 查看项目的 [Discussions](https://github.com/rickai0118/SUNO-/discussions) 选项卡

---

## 📊 Project Status / 项目状态

### English
- **Current Version**: 1.0.0
- **Development Status**: Active
- **Last Update**: December 2025

### 中文
- **当前版本**: 1.0.0
- **开发状态**: 活跃
- **最后更新**: 2025 年 12 月

---

## 🛡️ Security / 安全

### English
- API keys are stored locally in browser storage
- No sensitive data is transmitted to third-party servers except Google Gemini API
- Regular security updates are applied

### 中文
- API 密钥存储在浏览器本地存储中
- 除 Google Gemini API 外，没有敏感数据传输到第三方服务器
- 定期应用安全更新

---

## 📱 Browser Support / 浏览器支持

### English
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 中文
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📚 Additional Resources / 额外资源

### English
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

### 中文
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Google Gemini API 文档](https://ai.google.dev/docs)
- [Vite 文档](https://vitejs.dev/guide/)

---

<details>
<summary>📝 Original Google AI Studio README</summary>

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QW9i_2PN6PH5lNKDBDLi3oD0MEW_Bb2-

### Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

</details>

---

<div align="center">

Made with ❤️ using React and TypeScript / 使用 React 和 TypeScript 制作 ❤️

</div>
