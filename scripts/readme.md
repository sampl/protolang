# Scripts

Run these scripts to keep the database updated.

- `/migrations` - Setting up tables, db functions, etc. Each should be run once probably.
- `/data` - Routine scripts run regularly to update the db with lesson and word data.

## Setup

Create a `.env` file in the `/scripts` directory and add the database connection string like so:

`ADMIN_POSTGRES_CONNECTION_STRING=postgresql://postgres:password123@db.abc123.supabase.co:1234/postgres`
