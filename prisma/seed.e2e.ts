/**
 * Seeds the database with one user per role for Playwright E2E tests.
 *
 *   pnpm tsx prisma/seed.e2e.ts
 *
 * Idempotent: re-running upserts the same fixture users. Better-auth will hash
 * passwords on first sign-in via the UI (see e2e/setup/auth.seed.ts).
 *
 * Production / dev databases are NOT auto-touched: this honors
 * `E2E_DATABASE_URL`, falling back to `DATABASE_URL` only if explicitly set in
 * the test environment.
 */
import prisma from "../lib/prisma";
import { E2E_USERS } from "../e2e/fixtures/e2e-users";

async function upsertUsers(): Promise<void> {
  for (const u of E2E_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, banned: false },
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        emailVerified: true,
      },
    });
    console.log(`  ✓ upserted ${u.role}: ${u.email}`);
  }
}

async function main(): Promise<void> {
  console.log("Seeding E2E users…");
  await upsertUsers();
  console.log(`Done. ${E2E_USERS.length} fixture users ready.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
