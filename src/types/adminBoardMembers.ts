export type AdminBoardMember = {
  id: number | `temp-${string}`;
  name: string;
  role: string;
  email: string;
  image_url: string | null;
  display_order: number;
};

export type BoardMemberFormInput = {
  name: string;
  role: string;
  email: string;
  image_url: string | null;
  display_order: number;
};
