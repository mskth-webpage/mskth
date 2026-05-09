import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Fetch tous les projets depuis la table "projects"
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
    const { projects } = await request.json();
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

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
    const { project } = await request.json();
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id)
      .select();

    if (error) {
      console.error("Supabase PUT Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project: data[0] }, { status: 200 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase DELETE Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
