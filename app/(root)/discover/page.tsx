"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const DiscoverPage = ({ searchParams: { search } } : { searchParams: { search: string } }) => {

    const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || "" });

    return ( 
        <div className="flex flex-col gap-9">
            <SearchBar />
            <div className="flex flex-col gap-9">
                <h1 className="text-[20px] font-bold text-white-1">
                    {!search? "جستجو" : "جستجو برای "}
                    {search && <span className="text-white-2">{search}</span>}
                </h1>
                {podcastsData ? (
                    <>
                        {podcastsData.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {
                              podcastsData?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
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
                        ) : <EmptyState title="نتیجه‌ای یافت نشد" />}
                    </>
                ) : <LoaderSpinner />}
            </div>
        </div>
     );
}
 
export default DiscoverPage;