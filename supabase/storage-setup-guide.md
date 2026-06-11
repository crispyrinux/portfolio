# Supabase Storage Setup Guide

This guide explains the manual Supabase Storage setup for project media in the Futuristic Backend Lab Portfolio CMS.

No application code, upload logic, storage policies, or UI changes are included in this step.

## 1. Purpose

Supabase Storage will be used later for optional portfolio media:

- project thumbnails
- project screenshots

Thumbnails are optional. A project without a thumbnail must still render with a clean placeholder.

Screenshots are optional. A project without screenshots must not show a screenshot section.

## 2. Buckets To Create

Create these buckets manually in Supabase Storage:

- `project-thumbnails`
- `project-screenshots`

## 3. Bucket Visibility Recommendation

For portfolio media, these buckets can be public so images are easy to display on the public portfolio.

Public buckets only mean the files can be read publicly. Upload, update, and delete permissions must still be restricted through Storage policies.

Recommended approach:

- allow public read for portfolio images
- allow upload/update/delete only for users in `admin_profiles`
- deny uploads from public visitors
- deny uploads from random authenticated users

## 4. Manual Setup Steps

1. Open the Supabase Dashboard.
2. Open your project.
3. Go to Storage.
4. Create a bucket named `project-thumbnails`.
5. Create a bucket named `project-screenshots`.
6. Set public access if following the public bucket approach.
7. Run `storage-policies.sql` after it is created in the next task.

Do not add storage upload code until the app has the correct bucket policies.

## 5. Security Notes

Public read is acceptable for portfolio images because thumbnails and screenshots are meant to be displayed publicly.

Public upload is not acceptable. Only the whitelisted admin user should be able to upload, update, or delete media.

Security requirements:

- only users listed in `admin_profiles` should manage storage files
- do not allow every authenticated user to upload
- do not allow anonymous users to upload
- do not use a Supabase service role key in frontend code
- do not commit storage secrets or API keys

GitHub login only authenticates identity. Admin permission must still come from the `admin_profiles` whitelist and Supabase policies.

## 6. File Naming Recommendation

Use stable, URL-safe file paths.

Good examples:

```text
projects/PROJECT_ID/thumbnail-1700000000000.jpg
projects/PROJECT_ID/screenshots/screen-01.png
projects/PROJECT_ID/screenshots/screen-02.png
```

Recommendations:

- use the project id or a timestamp in the file path
- avoid spaces
- use lowercase names when practical
- keep file names URL-safe
- avoid special characters that make URLs harder to read

## 7. Notes

Storage policies will be handled separately.

Advanced image optimization, cropping, and transformation are not part of this batch.

Drag-and-drop upload is not required.

Screenshots and thumbnails should remain optional throughout the CMS.
