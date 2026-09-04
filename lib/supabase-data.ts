import { supabaseAdmin } from "@/lib/supabase";

export const editableCollections = ["services", "projects", "technologies", "process", "leads", "inquiries", "clients", "settings", "aiConversations"] as const;
export type EditableCollection = typeof editableCollections[number];
export function isEditableCollection(value: string): value is EditableCollection { return editableCollections.includes(value as EditableCollection); }

type Row = { id: string; data: Record<string, unknown> | null; sort_order: number | null; status: string | null; visible: boolean | null; created_at?: string; updated_at?: string };
export type CmsDocument = Record<string, unknown> & { _id: string; order: number; status: string; visible: boolean; createdAt?: string; updatedAt?: string };
function item(row: Row): CmsDocument { return { _id: row.id, ...(row.data || {}), order: row.sort_order ?? 999, status: row.status ?? "published", visible: row.visible !== false, createdAt: row.created_at, updatedAt: row.updated_at }; }

export async function listDocuments(collection: string) {
  const { data, error } = await supabaseAdmin().from("cms_documents").select("*").eq("collection", collection).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(item);
}

export async function createDocument(collection: string, payload: Record<string, unknown>) {
  const { order = 999, status = "published", visible = true, ...data } = payload;
  const response = await supabaseAdmin().from("cms_documents").insert({ collection, data, sort_order: Number(order), status, visible }).select("*").single();
  if (response.error) throw response.error;
  return item(response.data as Row);
}

export async function updateDocument(collection: string, id: string, payload: Record<string, unknown>) {
  const { order = 999, status = "published", visible = true, ...data } = payload;
  const response = await supabaseAdmin().from("cms_documents").update({ data, sort_order: Number(order), status, visible, updated_at: new Date().toISOString() }).eq("collection", collection).eq("id", id).select("*").single();
  if (response.error) throw response.error;
  return item(response.data as Row);
}

export async function deleteDocument(collection: string, id: string) {
  const { error } = await supabaseAdmin().from("cms_documents").delete().eq("collection", collection).eq("id", id);
  if (error) throw error;
}

export async function deleteDocuments(collection: string, ids: string[]) {
  if (!ids || ids.length === 0) return;
  const { error } = await supabaseAdmin().from("cms_documents").delete().eq("collection", collection).in("id", ids);
  if (error) throw error;
}

export async function logActivity(adminId: string, action: string, entity: string, entityId?: string) {
  const { error } = await supabaseAdmin().from("activity_logs").insert({ admin_id: adminId, action, entity, entity_id: entityId ?? null });
  if (error) throw error;
}
