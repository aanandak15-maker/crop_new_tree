# 🔐 Authentication System Setup Guide

## Overview

This guide explains how to set up the **Supabase Authentication System** with **Manual Admin Approval** for your Crop Tree Explorer application.

## ✨ Features

- 🔐 **Secure Authentication** with Supabase
- 👥 **User Registration** with approval workflow
- 🎭 **Role-Based Access Control** (User, Moderator, Admin)
- ✅ **Manual Admin Approval** for new registrations
- 🛡️ **Protected Routes** and components
- 📊 **User Management Dashboard** for admins

## 🚀 Quick Start

### 1. Supabase Setup

1. **Enable Authentication** in your Supabase project:
   - Go to Authentication > Settings
   - Enable Email confirmations (optional)
   - Configure email templates

2. **Run Database Migration**:
   ```bash
   # Apply the user_profiles table migration
   supabase db push
   ```

### 2. Environment Variables

Add these to your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. First Admin User

1. **Register** your first account at `/auth`
2. **Manually approve** in Supabase database:
   ```sql
   UPDATE user_profiles 
   SET is_approved = true, role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

## 🔧 How It Works

### User Registration Flow
```
1. User visits /auth → Registers account
2. Account created with is_approved = false
3. Admin reviews in User Management dashboard
4. Admin approves/rejects user
5. Approved users can access protected routes
```

### Role Hierarchy
- **👤 User**: Basic crop viewing and search
- **👨‍💼 Moderator**: Edit crops, manage content
- **👑 Admin**: Full system access, user management

### Protected Routes
- `/admin` - Requires authentication + approval + user role
- All admin components are protected
- Navigation shows user status and role

## 📱 User Interface

### Authentication Pages
- **`/auth`** - Login/Register with role selection
- **Success Messages** - Clear feedback for users
- **Pending Approval** - Shows approval status

### Admin Dashboard
- **User Management Tab** - First tab in admin panel
- **Pending Users** - Quick approval/rejection
- **User Search** - Find users by name/email/organization
- **Role Management** - Change user roles
- **Bulk Operations** - Future feature

## 🛡️ Security Features

### Row Level Security (RLS)
- Users can only see their own profile
- Admins can see and manage all profiles
- Protected from unauthorized access

### Authentication Guards
- Protected routes check user status
- Role-based access control
- Automatic redirects for unauthorized users

### Session Management
- Secure token handling
- Automatic session refresh
- Proper logout functionality

## 🔍 Troubleshooting

### Common Issues

1. **"Profile Not Found" Error**
   - User profile wasn't created during registration
   - Check Supabase logs for errors

2. **"Account Pending Approval"**
   - Normal state for new registrations
   - Admin needs to approve in User Management

3. **"Access Denied"**
   - User role insufficient for requested action
   - Admin can upgrade user role

4. **Authentication Errors**
   - Check Supabase configuration
   - Verify environment variables
   - Check browser console for errors

### Debug Steps

1. **Check Supabase Dashboard**:
   - Authentication > Users
   - Database > Tables > user_profiles

2. **Verify RLS Policies**:
   - Database > Policies
   - Ensure user_profiles has proper policies

3. **Check Browser Console**:
   - Look for authentication errors
   - Verify API calls to Supabase

## 📊 Database Schema

### user_profiles Table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes
- `user_id` - For fast user lookups
- `email` - For email searches
- `is_approved` - For approval status filtering
- `role` - For role-based queries

## 🚀 Production Deployment

### Security Checklist
- [ ] Change default admin credentials
- [ ] Configure email templates
- [ ] Set up proper CORS policies
- [ ] Enable audit logging
- [ ] Configure backup strategies

### Monitoring
- Monitor user registrations
- Track approval times
- Watch for failed authentication attempts
- Monitor database performance

## 🔮 Future Enhancements

### Planned Features
- **Email Notifications** for approval/rejection
- **Bulk User Operations** (approve multiple users)
- **User Activity Logging** and analytics
- **Advanced Role Permissions** (granular access control)
- **Two-Factor Authentication** (2FA)
- **SSO Integration** (Google, GitHub, etc.)

### Customization Options
- **Custom Approval Workflows**
- **Role-Specific Features**
- **User Onboarding** processes
- **Integration** with external systems

## 📞 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review Supabase documentation** for authentication
3. **Check browser console** for error messages
4. **Verify database migrations** are applied
5. **Test with a fresh user account**

## 🎯 Best Practices

### For Admins
- **Regularly review** pending registrations
- **Use appropriate roles** for users
- **Monitor user activity** and access patterns
- **Keep user data** up to date

### For Users
- **Provide accurate information** during registration
- **Wait for approval** before contacting support
- **Use strong passwords** for security
- **Keep profile information** current

---

**🎉 Congratulations!** You now have a professional-grade authentication system with manual admin approval for your Crop Tree Explorer application.
