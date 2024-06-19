"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const RightSidebar = () => {

    const { user } = useUser();
    const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
    const router = useRouter();
    
    if(!topPodcasters) return
    
    return ( 
        <section className="sticky left-0 top-0 flex w-[310px] flex-col overflow-y-auto border-none bg-black-1 px-[30px] pt-8 max-xl:hidden text-white-1 ">
            <SignedIn>
                <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
                    <UserButton />
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-[16px] truncate font-semibold text-white-1">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <Image
                            src="/icons/right-arrow.svg"
                            alt="arrow"
                            width={24}
                            height={24}
                            className="transform rotate-180"
                        />
                    </div>
                </Link>
                
            </SignedIn>

            <section className="flex flex-col gap-5">
                <Header headerTitle="پیشنهادی" />
                <Carousel fansLikeDetail={topPodcasters!} />
            </section>

            <section className="flex flex-col gap-8 pt-12">
                <Header headerTitle="برترین های پادکستر" />
                <div className="flex flex-col gap-6">
                    {topPodcasters?.slice(0, 4).map((podcaster) => (
                        <div key={podcaster._id} className="flex cursor-pointer justify-between" onClick={() => router.push(`/profile/${podcaster.clerkId}`)}>
                            <figure className="flex items-center gap-2">
                                <Image
                                    src={podcaster.imageUrl}
                                    alt={podcaster.name}
                                    width={44}
                                    height={44}
                                    className="aspect-square rounded-lg"
                                />
                                <h2 className="text-[14px] font-semibold text-white-1">
                                    {podcaster.name}
                                </h2>
                            </figure>
                            <div className="flex items-center">
                                <p className="text-[12px] font-normal">
                                    {podcaster.totalPodcasts} موزیک
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
     );
}
 
export default RightSidebar;