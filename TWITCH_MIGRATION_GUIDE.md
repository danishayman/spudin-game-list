# 🎮 Twitch OAuth Migration Guide

This guide explains the migration from Google OAuth to Twitch OAuth for Spudin Game List.

## 📋 Checklist

### ✅ Completed Steps

1. **Twitch OAuth Application Setup**
   - Created Twitch application at https://dev.twitch.tv/console
   - Obtained Client ID and Client Secret
   - Configured redirect URLs

2. **Supabase Configuration**
   - Enabled Twitch provider in Supabase dashboard
   - Added Twitch Client ID and Client Secret
   - Disabled Google provider (optional)

3. **Code Updates**
   - Updated `lib/auth-actions.ts` with `signInWithTwitch()` function
   - Created `SignInWithTwitchButton` component
   - Updated `LoginForm` to use Twitch authentication
   - Added Twitch-compatible profile handling

4. **Configuration Updates**
   - Updated Next.js image configuration for Twitch avatars
   - Created database migration for improved profile handling

### 🔄 Manual Steps Required

#### 1. Apply Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Execute the contents of sql/update_profiles_for_twitch.sql
```

#### 2. Update Environment Variables

If you're using custom Twitch credentials in production, add them to your environment:

```env
# These are handled by Supabase, but you might need them for custom implementations
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

#### 3. Update Supabase Auth Settings

1. Go to Supabase Dashboard → Authentication → Settings
2. Update Site URL to match your domain
3. Add redirect URLs:
   - Development: `http://localhost:3000/auth/confirm`
   - Production: `https://your-domain.com/auth/confirm`

#### 4. Test the Integration

1. Clear browser cache and cookies
2. Try signing in with Twitch
3. Verify profile creation works correctly
4. Test that user data is properly stored

### 🔍 Verification Steps

After completing the migration:

- [ ] Twitch OAuth login works
- [ ] User profiles are created correctly
- [ ] Twitch avatars display properly
- [ ] Username extraction works from Twitch data
- [ ] Existing users (if any) can still access their data

### 🚨 Important Notes

1. **User Data Migration**: Existing Google users will need to create new accounts with Twitch, or you'll need to implement account linking.

2. **Avatar URLs**: Twitch uses different avatar URL structure than Google. The new profile handler accounts for this.

3. **Username Generation**: Twitch provides `login` and `display_name` fields, which are now properly handled.

4. **Email Scope**: Twitch requires explicit `user:read:email` scope to access user email addresses.

### 🔧 Troubleshooting

**Issue**: "Invalid redirect URI"
- **Solution**: Ensure redirect URLs in Twitch app match Supabase configuration

**Issue**: "Missing email permission"
- **Solution**: Verify `user:read:email` scope is included in the OAuth request

**Issue**: "Profile not created"
- **Solution**: Check that the database trigger is properly updated with the new SQL

**Issue**: "Avatar not loading"
- **Solution**: Verify Next.js image configuration includes Twitch CDN domains

### 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify Twitch application settings
3. Ensure all environment variables are correct
4. Test with a fresh browser session

## 🎯 Next Steps

After successful migration:
- Monitor user authentication metrics
- Update documentation to reflect Twitch login
- Consider adding social features that leverage Twitch community
- Update any marketing materials to mention Twitch integration