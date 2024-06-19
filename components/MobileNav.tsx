"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {

    const pathname = usePathname()
    
    return ( 
        <section>
            <Sheet>
                <SheetTrigger>
                    <Image
                        src="/icons/hamburger.svg"
                        alt="hamburger"
                        width={30}
                        height={30}
                        className="cursor-pointer"
                    />
                </SheetTrigger>

                <SheetContent className="border-none bg-black-1 p-0 py-8">
                    <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 pr-4">
                        <Image src="/icons/logo.svg" alt="logo" width={23} height={27}/>
                        <h1 className="text-[24px] font-extrabold text-white-1 mr-1">
                            پادکستر
                        </h1>
                    </Link>

                    <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                        <SheetClose asChild>
                            <nav className="flex flex-col text-white-1 h-full gap-6">
                                {
                                    sidebarLinks.map(({ route, label, imgURL }) => {
                                        const isActive = pathname === route || pathname.startsWith(`${route}/`)
                                        
                                        return (
                                            <SheetClose asChild key={label}>
                                                <Link href={route} className={cn(
                                                    "flex gap-3 items-center py-4 max-lg:px-4 justify-start",
                                                    {
                                                        'border-l-4 border-orange-1 bg-nav-focus': isActive
                                                    }
                                                )}>
                                                    <Image src={imgURL} alt={label} width={24} height={24}/>
                                                    <p>
                                                        {label}
                                                    </p>
                                                </Link>
                                            </SheetClose>
                                        )
                                    })
                                }
                            </nav>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
     );
}
 
export default MobileNav;