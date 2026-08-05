import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum 定義
export const memberRoleEnum = pgEnum('member_role', ['owner', 'member']);
export const clothesStatusEnum = pgEnum('clothes_status', [
  'in_use',
  'stored',
  'disposal_planned',
  'disposed',
]);
export const planTypeEnum = pgEnum('plan_type', ['fitting', 'chest', 'walk_in']);

// 1. ファミリー (families)
export const families = pgTable('families', {
  id: text('id').primaryKey(), // 例: "guest_xxx" または カスタムファミリーID
  isGuest: boolean('is_guest').default(false).notNull(),
  guestExpiresAt: timestamp('guest_expires_at'), // フィッティングプラン用（14日間）
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. メンバー (members)
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: text('family_id')
    .references(() => families.id, { onDelete: 'cascade' })
    .notNull(),
  memberId: text('member_id').notNull(), // 例: "dad", "taro"
  displayName: text('display_name').notNull(), // 表示名（例: "パパ"）
  authUserId: uuid('auth_user_id').unique(), // Supabase auth.users.id との紐付け（ゲストはnull）
  role: memberRoleEnum('role').default('member').notNull(), // 'owner': 代表者 / 'member': 一般メンバー
  preferredLanguage: text('preferred_language').default('ja').notNull(), // パターンB用 (ja, en, zh-CN)
  isFirstLogin: boolean('is_first_login').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. 洋服 (clothes)
export const clothes = pgTable('clothes', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: text('family_id')
    .references(() => families.id, { onDelete: 'cascade' })
    .notNull(),
  ownerMemberId: uuid('owner_member_id')
    .references(() => members.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category').notNull(), // 例: "コート", "トップス"
  color: text('color').notNull(), // 例: "ネイビー"
  size: text('size'), // 例: "110", "M"
  season: text('season'), // 例: "春", "秋冬", "通年"
  status: clothesStatusEnum('status').default('in_use').notNull(),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. サブスクリプション・プラン契約 (subscriptions)
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: text('family_id')
    .references(() => families.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  planType: planTypeEnum('plan_type').default('fitting').notNull(), // fitting / chest / walk_in
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: text('status').default('active').notNull(),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. ログイン失敗履歴 (login_attempts) — ブルートフォース対策（IP・アカウント単位の一時ロック用）
export const loginAttempts = pgTable('login_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(), // 例: "account:familyId:memberId" / "ip:1.2.3.4"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// リレーション定義
export const familiesRelations = relations(families, ({ many, one }) => ({
  members: many(members),
  clothes: many(clothes),
  subscription: one(subscriptions, {
    fields: [families.id],
    references: [subscriptions.familyId],
  }),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  family: one(families, {
    fields: [members.familyId],
    references: [families.id],
  }),
  clothes: many(clothes),
}));

export const clothesRelations = relations(clothes, ({ one }) => ({
  family: one(families, {
    fields: [clothes.familyId],
    references: [families.id],
  }),
  owner: one(members, {
    fields: [clothes.ownerMemberId],
    references: [members.id],
  }),
}));