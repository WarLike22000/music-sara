"use client"

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";

const PodcastDetails = ({ params: { podcastId } } : { params: { podcastId: Id<'podcasts'> } }) => {

    const { user } = useUser();
    
    const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });

    const similarPodcast = useQuery(api.podcasts.getPodcastsByCategory, { podcastId });

    const isOwner = user?.id === podcast?.authorId;

    if(!similarPodcast || !podcast) return <LoaderSpinner />
    
    return ( 
        <section className="flex w-full flex-col">
            <header className="mt-9 flex items-center justify-between">
                <h1 className="text-[20px] font-bold text-white-1">
                    آهنگ درحال بخش
                </h1>
                <figure className="flex gap-3">
                    <Image
                        src="/icons/headphone.svg"
                        alt="headphone"
                        width={24}
                        height={24}
                    />
                    <h2 className="text-[16px] font-bold text-white-1">
                        {podcast?.views}
                    </h2>
                </figure>
            </header>

            <PodcastDetailPlayer
                isOwner={isOwner}
                podcastId={podcast._id}
                {...podcast}
            />

            <p className="text-white-2 text-[16px] pb-8 pt-[45px] font-medium max-md:text-center">
                {podcast?.podcastDescription}
            </p>

            <section className="mt-8 flex flex-col gap-5">
                <h1 className="text-[20px] font-bold text-white-1">
                    پادسکت های مشابه
                </h1>

                {similarPodcast && similarPodcast.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {
                      similarPodcast?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                        <PodcastCard
                          key={_id}
                          imgUrl={imageUrl!}
                          title={podcastTitle}
                          description={podcastDescription}
                          podcastId={_id}
                        />
                      ))
                    }
                  </div>
                ) : (
                    <>
                        <EmptyState
                            title="پادکست مشابه یافت نشد"
                            buttonLink="/discover"
                            buttonText="جستجو‌ی بیشتر"
                        />
                    </>
                )}
            </section>
        </section>
     );
}
 
export default PodcastDetails;