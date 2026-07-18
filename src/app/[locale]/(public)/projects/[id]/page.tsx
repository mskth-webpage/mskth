import { notFound } from "next/navigation";
import Image from "next/image";
import { Users, ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";

const MSKTH_LOGO = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/images/MSkth.png`;

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

async function getProject(id: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, content, group_label, status, image_url")
    .eq("id", id)
    .single();

  if (error || !data || data.status !== "published") {
    return null;
  }
  
  return data;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);
  
  if (!project) {
    return { title: "Project Not Found | MSKTH" };
  }
  
  return {
    title: `${project.title} | MSKTH`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);
  const t = await getTranslations("AdminProjects.project");

  if (!project) {
    notFound();
  }

  const isDefault = !project.image_url || project.image_url.includes("MSkth.png");
  const hasImage = !isDefault;

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero Banner ── */}
      <section className="relative bg-blue-brand text-white pt-16 pb-32 overflow-hidden">
        {/* Decorative lantern images — same as OurStorySection */}
        <Image
          src="/lightone.svg"
          alt=""
          aria-hidden
          width={120}
          height={120}
          className="absolute left-10 top-10 opacity-60 hidden md:block"
        />
        <Image
          src="/lightone.svg"
          alt=""
          aria-hidden
          width={100}
          height={100}
          className="absolute right-14 bottom-28 opacity-60 hidden md:block"
        />

        {/* Back link */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 mb-10">
          <Link
            href={`/${resolvedParams.locale}/aboutus`}
            className="inline-flex items-center gap-2 font-serif text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to About Us
          </Link>
        </div>

        {/* Title + meta */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Users className="h-3 w-3" />
            {project.group_label}
          </span>

          <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl leading-tight">
            {project.title.toUpperCase()}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-serif text-base leading-relaxed text-white/75 sm:text-lg">
            {project.description}
          </p>
        </div>

        {/* Wave bottom — same as OurStorySection */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="block h-[100px] w-full"
          >
            <path
              className="fill-background"
              d="M0,160 
                 C240,220 480,260 720,240 
                 C960,220 1200,140 1440,180 
                 L1440,320 L0,320 Z"
            />
          </svg>
        </div>
      </section>

      {/* ── Article Body ── */}
      <div className="mx-auto max-w-3xl px-6 pt-8 relative z-10 pb-24">

        {/* Project image (if one exists) */}
        {hasImage && (
          <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
            <div className="relative aspect-[16/9] w-full bg-muted">
              <Image
                src={project.image_url!}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        {project.content && (
          <article className="font-serif text-base leading-[1.9] text-foreground/85 sm:text-lg whitespace-pre-wrap">
            {project.content}
          </article>
        )}

        {/* Footer divider */}
        <div className="mt-16 border-t border-border/50 pt-8 flex justify-center">
          <Link
            href={`/${resolvedParams.locale}/aboutus`}
            className="font-serif text-sm text-muted-foreground transition-colors hover:text-foreground inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to About Us
          </Link>
        </div>
      </div>
    </main>
  );
}

