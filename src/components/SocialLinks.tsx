"use client";

import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaDiscord,
} from "react-icons/fa";
import Link from "next/link";

type Props = {
  showTitle?: boolean;
};

/**
 * SocialLinks component that renders a list of social media links with icons.
 */
export default function SocialLinks({ showTitle = true }: Props) {

  const socials = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/muslimstudentskth/",
      icon: FaInstagram,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/",
      icon: FaTiktok,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/muslimstudentskth/",
      icon: FaFacebook,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/mskth/posts/?feedView=all",
      icon: FaLinkedin,
    },
    {
      name: "Discord",
      href: "https://discord.com/invite/apuDUjDytr",
      icon: FaDiscord,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {socials.map(({ name, href, icon: Icon }) => (
        <Link
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="
            inline-flex items-center justify-center
            text-blue-brand
            hover:opacity-70 
            transition
          "
        >
          <Icon className="w-7 h-7" />
        </Link>
      ))}
    </div>
  );
}
