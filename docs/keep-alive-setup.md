# GitHub Actions Keep-Alive Setup

This guide explains how to configure and test the Supabase keep-alive workflow for this portfolio project.

## 1. Purpose

The workflow sends a lightweight request to Supabase on a schedule.

It exists because this project uses Supabase Free and may be affected by inactivity pause.

It helps reduce that risk, but it is not a guarantee of permanent uptime.

If the project becomes serious or production-critical, upgrading to a paid Supabase plan may still be the right move.

## 2. Required GitHub Secrets

Create these repository secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 3. Where To Add Secrets

In GitHub:

1. Open the repository.
2. Go to `Settings`.
3. Open `Secrets and variables`.
4. Choose `Actions`.
5. Click `New repository secret`.
6. Add the secret name and value.

## 4. What Values To Use

- `SUPABASE_URL` should be your Supabase Project URL.
- `SUPABASE_ANON_KEY` should be the anon or publishable key.

Do not use the service role key.

Do not put secrets in the frontend or in committed files.

## 5. How To Test Manually

1. Open the repository in GitHub.
2. Go to the `Actions` tab.
3. Select the `Supabase Keep Alive` workflow.
4. Click `Run workflow`.
5. Check the logs.
6. Confirm that no secret values are printed.

If the workflow fails, the logs should show a readable error without exposing the secret values.

## 6. Expected Request

The workflow sends a GET request to:

```text
{SUPABASE_URL}/rest/v1/projects?select=id&limit=1
```

It uses the anon key in request headers.

## 7. Limitations

- This does not guarantee permanent uptime.
- Supabase policy or behavior may change.
- Local fallback data still protects the public UI if Supabase is unavailable.
- If the portfolio becomes important, consider Supabase Pro later.

## 8. Security Warnings

- Never commit secrets.
- Never use the service role key.
- Do not print secret values in workflow logs.
- Keep the workflow limited to lightweight read access only.
