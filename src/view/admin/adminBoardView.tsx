'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import BoardMemberCard from '@/components/TeamMemberCard';
import CreateBoardMemberModal from '@/components/admin/boardmember/CreateBoardMemberModal';

import type {
  AdminBoardMember,
  BoardMemberModalInput,
} from '@/types/adminBoardMembers';

type Props = {
  boardMembers: AdminBoardMember[];
  memberCount: number;
  isLoading: boolean;
  isPublishing: boolean;
  hasDraft: boolean;
  onCreate: (input: BoardMemberModalInput) => void;
  onEdit: (
    id: AdminBoardMember["id"],
    input: BoardMemberModalInput
  ) => void;
  onDelete: (id: AdminBoardMember["id"]) => void;
  onCancelChanges: () => void;
  onPublish: () => void;
};

export default function AdminBoardView({
  boardMembers,
  memberCount,
  isLoading,
  isPublishing,
  hasDraft,
  onCreate,
  onEdit,
  onDelete,
  onCancelChanges,
  onPublish,
}: Props) {
  const t = useTranslations('AdminBoardMembersView');

  const [isCreating, setIsCreating] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminBoardMember | null>(null);

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Add new button */}

        <Button onClick={() => setIsCreating(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          {t('addNew')}
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
          ) : boardMembers.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border text-center text-sm text-muted-foreground">
              {t('empty')}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"> 
              {boardMembers.map((member) => (
                <BoardMemberCard
                  key={member.id}
                  name={member.name}
                  role_eng={member.role_eng}
                  role_sv={member.role_sv}
                  email={member.email}
                  imageUrl={member.image_url ?? undefined}
                  story_eng={member.story_eng ?? undefined}
                  story_sv={member.story_sv ?? undefined}
                  isAdmin={true}
                  onEdit={() => setEditingMember(member)}
                  onDelete={() => onDelete(member.id)}
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
            {t('cancel')}
          </Button>

          <Button
            type="button"
            variant={hasDraft ? 'default' : 'secondary'}
            disabled={!hasDraft || isPublishing}
            onClick={onPublish}
          >
            {isPublishing ? t('publishing') : t('publish')}
          </Button>
        </div>
      </section>

      {/* Creating new member */}

      {isCreating && ( <CreateBoardMemberModal
        memberCount={memberCount}
        onSave={(values) => {
          onCreate(values);
          setIsCreating(false); }}
        onCancel={() => setIsCreating(false)}/>
        )}

      {/* Editing existing member */}

      {editingMember && (<CreateBoardMemberModal
        initialValues={editingMember}
        memberCount={memberCount}
        onSave={(values) => {
          onEdit(editingMember.id,values);
          setEditingMember(null); }}
        onCancel={() => setEditingMember(null)}/>
        )}

    </div>
  );
}