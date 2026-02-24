# Orbit Task Nexus

A modern, full-stack task management application designed to help individuals and teams organize, track, and complete their daily tasks efficiently.

## 🌟 About This Project

Orbit Task Nexus is more than just a simple to-do list app. It's a comprehensive task management solution that combines powerful features with an intuitive user interface. Built with modern web technologies, this application demonstrates best practices in full-stack development, from responsive frontend design to secure backend architecture.

### 🎯 Project Goals

- **Simplify Task Management**: Make it easy to capture, organize, and track tasks
- **Boost Productivity**: Help users focus on what matters most with smart prioritization
- **Provide Flexibility**: Support different workflows with multiple view options
- **Ensure Security**: Implement robust authentication and data protection
- **Deliver Excellence**: Showcase modern development practices and clean code

## ✨ Key Features

### Core Functionality
- **Smart Task Management**: Create, edit, delete, and organize tasks with ease
- **Multiple Views**: Switch between List view, Kanban board, and Calendar view
- **Subtask Support**: Break down complex tasks into manageable smaller steps
- **Category Organization**: Group tasks with color-coded categories
- **Flexible Tagging**: Add custom tags for better organization and filtering
- **Priority Levels**: Set priority as Low, Medium, High, or Urgent
- **Status Tracking**: Track progress through Todo, In Progress, and Done stages

### Advanced Features
- **Due Dates & Times**: Set specific deadlines with time-based reminders
- **Smart Recurrence**: Set up daily, weekly, monthly, or custom recurring tasks
- **Intelligent Reminders**: Configurable notifications to keep you on track
- **Powerful Search**: Find tasks quickly with advanced filtering and search
- **Data Analytics**: Visual charts and insights into your productivity patterns
- **Offline Support**: Access and modify tasks even when offline

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Comfortable viewing in any lighting condition
- **Keyboard Shortcuts**: Power user features for efficient navigation
- **Real-time Updates**: See changes instantly across all devices
- **Accessibility**: Built with WCAG guidelines for inclusive design

## 🔐 Security & Authentication

- **JWT-based Authentication**: Secure token-based login system
- **OAuth Integration**: Sign in with Google, Facebook, or GitHub
- **Session Management**: Persistent and secure login across sessions
- **Password Security**: Encrypted password storage using bcrypt
- **Rate Limiting**: Protection against brute force attacks
- **Data Validation**: Comprehensive input validation and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (v12 or higher)
- Git for version control
- npm or yarn package manager

### Quick Start Guide

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd orbit-task-nexus-ui
   ```

2. **Install Dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cd server
   cp .env.example .env
   
   # Edit .env with your configuration
   # Set up database URL, JWT secrets, and OAuth credentials
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb orbit_task_nexus
   
   # Run database migrations
   npm run migrate
   ```

5. **Launch the Application**
   ```bash
   # Start backend server (terminal 1)
   cd server
   npm run dev
   
   # Start frontend server (terminal 2)
   cd ..
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## 🏗️ Technology Stack

### Frontend Technologies
- **React 18** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible component library
- **React Query** - Powerful server state management
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend Technologies
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type safety throughout the backend
- **PostgreSQL** - Powerful relational database
- **JWT** - Secure authentication tokens
- **Passport.js** - Authentication middleware for OAuth
- **bcryptjs** - Password hashing for security
- **Helmet** - Security headers for Express
- **Rate Limiting** - Protection against API abuse

## 📁 Project Structure

```
orbit-task-nexus-ui/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── TaskForm.tsx    # Task creation/editing
│   │   ├── TaskItem.tsx    # Individual task display
│   │   ├── KanbanView.tsx  # Kanban board view
│   │   └── CalendarView.tsx # Calendar view
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts    # Toast notifications
│   ├── lib/                # Utilities and API
│   │   └── api.ts          # API client
│   └── pages/              # Page components
├── server/
│   ├── src/                # Backend source code
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Backend utilities
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
└── package.json            # Frontend dependencies
```

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile information
- `PUT /api/auth/profile` - Update user profile

### Task Management Endpoints
- `GET /api/tasks` - Retrieve all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task details
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/subtasks` - Add subtask to task

### Category Management
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/orbit_task_nexus

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🎨 Design System

The application uses a consistent design system built on:
- **Color Palette**: Carefully chosen colors for different states and priorities
- **Typography**: Readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing system
- **Components**: Reusable components with consistent behavior
- **Animations**: Subtle animations for better user experience

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Prevention**: Using parameterized queries
- **XSS Protection**: Content Security Policy and input sanitization
- **Authentication**: Secure JWT tokens with proper expiration
- **HTTPS**: Enforced secure connections in production
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Properly configured cross-origin resource sharing

## 🧪 Testing Strategy

- **Unit Tests**: Testing individual functions and components
- **Integration Tests**: Testing API endpoints and database operations
- **E2E Tests**: Testing complete user workflows
- **Type Checking**: TypeScript for compile-time error detection
- **Linting**: ESLint for code quality and consistency

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of components and routes
- **Caching**: API response caching with React Query
- **Bundle Optimization**: Tree shaking and minification with Vite
- **Database Indexing**: Optimized database queries
- **Image Optimization**: Responsive images and lazy loading
- **CDN Ready**: Static asset optimization for CDN deployment

## 🚀 Deployment

### Development Environment
- Frontend: Vite dev server on port 8080
- Backend: Express server on port 5000
- Database: Local PostgreSQL instance

### Production Deployment Options
- **Vercel**: Frontend deployment with automatic CI/CD
- **Render**: Full-stack deployment with managed databases
- **AWS**: Scalable infrastructure with ECS and RDS
- **Docker**: Containerized deployment for consistency

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**
4. **Write Tests**: Ensure your changes are well-tested
5. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful component library
- **Vercel** - For the excellent build tools and hosting platform
- **Open Source Community** - For all the amazing libraries and tools

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Documentation**: Review this README and API docs
2. **Search Issues**: Look for existing issues in the repository
3. **Create an Issue**: Provide detailed information about your problem
4. **Join Discussions**: Engage with the community

---

**Built with ❤️ by the Orbit Task Nexus team**
