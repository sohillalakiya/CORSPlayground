# CORSPlayground 🚀

A powerful Next.js application for testing and debugging CORS (Cross-Origin Resource Sharing) policies on REST APIs. This tool helps developers understand and verify CORS behavior with both direct browser requests and proxy mode capabilities.

## 🎯 Purpose

CORSPlayground is designed to:
- Test API endpoints for CORS compliance
- Debug CORS-related issues during development
- Bypass CORS restrictions using proxy mode for testing
- Understand how different origins interact with your APIs

## ✨ Features

### 🔒 Authentication
- Secure login system using NextAuth.js
- Session management with JWT tokens
- Protected routes for authenticated users only

### 🧪 API Testing Capabilities
- **Multiple HTTP Methods**: Support for GET, POST, PUT, and DELETE requests
- **Custom Headers**: Add and manage request headers with key-value pairs or JSON format
- **Request Body Options**: 
  - JSON payloads
  - Form data
  - Raw text with custom content types
- **Response Visualization**: 
  - Formatted JSON responses
  - Response headers inspection
  - Status codes and timing information

### 🛡️ CORS Testing Features
- **Direct Mode**: Make requests directly from the browser to test actual CORS behavior
- **Proxy Mode**: Bypass CORS restrictions using server-side proxy for development testing
- **Visual Indicators**: Clear status indicators showing whether requests are proxied or direct
- **Real-time Feedback**: Immediate feedback on CORS policy violations

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Dark/Light theme support
- Intuitive tabbed interface for different HTTP methods
- Real-time request/response monitoring
- Copy and download response data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd corsplayground
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:2306
NEXTAUTH_SECRET=your-secret-key-here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will start on [http://localhost:2306](http://localhost:2306)

### Default Login Credentials
- **Username**: sohil
- **Password**: Sohil@123

## 📖 Usage Guide

### Testing APIs with Direct Mode (CORS Enabled)
1. Navigate to the API Testing page after logging in
2. Ensure "CORS Proxy" toggle is **disabled**
3. Enter your API endpoint URL
4. Configure headers and request body as needed
5. Click "Send Request"
6. Observe CORS behavior - requests will be blocked if the API doesn't allow your origin

### Testing APIs with Proxy Mode (Bypass CORS)
1. Enable the "CORS Proxy" toggle
2. Enter your API endpoint URL
3. Configure your request
4. Click "Send Request"
5. The request will be proxied through the server, bypassing browser CORS restrictions

### Understanding the Results
- **Green indicators**: Successful requests
- **Red indicators**: Failed requests or CORS blocks
- **Response panel**: Shows data, headers, and request metadata
- **CORS errors**: Will appear when direct mode encounters CORS policy violations

## 🏗️ Project Structure

```
corsplayground/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   ├── proxy/          # CORS proxy endpoint
│   │   │   └── test/           # Test API endpoint
│   │   ├── api-testing/        # API testing page
│   │   └── login/              # Authentication page
│   ├── components/
│   │   ├── api-testing/        # API testing components
│   │   ├── auth/               # Authentication components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       ├── api-client.ts       # API client with proxy support
│       └── auth.ts             # NextAuth configuration
├── public/                     # Static assets
└── package.json               # Project dependencies
```

## 🔧 Configuration

### Changing the Port
By default, the application runs on port 2306. To change it, modify the scripts in `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p YOUR_PORT",
    "start": "next start -p YOUR_PORT"
  }
}
```

### Authentication Configuration
Authentication settings can be modified in `src/lib/auth.ts`. Currently uses hardcoded credentials for simplicity, but can be extended to use:
- Database authentication
- OAuth providers (Google, GitHub, etc.)
- Custom authentication providers

## 🔐 Security Considerations

⚠️ **Important**: This tool is designed for development and testing purposes only.

- The proxy mode bypasses CORS restrictions and should **never** be exposed in production
- Default credentials should be changed in production environments
- Always use HTTPS in production
- Implement rate limiting for proxy endpoints in production use cases

## 🧪 Testing Your Own APIs

### Example: Testing with idb-next API
If you have an API running on `http://localhost:3000`:

1. **Test CORS Block (Direct Mode)**:
   - URL: `http://localhost:3000/api/users`
   - Proxy: Disabled
   - Result: Should be blocked if API only allows same-origin

2. **Test with Proxy (Development)**:
   - URL: `http://localhost:3000/api/users`
   - Proxy: Enabled
   - Result: Should successfully fetch data

## 🛠️ Development

### Building for Production
```bash
npm run build
npm run start
```

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## 📝 API Endpoints

### Internal Endpoints
- `POST /api/proxy` - Proxy endpoint for bypassing CORS
- `GET/POST/PUT/DELETE /api/test` - Test endpoints for development

### Proxy Endpoint Usage
```javascript
POST /api/proxy
Content-Type: application/json

{
  "method": "GET",
  "url": "https://api.example.com/data",
  "headers": {
    "Authorization": "Bearer token"
  },
  "body": {} // For POST/PUT requests
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Note**: This tool is intended for development and testing purposes. Always follow CORS best practices and security guidelines in production environments.