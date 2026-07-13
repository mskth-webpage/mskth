/**
 * Logic for getting boardmembers from Supabase and pushing changes, 
 * including removing members, adding new and updating old. 
 */

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { AdminBoardMember } from "@/types/adminBoardMembers";

/* Fetch board members from DB */
export async function GET() {
  const supabase = await createClient(await cookies());
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("User:", user);
  
  const { data, error } = await supabase
    .from("board_members")
    .select("id, name, role, email, image_url, display_order")
    .order("display_order", { ascending: true });

  console.log("Data:", data); // ta bort
  console.log("Error:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as AdminBoardMember[]);
}

/* Publishing changes to DB */
export async function PUT(request: Request) {
  const supabase = await createClient(await cookies());

  const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  console.log("User:", user);

  const body = await request.json();
  const members = body.members as AdminBoardMember[];

  // Existing members
  const { data: existingMembers, error: fetchError } = await supabase
    .from("board_members")
    .select("id");

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const existingIds = new Set(
    existingMembers.map((member) => member.id as number)
  );

  // IDs in draft/localstorage. If some are missing, they have been deleted and should be removed from DB.
  const idsInLocalStorage = new Set(
    members
      .filter((member) => typeof member.id === "number")
      .map((member) => member.id as number)
  );

  const idsToDelete = [...existingIds].filter((id) => !idsInLocalStorage.has(id));
  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("board_members")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  // Update members data from localstorage
  const existingDraftMembers = members.filter(
    (member) => typeof member.id === "number" 
  );

  if (existingDraftMembers.length > 0) {
    for (const member of existingDraftMembers) {
      const { error } = await supabase
        .from("board_members")
        .update({  
          name: member.name,
          role: member.role,
          email: member.email,
          image_url: member.image_url,
          display_order: member.display_order,
        })
        .eq("id", member.id);        
        
        if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  // Add new members
  const newDraftMembers = members.filter(
    (member) => typeof member.id !== "number" // New IDs with temp-{string}
  );

  if (newDraftMembers.length > 0) {
    const { error: insertError } = await supabase
      .from("board_members")
      .insert(
        newDraftMembers.map((member) => ({ // supabase automatically assigns IDs
          name: member.name,
          role: member.role,
          email: member.email,
          image_url: member.image_url,
          display_order: member.display_order,
        }))
      );

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  revalidatePath("/boardmembers");
  revalidatePath("/admin/boardmembers");

  return NextResponse.json({ success: true });
}