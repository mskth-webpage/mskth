import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Fetch all projects from the "projects" table
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projects } = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .insert(projects)
      .select();

    if (error) {
      console.error("Supabase POST Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data }, { status: 201 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project } = await request.json();

    // 1. Fetch the original project to see if the image changed
    const { data: originalProject } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', project.id)
      .single();

    // 2. Update the project
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id)
      .select();

    if (error) {
      console.error("Supabase PUT Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Clean up the old image from storage if it was changed
    if (
      originalProject && 
      originalProject.image_url && 
      originalProject.image_url !== project.image_url && 
      !originalProject.image_url.includes("MSkth.png")
    ) {
      const urlParts = originalProject.image_url.split('/public/images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([filePath]);
          
        if (storageError) {
          console.error("Failed to delete old image from storage:", storageError.message);
        }
      }
    }

    return NextResponse.json({ project: data[0] }, { status: 200 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    // 1. Fetch the project first to get the image_url BEFORE deleting it
    const { data: projectToDel } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', id)
      .single();

    // 2. Delete the project from the database using the authenticated user client
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase DELETE Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Delete the image from the storage bucket, ONLY IF it's not the default MSkth.png
    if (projectToDel?.image_url && !projectToDel.image_url.includes("MSkth.png")) {
      const urlParts = projectToDel.image_url.split('/public/images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        
        // Use the standard authenticated client to delete the image
        // (This works now because we correctly configured RLS for 'authenticated' users)
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([filePath]);
          
        if (storageError) {
          console.error("Failed to delete image from storage:", storageError.message);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
