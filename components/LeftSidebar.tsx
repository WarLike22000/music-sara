'use client';

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const LeftSidebar = () => {

    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    
    return ( 
        <section className="sticky right-0 top-0 flex w-fit flex-col justify-between  border-none  bg-black-1 pt-8 text-white-1 max-md:hidden lg:w-[270px] lg:pr-8">
            <nav className="flex flex-col gap-6">
                <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
                    <Image src="/icons/logo.svg" alt="logo" width={23} height={27}/>
                    <h1 className="text-24 font-extrabold text-white max-lg:hidden">
                        پادکستر
                    </h1>
                </Link>

                {
                    sidebarLinks.map(({ route, label, imgURL }) => {
                        const isActive = pathname === route || pathname.startsWith(`${route}/`)
                        
                        return (
                            <Link href={route} key={label} className={cn(
                                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                                {
                                    'border-l-4 border-orange-1 bg-nav-focus': isActive
                                }
                            )}>
                                <Image src={imgURL} alt={label} width={24} height={24}/>
                                <p>
                                    {label}
                                </p>
                            </Link>
                        )
                    })
                }
            </nav>

            <SignedOut>
                <div className="flex items-center justify-center w-full pb-14 max-lg:px-4 lg:pl-8">
                    <Button asChild className="text-[16px] bg-orange-1 w-full font-extrabold">
                        <Link href="/sign-in">ورود</Link>
                    </Button>
                </div>
            </SignedOut>
            <SignedIn>
                <div className="flex items-center justify-center w-full pb-14 max-lg:px-4 lg:pl-8">
                    <Button className="text-[16px] bg-orange-1 w-full font-extrabold" onClick={() => signOut(() => router.push("/"))}>
                        خروج
                    </Button>
                </div>
            </SignedIn>
        </section>
     );
}
 
export default LeftSidebar;