export type PublicBoardMember = {
  id: number;
  name: string;
  role_eng: string;
  role_sv: string;
  email: string;
  image_url: string | null;
  story_eng: string | null;
  story_sv: string | null;
};

export type AdminBoardMember = {
  id: number | `temp-${string}`;
  name: string;
  role_eng: string;
  role_sv: string;
  email: string;
  image_url: string | null;
  display_order: number;
  story_eng: string | null;
  story_sv: string | null;
};

export type BoardMemberModalInput = {
  name: string;
  role_eng: string;
  role_sv: string;
  email: string;
  image_url: string | null;
  display_order: number;
  story_eng: string | null;
  story_sv: string | null;
};
