"use server";

import { db, systemLogs } from "@repo/database";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "./auth";
import { DEFAULT_PAGE_SIZE, type PageSize } from "../_lib/pagination";

export type SystemLogType = "notification" | "incident";
export type SystemLogSeverity = "info" | "warning" | "critical";

export type SystemLogItem = {
  id: string;
  type: SystemLogType;
  severity: SystemLogSeverity;
  title: string;
  body: string | null;
  createdAt: string;
};

export type SystemLogPage = {
  items: SystemLogItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

// 通知・障害ログ一覧を取得する
export async function getSystemLogs(page = 1, pageSize: PageSize = DEFAULT_PAGE_SIZE): Promise<SystemLogPage> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const allLogs = await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt));

  const totalCount = allLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: allLogs.slice(start, start + pageSize).map((log) => ({
      id: log.id,
      type: log.type,
      severity: log.severity,
      title: log.title,
      body: log.body,
      createdAt: log.createdAt.toISOString(),
    })),
    totalCount,
    page: safePage,
    pageSize,
  };
}

export type CreateSystemLogResult = { success: true } | { success: false; error: string };

// 通知・障害ログを新規登録する
export async function createSystemLog(input: {
  type: SystemLogType;
  severity: SystemLogSeverity;
  title: string;
  body: string;
}): Promise<CreateSystemLogResult> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const title = input.title.trim();
  if (!title) {
    return { success: false, error: "タイトルを入力してください。" };
  }

  await db.insert(systemLogs).values({
    type: input.type,
    severity: input.severity,
    title,
    body: input.body.trim() || null,
  });

  revalidatePath("/logs");
  return { success: true };
}

export type DeleteSystemLogResult = { success: true } | { success: false; error: string };

// 通知・障害ログを削除する
export async function deleteSystemLog(id: string): Promise<DeleteSystemLogResult> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  await db.delete(systemLogs).where(eq(systemLogs.id, id));

  revalidatePath("/logs");
  return { success: true };
}
