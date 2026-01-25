"use client"

import { Link } from "@/i18n/navigation"
import Image from 'next/image'

function Logo() {
  return (    
    <Link href="/">
    <Image
        src="/logga.png"
        width={206}
        height={193}
        alt="Mskth logo"
        priority
        />
    </Link>
  )
}

export default Logo
