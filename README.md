# Kindergarten CRM System

A fully functional, modern, and animated Kindergarten CRM system with multi-role support (Admin, Director, Teacher, Parent).

## Features

### 🔐 Authentication
- Code-based login system (no email/password)
- Role-based access control
- Secure session management

### 👥 Roles & Access

#### Admin Panel
- ✅ Full access to all modules
- ✅ Manage children, meals, vaccinations, activities
- ✅ View attendance and complaints
- ✅ System settings

#### Director Panel
- ✅ View and approve all modules
- ✅ **Food Storage Management** (exclusive to Director)
- ✅ View reports and statistics
- ✅ Approve complaints

#### Teacher Panel
- ✅ Manage assigned groups
- ✅ Record meals, sleep, homework
- ✅ Mark attendance
- ✅ View and update activities

#### Parent Panel
- ✅ View own child's information only
- ✅ QR Code integration
- ✅ View meals, vaccinations, activities
- ✅ Track sleep and homework
- ✅ Send complaints and suggestions

### 📱 Modules

1. **Ovqatlanish (Meals)**
   - Track breakfast, lunch, snack
   - Time and menu recording
   - Real-time updates for parents

2. **Emlash (Vaccination)**
   - Vaccine records
   - Due dates and reminders
   - Status tracking (pending/completed)

3. **Mashg'ulotlar (Activities)**
   - Daily schedule
   - Lesson planning
   - Progress tracking

4. **Ombor (Food Storage)** - Director Only
   - Food inventory management
   - Low stock warnings
   - Add/remove items

5. **Uxlayotgan vaqti (Sleep Tracking)**
   - Sleep start/end times
   - Duration calculation
   - Daily records

6. **Uyga vazifalar (Homework)**
   - Assign homework
   - Track completion status
   - Due dates

7. **Qabul qilish (Attendance)**
   - QR code scanning
   - Manual marking
   - Daily/weekly/monthly reports

8. **Shikoyatlar & Takliflar (Complaints)**
   - Parent complaints
   - Status tracking
   - Admin/Director responses

### 🎨 UI/UX Features

- **Framer Motion** animations
- **4 Color Themes**: Blue, Green, Purple, Orange
- **Dark Mode** support
- **Multi-language**: English, Русский, O'zbek, Ўзбек (кирил)
- **Responsive Design**: Mobile + Desktop
- **Modern Dashboard** layouts
- **Micro-animations** on all interactions

### 🔧 Tech Stack

- **Frontend**: React + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **i18n**: react-i18next
- **Charts**: Recharts (ready for integration)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Login Codes

Use these codes to login:

- **Admin**: `ADMIN001` or `ADMIN002`
- **Director**: `DIR001` or `DIR002`
- **Teacher**: `TEACH001` or `TEACH002`
- **Parent**: `PARENT001`, `PARENT002`, or `PARENT003`

### Database Setup

The system currently uses **localStorage** for data persistence. For production, use the provided SQL schema in `database/schema.sql` to set up a PostgreSQL database.

## Project Structure

```
src/
├── admin/              # Admin panel
│   ├── pages/         # Admin pages
│   └── AdminLayout.jsx
├── director/          # Director panel
│   ├── pages/         # Director pages
│   └── DirectorLayout.jsx
├── teacher/           # Teacher panel
│   ├── pages/         # Teacher pages
│   └── TeacherLayout.jsx
├── parent/            # Parent panel
│   ├── pages/         # Parent pages
│   └── ParentLayout.jsx
├── components/        # Shared components
│   └── shared/        # Layout, Sidebar, Navbar
├── contexts/          # React contexts
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── LanguageContext.jsx
├── i18n/              # Translations
│   ├── config.js
│   └── locales/       # Language files
└── pages/             # Common pages (Login)
```

## Database Schema

See `database/schema.sql` for the complete PostgreSQL schema.

## API Integration

The system is ready for backend integration. Replace localStorage calls with API calls:

```javascript
// Example: Replace localStorage with API
const loadMeals = async () => {
  const response = await fetch('/api/meals')
  const data = await response.json()
  setMeals(data)
}
```

## Customization

### Adding New Themes

Edit `src/contexts/ThemeContext.jsx`:

```javascript
const THEMES = {
  // Add your theme
  custom: {
    name: 'Custom',
    primary: 'from-custom-500 to-custom-600',
    // ...
  }
}
```

### Adding Translations

Edit files in `src/i18n/locales/`:

```json
{
  "newKey": "New Translation"
}
```

## Development

### Adding New Modules

1. Create page component in appropriate role folder
2. Add route in `src/App.jsx`
3. Add menu item in sidebar
4. Update translations

### Role Permissions

Permissions are enforced in:
- Route protection (`ProtectedRoute`)
- Component-level checks
- API endpoints (when integrated)

## Production Deployment

1. Set up PostgreSQL database using `database/schema.sql`
2. Configure environment variables
3. Replace localStorage with API calls
4. Build: `npm run build`
5. Deploy to your hosting platform

## License

MIT License

## Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Kindergarten Management**
