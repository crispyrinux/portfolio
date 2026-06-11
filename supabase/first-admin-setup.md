# First Admin Setup

This guide explains how to insert the first admin user into `public.admin_profiles` for the hidden CMS.

## 1. Why This Step Is Needed

GitHub login only authenticates identity.

The `admin_profiles` table grants admin permission.

Without a matching `admin_profiles` row, a logged-in user should not access the dashboard.

This keeps admin access limited to the single approved user.

## 2. First Login Flow

1. Open `/admin` manually in the browser.
2. Click `Continue with GitHub`.
3. Complete the GitHub login flow.
4. Supabase creates the user in `Authentication > Users`.

## 3. Find The Supabase User ID

1. Open the Supabase Dashboard.
2. Go to `Authentication > Users`.
3. Find your GitHub login user.
4. Copy the `user_id`.

## 4. Insert The Admin Profile

Use this SQL template in the Supabase SQL Editor:

```sql
insert into public.admin_profiles (user_id, email, github_username, role)
values (
  'YOUR_SUPABASE_AUTH_USER_ID',
  'your_email@example.com',
  'your_github_username',
  'owner'
);
```

Replace every placeholder before running it.

## 5. Important Warnings

- Only insert your own `user_id`.
- Do not insert random users.
- Do not create a public insert policy for `admin_profiles`.
- Do not allow all authenticated users to become admins.

## 6. Verification

After the admin profile is inserted, `/admin/dashboard` should become accessible once `ProtectedRoute` is implemented in a later task.

Before `ProtectedRoute` exists, this step only prepares the admin permission record.
