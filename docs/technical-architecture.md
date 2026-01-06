# Technical Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   VSCode UI     │    │  Extension Core  │    │  External APIs   │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Input Box   │ │◄──►│ │ Command      │ │◄──►│ │ HTTP/S      │ │
│ │ Status Bar  │ │    │ │ Handler      │ │    │ │ Endpoints   │ │
│ │ Web View    │ │    │ └──────────────┘ │    │ └─────────────┘ │
│ └─────────────┘ │    │                  │    │                 │
│                 │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
└─────────────────┘    │ │ Service      │ │◄──►│ │ Auth        │ │
                       │ │ Layer        │ │    │ │ Services    │ │
                       │ └──────────────┘ │    │ └─────────────┘ │
                       │                  │    │                 │
                       │ ┌──────────────┐ │    │ ┌─────────────┐ │
                       │ │ Utility      │ │    │ │ Cache       │ │
                       │ │ Layer        │ │    │ │ Storage     │ │
                       │ └──────────────┘ │    │ └─────────────┘ │
                       └──────────────────┘    └─────────────────┘
```

## Core Components

### 1. Extension Activation (`extension.ts`)
- Entry point for VSCode extension
- Registers commands and configuration
- Initializes services and utilities

### 2. Command Layer (`commands/`)
**openUrl.ts**
- Handles URL input from user
- Validates URL format
- Triggers document fetching process

**showHistory.ts**
- Manages URL history display
- Provides quick pick interface
- Handles history selection

### 3. Service Layer (`services/`)

**httpClient.ts**
```typescript
interface IHttpClient {
  fetch(url: string): Promise<Buffer | string>
  fetchWithAuth(url: string, auth: AuthConfig): Promise<Buffer | string>
  setHeaders(headers: Record<string, string>): void
  setTimeout(timeout: number): void
}
```

**cache.ts**
```typescript
interface ICache {
  get(key: string): Promise<DocumentData | null>
  set(key: string, data: DocumentData): Promise<void>
  clear(): Promise<void>
  cleanup(): Promise<void>
}
```

**auth.ts**
```typescript
interface IAuthService {
  addAuthConfig(url: string, config: AuthConfig): void
  getAuthHeaders(url: string): Record<string, string>
  removeAuthConfig(url: string): void
}
```

### 4. Utility Layer (`utils/`)

**validation.ts**
```typescript
interface UrlValidator {
  isValidUrl(url: string): boolean
  isAccessibleUrl(url: string): boolean
  sanitizeUrl(url: string): string
}
```

**contentType.ts**
```typescript
interface ContentTypeDetector {
  detectFromHeaders(headers: Record<string, string>): string
  detectFromContent(content: Buffer): string
  mapToLanguageMode(contentType: string): string
}
```

## Data Flow

### URL Input Flow
```
User Input → Command Handler → URL Validation → HTTP Client → Content Processing → Document Display
```

### Document Fetching Flow
```
URL Request → Auth Check → Cache Check → HTTP Fetch → Content Detection → Type Processing → Editor Display
```

### Error Handling Flow
```
Error Occurs → Error Classification → User Notification → Logging → Recovery Options
```

## Type Definitions

```typescript
interface DocumentData {
  content: string | Buffer
  contentType: string
  language: string
  size: number
  fetchedAt: Date
  url: string
}

interface AuthConfig {
  type: 'basic' | 'bearer' | 'apikey'
  credentials: Record<string, string>
}

interface ExtensionConfig {
  timeout: number
  maxFileSize: number
  enableCache: boolean
  cacheSize: number
  userAgent: string
  proxy?: string
}

interface UrlHistory {
  url: string
  title?: string
  lastAccessed: Date
  contentType?: string
}
```

## Security Considerations

### 1. URL Validation
- Whitelist allowed protocols (http, https, ftp)
- Prevent local file access (`file://` protocol)
- Validate URL format and encoding

### 2. Content Security
- Sanitize HTML content before rendering
- Prevent XSS attacks in webview
- Handle binary files safely

### 3. Authentication Security
- Store credentials securely
- Use VSCode SecretStorage API
- Implement proper token management

### 4. Network Security
- Support proxy configurations
- Handle SSL/TLS verification
- Prevent request smuggling

## Performance Optimizations

### 1. Caching Strategy
- LRU cache for recently accessed documents
- Configurable cache size limits
- Automatic cache cleanup

### 2. Lazy Loading
- Load content only when requested
- Stream large files instead of loading all at once
- Background prefetch for frequently accessed URLs

### 3. Memory Management
- Dispose unused documents
- Monitor memory usage
- Implement garbage collection hints

### 4. Network Optimization
- Request timeout configuration
- Connection pooling
- Retry mechanisms for failed requests

## Error Handling Strategy

### Error Categories
```typescript
enum ErrorType {
  NETWORK_ERROR = 'network',
  VALIDATION_ERROR = 'validation',
  AUTHENTICATION_ERROR = 'auth',
  CONTENT_ERROR = 'content',
  SYSTEM_ERROR = 'system'
}

interface ExtensionError {
  type: ErrorType
  message: string
  code: string
  recoverable: boolean
  suggestions: string[]
}
```

### Recovery Mechanisms
- Automatic retry for network failures
- Fallback content viewers
- Graceful degradation for unsupported formats
- User guidance for configuration issues

## Extension Configuration

### Settings Schema
```json
{
  "documentReader.timeout": {
    "type": "number",
    "default": 30000,
    "description": "Request timeout in milliseconds"
  },
  "documentReader.maxFileSize": {
    "type": "number",
    "default": 10485760,
    "description": "Maximum file size in bytes (10MB default)"
  },
  "documentReader.enableCache": {
    "type": "boolean",
    "default": true,
    "description": "Enable document caching"
  },
  "documentReader.cacheSize": {
    "type": "number",
    "default": 50,
    "description": "Maximum number of cached documents"
  },
  "documentReader.userAgent": {
    "type": "string",
    "default": "VSCode-Document-Reader/1.0",
    "description": "User agent string for HTTP requests"
  },
  "documentReader.proxy": {
    "type": "string",
    "description": "Proxy server URL"
  }
}
```

## Testing Architecture

### Unit Testing
- Test individual components in isolation
- Mock external dependencies
- Cover edge cases and error scenarios

### Integration Testing
- Test command flows end-to-end
- Verify VSCode API interactions
- Test with real document sources

### Performance Testing
- Measure response times
- Test with large documents
- Monitor memory usage

### Security Testing
- Test URL validation
- Verify authentication handling
- Check for XSS vulnerabilities

## Deployment Architecture

### Build Process
```typescript
// webpack.config.js (if needed)
module.exports = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  }
}
```

### Package Configuration
- VSCode extension manifest
- Dependency management
- Version control strategy

### Release Pipeline
- Automated testing
- Version tagging
- Marketplace publishing
- Release notes generation