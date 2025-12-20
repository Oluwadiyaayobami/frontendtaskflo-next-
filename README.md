# SecureVault - Task Manager + Password Manager

A modern, secure frontend for managing tasks and passwords with end-to-end encryption.

## 🚀 Features

- **Authentication**: JWT-based authentication with refresh token support
- **Password Vault**: Securely store and manage passwords (encrypted on backend)
- **Task Management**: Create and organize todos (UI-ready)
- **Dark Mode**: Beautiful dark theme interface
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

- **React 19** with Next.js App Router
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **Axios** for API requests with automatic token refresh
- **Shadcn/UI** components

## 📦 Installation

1. **Clone or download the project**

2. **Install dependencies**:
```bash
npm install
```

3. **Configure backend URL** (if different from default):

Edit `lib/axios.ts` and update the baseURL:
```typescript
baseURL: 'http://localhost:5000/api', // Change port if needed
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser** to `http://localhost:3000`

## 🔧 Backend Configuration

This frontend expects the following backend API endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User login (returns `acesstoken`)
- `GET /api/dashboard` - User dashboard data (protected)
- `POST /api/refresh` - Refresh access token (protected, uses cookie)
- `POST /api/addnewpassword` - Add new password (protected)
- `GET /api/allpassword` - Get all passwords (protected)

**Important**: The backend must support CORS and cookies (`withCredentials: true`)

## 🔐 Security Features

- ✅ JWT access token stored in localStorage
- ✅ Refresh token stored in HTTP-only cookie (handled by backend)
- ✅ Automatic token refresh on 401 errors
- ✅ Protected routes with authentication guards
- ✅ Passwords encrypted/decrypted only on backend
- ✅ No JWT decoding on frontend

## 📱 Pages

1. **Home** (`/`) - Landing page with features
2. **Register** (`/register`) - Create new account
3. **Login** (`/login`) - Sign in to existing account
4. **Dashboard** (`/dashboard`) - Main user dashboard (protected)
5. **Add Password** (`/passwords/add`) - Store new password (protected)
6. **View Passwords** (`/passwords`) - View all stored passwords (protected)
7. **Add Todo** (`/todos/add`) - Create new todo (protected, UI-ready)

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css` and modify the CSS variables:

```css
.dark {
  --primary: oklch(0.65 0.25 262); /* Primary brand color */
  --accent: oklch(0.60 0.28 220);  /* Accent color */
  /* ... */
}
```

### Change App Name

1. Update `app/layout.tsx` metadata
2. Replace "SecureVault" in navigation components

## 🐛 Troubleshooting

**Issue**: "401 Unauthorized" errors
- **Solution**: Check that backend is running and baseURL is correct

**Issue**: CORS errors
- **Solution**: Backend must allow credentials and correct origin

**Issue**: Refresh token not working
- **Solution**: Ensure backend sets HTTP-only cookie named `refreshtoken`

**Issue**: Login works but dashboard shows loading
- **Solution**: Verify `/api/dashboard` returns user data (username, id, email)

## 📝 Notes

- Todo management UI is ready but backend integration is optional
- Backend uses typo `acesstoken` (not `accessToken`) - frontend handles this
- Only users with `role: "user"` can access dashboard (admin blocked per backend rules)
- Passwords are sent as plaintext to backend (backend handles encryption)

## 🚢 Production Deployment

1. Build the project:
```bash
npm run build
```

2. Update backend URL to production endpoint in `lib/axios.ts`

3. Deploy to Vercel, Netlify, or any static hosting service

## 📄 License

Built with ❤️ for secure password and task management.
