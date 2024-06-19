"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";

const SearchBar = () => {

    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    const debouncedValue = useDebounce(search, 500);
    
    useEffect(() => {
        if(debouncedValue) {
            router.push(`/discover?search=${debouncedValue}`)
        } else if(!debouncedValue && pathname === '/discover') {
            router.push("/discover");
        };
    }, [router, pathname, debouncedValue]);
    
    return ( 
        <div className="relative mt-8 block">
            <Input
                className="text-[16px] placeholder:text-[16px] bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1 focus-visible:ring-offset-orange-1 py-6 pr-12"
                placeholder="جستحو"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch("")}
            />
            <Image
                src="/icons/search.svg"
                alt="search"
                width={20}
                height={20}
                className="absolute right-4 top-3.5"
            />
        </div>
     );
}
 
export default SearchBar;