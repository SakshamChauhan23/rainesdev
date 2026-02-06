-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED', 'LEGACY_GRACE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AdminAction" ADD VALUE 'GRANT_SUBSCRIPTION';
ALTER TYPE "AdminAction" ADD VALUE 'REVOKE_SUBSCRIPTION';
ALTER TYPE "AdminAction" ADD VALUE 'EXTEND_GRACE_PERIOD';

-- DropForeignKey
ALTER TABLE "setup_requests" DROP CONSTRAINT "setup_requests_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "setup_requests" DROP CONSTRAINT "setup_requests_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "setup_requests" DROP CONSTRAINT "setup_requests_purchase_id_fkey";

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "assisted_setup_enabled",
DROP COLUMN "assisted_setup_price",
DROP COLUMN "book_call_enabled";

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "assisted_setup_requested";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripe_customer_id" TEXT;

-- DropTable
DROP TABLE "setup_requests";

-- DropEnum
DROP TYPE "CallStatus";

-- DropEnum
DROP TYPE "SetupComplexity";

-- DropEnum
DROP TYPE "SetupStatus";

-- DropEnum
DROP TYPE "SetupType";

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "canceled_at" TIMESTAMP(3),
    "grace_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions"("current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
