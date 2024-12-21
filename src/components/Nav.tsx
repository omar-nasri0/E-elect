"use client"
import  Link  from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ReactNode } from "react"

export function Nav({children}:{children:ReactNode}) {
  return (
    <nav className="bg-primary text-primary-foreground 
                flex justify-center">
                    {children}
    </nav>
  )
}
export function NavLink(props:Omit <ComponentProps<typeof Link> ,"className">) {
    const path = usePathname()
    return(
        <Link {...props} 
        className={`p-4 
        hover:bg-secondary 
        hover:text-secondary-foreground  
        ${path===props.href? "bg-background text-foreground":""}`}/>
    )
}