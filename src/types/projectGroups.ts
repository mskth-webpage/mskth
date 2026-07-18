export type PublicProjectGroup = {
  id: number;
  name: string;
  description: string | null;
  contact_email: string | null;
  image_url: string | null;
};

export type AdminProjectGroup = {
  id: number | `temp-${string}`;
  name: string;
  description: string | null;
  contact_email: string | null;
  image_url: string | null;
  display_order: number;
};

export type ProjectGroupModalInput = {
  name: string;
  description: string | null;
  contact_email: string | null;
  image_url: string | null;
  display_order: number;
};
