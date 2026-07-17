import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { AdminProjectGroup } from "@/types/projectGroups";

export async function GET() {
  const supabase = await createClient(await cookies());
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("project_groups")
    .select("id, name, description, contact_email, image_url, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as AdminProjectGroup[]);
}

export async function PUT(request: Request) {
  const supabase = await createClient(await cookies());

  const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const body = await request.json();
  const groups = body.projectGroups as AdminProjectGroup[];

  // Existing groups
  const { data: existingGroups, error: fetchError } = await supabase
    .from("project_groups")
    .select("id");

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const existingIds = new Set(
    existingGroups.map((g) => g.id as number)
  );

  const idsInLocalStorage = new Set(
    groups
      .filter((g) => typeof g.id === "number")
      .map((g) => g.id as number)
  );

  const idsToDelete = [...existingIds].filter((id) => !idsInLocalStorage.has(id));
  if (idsToDelete.length > 0) {
    const { data: groupsToDelete, error: imageFetchError } = await supabase
      .from("project_groups")
      .select("image_url")
      .in("id", idsToDelete);
    
    if (imageFetchError) {
      return NextResponse.json({ error: imageFetchError.message }, { status: 500 });
    }

    const paths = groupsToDelete
      .map((g) => {
        if (!g.image_url) return null;
        return g.image_url.split("/images/")[1];
      })
      .filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage
        .from("images")
        .remove(paths);
    }

    const { error: deleteError } = await supabase
      .from("project_groups")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  // Update existing
  const existingDraftGroups = groups.filter(
    (g) => typeof g.id === "number" 
  );

  if (existingDraftGroups.length > 0) {
    for (const g of existingDraftGroups) {
      const { error } = await supabase
        .from("project_groups")
        .update({  
          name: g.name,
          description: g.description,
          contact_email: g.contact_email,
          image_url: g.image_url,
          display_order: g.display_order,
        })
        .eq("id", g.id);        
        
        if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  // Add new
  const newDraftGroups = groups.filter(
    (g) => typeof g.id !== "number" 
  );

  if (newDraftGroups.length > 0) {
    const { error: insertError } = await supabase
      .from("project_groups")
      .insert(
        newDraftGroups.map((g) => ({
          name: g.name,
          description: g.description,
          contact_email: g.contact_email,
          image_url: g.image_url,
          display_order: g.display_order,
        }))
      );

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  revalidatePath("/admin/boardmember");
  revalidatePath("/admin/project");

  return NextResponse.json({ success: true });
}
