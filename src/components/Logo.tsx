"use client"

import { Link } from "@/i18n/navigation"
import Image from 'next/image'

function Logo() {
  return (    
    <Link href="/">
    <Image
        src="/logo.png"
        width={333}
        height={357}
        alt="Mskth logo"
        priority
        />
    </Link>
  )
}

export default Logo
