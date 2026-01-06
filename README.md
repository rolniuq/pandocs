# Pandocs Extension

A VSCode extension that allows you to read documents from URLs directly within the editor. Perfect for quickly viewing web content, API responses, documentation, and more without leaving your development environment.

## ✨ Features

### 📄 Document Opening
- Open any URL and display its content in a VSCode tab
- Support for various file types (HTML, JSON, XML, text files)
- **Smart HTML to Markdown conversion** for better readability
- Clean content without CSS, JavaScript, or clutter

### 🎯 Smart Content Processing
- **HTML Sanitization**: Automatically removes scripts, styles, and unwanted elements
- **Markdown Conversion**: Converts HTML to clean, readable Markdown with proper syntax highlighting
- **Content Type Detection**: Automatically sets the correct language mode based on content
- **Syntax Highlighting**: Full support for Markdown, JSON, XML, JavaScript, and more

### 💡 User Experience
- Progress indicators during download
- Informative error messages with actionable feedback
- Network timeout handling
- HTTP error handling with status codes

## 🚀 Usage

### Quick Start
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Pandocs: Open URL" and select the command
3. Enter the URL of the document you want to open
4. The document will be fetched and displayed in a new tab

### Example URLs to Try

**HTML Pages (converted to Markdown):**
- `https://httpbin.org/html` - Test HTML content
- `https://example.com` - Simple webpage
- `https://httpbin.org/forms/post` - Form examples

**API Responses (preserved format):**
- `https://jsonplaceholder.typicode.com/posts/1` - JSON data
- `https://httpbin.org/xml` - XML content
- `https://api.github.com/users/microsoft` - API response

## 📋 Supported Formats

| Format | Processing | Language Mode |
|--------|------------|--------------|
| HTML | ✅ Converted to Markdown | `markdown` |
| JSON | ✅ Preserved | `json` |
| XML | ✅ Preserved | `xml` |
| JavaScript | ✅ Preserved | `javascript` |
| Plain Text | ✅ Preserved | `plaintext` |

## ⚙️ Requirements

- VSCode 1.74.0 or higher
- Internet connection to fetch remote documents

## 🔧 Extension Settings

This extension contributes the following settings:

* `pandocs.timeout`: Request timeout in milliseconds (default: 30000)
* `pandocs.maxFileSize`: Maximum file size to fetch in bytes (default: 10485760)

## 🚀 Installation

### From VSCode Marketplace (when published)
1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Pandocs"
4. Click Install

### From VSIX File
1. Download the `.vsix` file
2. Run: `code --install-extension pandocs.vsix`
3. Reload VSCode

### Development Install
1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Open in VSCode and press F5 to run in debug mode

## 🐛 Troubleshooting

### Common Issues

**Extension not working:**
1. Reload VSCode: `Ctrl+Shift+P` → "Developer: Reload Window"
2. Check if the command appears: `Ctrl+Shift+P` → "Pandocs: Open URL"

**Network errors:**
- Check your internet connection
- Verify the URL is correct and accessible
- Some websites may block requests from non-browsers

**Large files:**
- Default max file size is 10MB
- Increase `pandocs.maxFileSize` setting if needed
- Very large files may cause performance issues

**HTML not displaying correctly:**
- The extension converts HTML to Markdown for better readability
- Some complex layouts may not convert perfectly
- CSS styles are intentionally removed for clean content

## 📝 Release Notes

### v0.1.0 - Current
- ✨ **HTML to Markdown conversion** with automatic sanitization
- 🧹 **Content cleaning** - removes CSS, JavaScript, and unwanted elements
- 🎯 **Smart content type detection** and language mode switching
- 📊 **Progress indicators** during document fetching
- 🛡️ **Enhanced error handling** with informative messages
- 🔧 **Multiple format support** (HTML, JSON, XML, JavaScript, text)

### v0.0.1
- Initial release
- Basic URL opening functionality
- Support for HTML, JSON, XML, and text files
- Error handling and progress indicators

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/quynhvo/pandocs.git
cd pandocs

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in debug mode
# Open in VSCode and press F5
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 For More Information

* [Visual Studio Code's Extension API](https://code.visualstudio.com/api)
* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
* [Turndown.js](https://github.com/mixmark-io/turndown) - HTML to Markdown conversion library

## 📊 Stats

![VSCode Downloads](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=VSCode%20Downloads&query=downloads&url=https://marketplace.visualstudio.com/_apis/public/gallery/publishers/quynhvo/vsextensions/pandocs/latest/vspackage)
![Rating](https://img.shields.io/visual-studio-marketplace/rating/quynhvo.pandocs?color=blue&label=Rating)
![Version](https://img.shields.io/visual-studio-marketplace/v/quynhvo.pandocs?color=orange&label=Version)

---

**Made with ❤️ for developers who love clean, readable content**