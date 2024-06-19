"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const ProfilePage = ({ params: { profileId } } : { params: { profileId: string } }) => {

    const user = useQuery(api.users.getUserById, {
        clerkId: profileId
    });

    const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
        authorId: profileId
    });

    if(!user || !podcastsData) return <LoaderSpinner />
    
    return ( 
        <section className="mt-9 flex flex-col">
            <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
                <ProfileCard
                    podcastData={podcastsData}
                    imageUrl={user.imageUrl}
                    userFirstName={user.name}
                />
            </div>
            <section className="mt-9 flex flex-col gap-5">
                <h1 className="text-[20px] font-bold text-white-1">
                    همه پادکست ها
                </h1>
                {
                    podcastsData && podcastsData.podcasts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {podcastsData.podcasts.map((podcast) => (
                                <PodcastCard
                                    key={podcast._id}
                                    imgUrl={podcast.imageUrl!}
                                    title={podcast.podcastTitle}
                                    description={podcast.podcastDescription}
                                    podcastId={podcast._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="آهنگی وجود ندارد"
                        />
                    )
                }
            </section>
        </section>
     );
}
 
export default ProfilePage;