"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  projects as localProjects,
  sectionIds,
  type Project,
} from "@/config/portfolio";
import { getPublicProjects } from "@/lib/projects-service";
import { ProjectCard } from "@/components/project-card";
import { Reveal, SectionHeading, StaggerGroup, StaggerItem, TiltCard } from "@/components/motion-primitives";

/** The projects band on the home page. */
export function FeaturedWork() {
  const [projectsList, setProjectsList] = useState<Project[]>([...localProjects]);

  useEffect(() => {
    let mounted = true;
    getPublicProjects()
      .then((items) => {
        if (!mounted || items.length === 0) return;
        setProjectsList(items);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id={sectionIds.work} className="border-b border-[var(--color-line)]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Things I built and shipped"
            lede="A few I can talk about properly. Each one has a case study with the part that was actually hard."
          />
          <Reveal delay={0.14}>
            <Link href="/projects" className="btn-ghost">
              All projects <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        {projectsList.length === 0 ? (
          <p className="mt-10 border border-dashed border-[var(--color-line)] px-5 py-12 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)]">
            No projects yet — add them in src/config/portfolio.ts
          </p>
        ) : (
          <StaggerGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
            {projectsList.map((project) => (
              <StaggerItem key={project.slug}>
                <TiltCard max={2.5} className="h-full">
                  <ProjectCard project={project} size="md" />
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
