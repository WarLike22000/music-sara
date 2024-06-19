"use client";

import { useAudio } from "@/providers/AudioProvider";
import { PodcastProps, ProfileCardProps } from "@/types";
import { useEffect, useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import Image from "next/image";
import { Button } from "./ui/button";

const ProfileCard = ({
    podcastData,
    imageUrl,
    userFirstName
} : ProfileCardProps) => {

    const { setAudio } = useAudio();

    const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);

    const playRandomPodcast = () => {
        const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);

        setRandomPodcast(podcastData.podcasts[randomIndex]);
    };

    useEffect(() => {
        if(randomPodcast) {
            setAudio({
                title: randomPodcast.podcastTitle,
                audioUrl: randomPodcast.audioUrl || "",
                imageUrl: randomPodcast.imageUrl || "",
                author: randomPodcast.author,
                podcastId: randomPodcast._id
            });
        }
    }, [randomPodcast, setAudio]);

    if(!imageUrl) return <LoaderSpinner />
    
    return ( 
        <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
            <Image
                src={imageUrl}
                alt="podcaster"
                width={250}
                height={250}
                className="aspect-square rounded-lg"
            />
            <div className="flex flex-col justify-center max-md:items-center">
                <div className="flex flex-col gap-2.5">
                    <figure className="flex gap-2 max-md:justify-center">
                        <Image
                            src="/icons/verified.svg"
                            alt="verified"
                            width={15}
                            height={15}
                        />
                        <h2 className="text-[14px] font-medium text-white-2">
                            تایید شده
                        </h2>
                    </figure>
                    <h1 className="text-[32px] font-extrabold text-white-1">
                        {userFirstName}
                    </h1>
                </div>
                <figure className="flex gap-3 py-6">
                    <Image
                        src="/icons/headphone.svg"
                        alt="headphone"
                        width={24}
                        height={24}
                    />
                    <h2 className="text-[16px] font-semibold text-white-1">
                        {podcastData.listeners} &nbsp;
                        <span className="font-normal text-white-2">
                            شنوندگان
                        </span>
                    </h2>
                </figure>
                {
                    podcastData.podcasts.length > 0 && (
                        <Button
                            onClick={playRandomPodcast}
                            className="text-[16px] bg-orange-1 font-extrabold text-white-1 flex gap-2"
                        >
                            <Image
                                src="/icons/play.svg"
                                alt="play"
                                width={20}
                                height={20}
                            />
                            پخش تصادفی
                        </Button>
                    )
                }
            </div>
        </div>
     );
}
 
export default ProfileCard;