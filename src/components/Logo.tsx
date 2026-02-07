"use client"

import { Link } from "@/i18n/navigation"
import Image from 'next/image'

function Logo() {
  return (
    <Link href="/" className="block">
      <Image
        src="/logga.png"
        width={230}
        height={210}
        alt="Mskth logo"
        priority
        className="w-20 h-auto sm:w-28"
      />
    </Link>
  )
}

export default Logo