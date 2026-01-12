# Database Safety Guidelines

## ⚠️ CRITICAL: Never use `--force-reset` on production

The command `npx prisma db push --force-reset` will **DELETE ALL DATA** in your database.

## Safe Commands

### Development (Local Database)
```bash
# Push schema changes without data loss
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Production Database
```bash
# ALWAYS use migrate deploy (never reset or force)
npx prisma migrate deploy

# View migration status
npx prisma migrate status
```

## Environment Setup

### Recommended: Separate Development Database

Create a `.env.local` file for local development:

```env
# Local development database
DATABASE_URL="postgresql://localhost:5432/rainesdev_dev"
DIRECT_URL="postgresql://localhost:5432/rainesdev_dev"
```

Keep `.env` for production:
```env
# Production database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

## Backup Strategy

### Supabase Backup Options

1. **Pro Plan**: Automatic daily backups
2. **Manual Export**:
   - Dashboard → Database → Backups
   - Click "Download backup"
3. **Script-based backups**:
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

## Recovery Procedures

### If Data is Lost

1. **Check Supabase Backups** (if on Pro plan)
2. **Check Netlify Environment** (may have cached data)
3. **Run seed script**:
   ```bash
   npx tsx prisma/seed.ts
   ```
4. **Manually recreate critical data**

## Commands to NEVER Run on Production

❌ `npx prisma db push --force-reset`
❌ `npx prisma migrate reset`
❌ `npx prisma db execute --file drop.sql`

## Before Running Any Schema Changes

1. ✅ Backup your database first
2. ✅ Test on local/staging environment
3. ✅ Review the migration SQL
4. ✅ Have a rollback plan
5. ✅ Use `migrate deploy` not `db push`

## Emergency Contacts

- Supabase Support: https://supabase.com/support
- Database Admin: [Your team contact]

---

**Last Updated**: January 13, 2026
**Created After**: Production database incident
