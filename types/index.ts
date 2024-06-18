import { Id } from "@/convex/_generated/dataModel";
import { Dispatch, SetStateAction } from "react";

export type CategoryType = "پاپ" | "غمگین" | "عاشقانه" | "ساز ها" | "سنتی" | "نوستالژی" | "ملولیست";

export interface GeneratePodcastProps {
    setAudioStorageId: Dispatch<SetStateAction<Id<'_storage'> | null>>;
    setAudio: Dispatch<SetStateAction<string>>;
    category: CategoryType;
    audio: string;
    setAudioDuration: Dispatch<SetStateAction<number>>;
};

export interface GenerateThumbnailProps {
    setImage: Dispatch<SetStateAction<string>>;
    setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
    image: string;
};

export interface PodcastCardProps {
    imgUrl: string;
    title: string;
    description: string;
    podcastId: string;
};

export  interface EmptyStateProps {
    title: string;
    buttonLink: string;
    buttonText: string;
    search: boolean;
};

export interface PodcastDetailPlayerProps {
    audioUrl: string;
    podcastTitle: string;
    author: string;
    isOwner: boolean;
    imageUrl: string;
    podcastId: Id<"podcasts">;
    imageStorageId: Id<"_storage">;
    audioStorageId: Id<"_storage">;
    authorImageUrl: string;
    authorId: string;
    category: string;
};

export interface TopPodcastsProps {
    _id: Id<"users">;
    _creationTime: number;
    email: string;
    imageUrl: string;
    clerkId: string;
    name: string;
    podcast: {
        podcastTitle: string;
        podcastId: Id<"podcasts">;
    }[];
    totalPodcasts: number;
};

export interface CarouselProps {
    fansLikeDetail: TopPodcastsProps[];
};

export interface AudioProps {
    title: string;
    audioUrl: string;
    author: string;
    imageUrl: string;
    podcastId: string;
};

export interface AudioContextProvider {
    audio: AudioProps | undefined;
    setAudio: Dispatch<SetStateAction<AudioProps | undefined>>;
};