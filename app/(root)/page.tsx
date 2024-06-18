"use client"

import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {

  const trendingPodcast = useQuery(api.podcasts.getTrendingPodcast);
  
  return ( 
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-[25px] font-bold text-white-1">
          پادسکت های محبوب
        </h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {
            trendingPodcast?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
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
      </section>
    </div>
   );
}
 
export default Home;