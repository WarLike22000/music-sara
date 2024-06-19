"use client";

import { PodcastDetailPlayerProps } from "@/types";
import LoaderSpinner from "./LoaderSpinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "./ui/use-toast";
import { useAudio } from "@/providers/AudioProvider";

const PodcastDetailPlayer = ({
    audioUrl,
    podcastTitle,
    author,
    imageUrl,
    podcastId,
    imageStorageId,
    audioStorageId,
    isOwner,
    authorImageUrl,
    authorId,
    category,
} : PodcastDetailPlayerProps) => {

    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { setAudio } = useAudio();

    const deletePodcast = useMutation(api.podcasts.deletePodcast);

    const handlePlay = () => {
        setAudio({
            title: podcastTitle,
            audioUrl,
            imageUrl,
            author,
            podcastId,
        });
    };
    
    const handleDelete = async () => {
        try {
            await deletePodcast({ podcastId, imageStorageId: imageStorageId!, audioStorageId: audioStorageId! });
            toast({
                title: "موسیقی حذف شد"
            });
            router.push("/");
        } catch (error) {
            console.log("Error Deleting Podcast", error);
            toast({
                title: "مشکلی پیش آمده",
                variant: "destructive"
            });
        }
    };
    
    if(!imageUrl || !authorImageUrl) return <LoaderSpinner />;
    
    return ( 
        <div className="mt-6 flex w-full justify-between max-md:justify-center">
            <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
                <Image
                    src={imageUrl}
                    alt="podcastImage"
                    width={250}
                    height={250}
                    className="aspect-square rounded-lg"
                />
                <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
                    <article className="flex flex-col gap-2 max-md:items-center">
                        <h1 className="text-[23px] font-extrabold tracking-[-0.32px] text-white-1">
                            {podcastTitle}
                        </h1>
                        <h2 className="text-[14px] text-white-2">
                            {category}
                        </h2>
                        <figure
                            className="cursor-pointer flex items-center gap-2"
                            onClick={() => {
                                router.push(`/profile/${authorId}`);
                            }}
                        >
                            <Image
                                src={authorImageUrl}
                                alt="CasterIcon"
                                width={30}
                                height={30}
                            />
                            <h2 className="text-[16px] font-normal text-white-3">
                                {author}
                            </h2>
                        </figure>
                    </article>

                    <Button
                        className="text-[16px] w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
                        onClick={handlePlay}
                    >
                        <Image
                            src="/icons/play.svg"
                            alt="random play"
                            width={20}
                            height={20}
                        />{" "}
                        &nbsp; اجرا
                    </Button>
                </div>
            </div>

            {isOwner && (
                <div className="relative mt-2">
                    <Image
                        src="/icons/three-dots.svg"
                        alt="three dots icon"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => setIsDeleting((prev) => !prev)}
                    />
                    {isDeleting && (
                        <div onClick={handleDelete} className="absolute -right-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2">
                            <Image
                                src="/icons/delete.svg"
                                alt="DeleteIcon"
                                width={16}
                                height={16}
                            />
                            <h2 className="text-[16px] font-normal text-white-1">
                                حذف
                            </h2>
                        </div>
                    )}
                </div>
            )}
        </div>
     );
}
 
export default PodcastDetailPlayer;