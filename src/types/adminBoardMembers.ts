export type PublicBoardMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  image_url: string | null;
};

export type AdminBoardMember = {
  id: number | `temp-${string}`;
  name: string;
  role: string;
  email: string;
  image_url: string | null;
  display_order: number;
};

export type BoardMemberModalInput = {
  name: string;
  role: string;
  email: string;
  image_url: string | null;
  display_order: number;
};
