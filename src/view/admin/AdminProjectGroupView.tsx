"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import ProjectGroupCard from '@/components/admin/projectgroup/ProjectGroupCard';
import CreateProjectGroupModal from '@/components/admin/projectgroup/CreateProjectGroupModal';

import type {
  AdminProjectGroup,
  ProjectGroupModalInput,
} from '@/types/projectGroups';

type Props = {
  projectGroups: AdminProjectGroup[];
  groupCount: number;
  isLoading: boolean;
  isPublishing: boolean;
  hasDraft: boolean;
  onCreate: (input: ProjectGroupModalInput) => void;
  onEdit: (
    id: AdminProjectGroup["id"],
    input: ProjectGroupModalInput
  ) => void;
  onDelete: (id: AdminProjectGroup["id"]) => void;
  onCancelChanges: () => void;
  onPublish: () => void;
};

export default function AdminProjectGroupView({
  projectGroups,
  groupCount,
  isLoading,
  isPublishing,
  hasDraft,
  onCreate,
  onEdit,
  onDelete,
  onCancelChanges,
  onPublish,
}: Props) {
  const t = useTranslations('AdminProjectGroupView');

  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AdminProjectGroup | null>(null);

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('title') || "Project Groups"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('description') || "Manage project groups available for projects."}
          </p>
        </div>

        {/* Add new button */}

        <Button onClick={() => setIsCreating(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          {t('addNew') || "Add new"}
        </Button>
      </div>

      {/* Grid */}

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="bg-muted/30 p-4 sm:p-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"> 
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-xl bg-muted"/>
              ))}
            </div>
          ) : projectGroups.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border text-center text-sm text-muted-foreground">
              {t('empty') || "No project groups found."}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"> 
              {projectGroups.map((group) => (
                <ProjectGroupCard
                  key={group.id}
                  name={group.name}
                  description={group.description}
                  contact_email={group.contact_email}
                  imageUrl={group.image_url ?? undefined}
                  isAdmin={true}
                  onEdit={() => setEditingGroup(group)}
                  onDelete={() => onDelete(group.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"             
            className={hasDraft ? "hover:bg-destructive/10 hover:text-destructive" : "text-muted-foreground"}
            disabled={!hasDraft}
            onClick={onCancelChanges}
          >
            {t('cancel') || "Cancel"}
          </Button>

          <Button
            type="button"
            variant={hasDraft ? 'default' : 'secondary'}
            disabled={!hasDraft || isPublishing}
            onClick={onPublish}
          >
            {isPublishing ? (t('publishing') || "Publishing...") : (t('publish') || "Publish Changes")}
          </Button>
        </div>
      </section>

      {/* Creating new group */}

      {isCreating && ( <CreateProjectGroupModal
        memberCount={groupCount}
        onSave={(values) => {
          onCreate(values);
          setIsCreating(false); }}
        onCancel={() => setIsCreating(false)}/>
        )}

      {/* Editing existing group */}

      {editingGroup && (<CreateProjectGroupModal
        initialValues={editingGroup}
        memberCount={groupCount}
        onSave={(values) => {
          onEdit(editingGroup.id,values);
          setEditingGroup(null); }}
        onCancel={() => setEditingGroup(null)}/>
        )}

    </div>
  );
}
