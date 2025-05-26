# Todo Application

A modern, full-featured todo application built with Next.js, TypeScript, Redux, and React Query.

## 🚀 Features

- ✅ **CRUD Operations**: Create, read, update, and delete todos
- 🔄 **State Management**: Redux Toolkit for global state
- 🌐 **API Integration**: React Query for server state management
- 🎨 **Modern UI**: shadcn/ui components with Tailwind CSS
- 🌙 **Dark Mode**: Theme switching with next-themes
- 📱 **Responsive**: Mobile-first design
- 🔍 **Search & Filter**: Real-time search and sorting
- ✨ **Batch Operations**: Mark all complete, delete completed
- 🧪 **Testing**: Comprehensive test suite with Jest and RTL
- 📝 **Form Validation**: Zod schemas with React Hook Form
- 🎯 **TypeScript**: Full type safety

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components

### State Management

- **Redux Toolkit** - Global state management
- **React Query** - Server state and caching
- **Zod** - Schema validation

### Form Management

- **React Hook Form** - Performant forms
- **Zod Resolver** - Form validation

### Testing

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking (optional)

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd todo-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run all tests

\`\`\`bash
npm test
\`\`\`

### Run tests in watch mode

\`\`\`bash
npm run test:watch
\`\`\`

### Generate coverage report

\`\`\`bash
npm run test:coverage
\`\`\`

### Test Structure

- **Unit Tests**: Individual components and functions
- **Integration Tests**: User flows and interactions
- **Redux Tests**: State management logic
- **API Tests**: Mock API interactions

## 📁 Project Structure

\`\`\`
├── app/ # Next.js App Router
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ └── todo-form.tsx # Custom components
├── lib/ # Utilities and configurations
│ ├── redux/ # Redux store and slices
│ ├── validations/ # Zod schemas
│ ├── api.ts # API client
│ ├── types.ts # TypeScript types
│ └── utils.ts # Utility functions
├── hooks/ # Custom React hooks
├── **tests**/ # Test files
│ ├── components/ # Component tests
│ ├── redux/ # Redux tests
│ └── integration/ # Integration tests
└── public/ # Static assets
\`\`\`

## 🔧 Configuration Files

### ESLint Configuration

\`\`\`json
{
"extends": ["next/core-web-vitals", "prettier"],
"plugins": ["testing-library", "jest-dom"],
"rules": {
// Custom rules
}
}
\`\`\`

### Prettier Configuration

\`\`\`js
module.exports = {
semi: false,
singleQuote: true,
tabWidth: 2,
trailingComma: 'es5',
printWidth: 80,
}
\`\`\`

### Jest Configuration

- Unit and integration testing setup
- Coverage thresholds (80% minimum)
- Mock configurations for Next.js

## 🎯 Key Features Implementation

### Redux State Management

- **Todo Slice**: CRUD operations with async thunks
- **UI Slice**: Filters, theme, and UI state
- **Selectors**: Memoized selectors for performance

### React Query Integration

- **Caching**: Intelligent data caching
- **Background Updates**: Automatic refetching
- **Optimistic Updates**: Immediate UI feedback

### Form Validation

- **Zod Schemas**: Type-safe validation
- **React Hook Form**: Performance optimization
- **Error Handling**: User-friendly error messages

### Testing Strategy

- **Component Testing**: User interaction testing
- **Redux Testing**: State management verification
- **Integration Testing**: End-to-end user flows
- **API Mocking**: Isolated testing environment

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Memoization**: Redux selectors and React components
- **Lazy Loading**: Dynamic imports where appropriate
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Docker

\`\`\`bash
docker build -t todo-app .
docker run -p 3000:3000 todo-app
\`\`\`

## 📝 API Documentation

### Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle completion

### Data Models

\`\`\`typescript
interface Todo {
id: string
title: string
description?: string
completed: boolean
createdAt: string
updatedAt: string
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [React Query](https://tanstack.com/query) - Server state
- [Tailwind CSS](https://tailwindcss.com/) - Styling
