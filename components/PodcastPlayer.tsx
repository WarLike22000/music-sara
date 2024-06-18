"use client";

import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "./ui/progress";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTime } from "@/lib/formatTime";

const PodcastPlayer = () => {

    const { audio } = useAudio();    
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(45);
    const [duration, setDuration] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    
    const togglePlayPause = () => {
        if(audioRef.current?.paused) {
            audioRef.current?.play();
            setIsPlaying(true);
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        };
    };

    const toggleMute = () => {
        if(audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted((prev) => !prev);
        };
    };

    const forward = () => {
        if(
            audioRef.current &&
            audioRef.current.currentTime &&
            audioRef.current.duration &&
            audioRef.current.currentTime + 5 < audioRef.current?.duration
        ) {
            audioRef.current.currentTime += 5;
        };
    };

    const rewind = () => {
        if(audioRef.current && audioRef.current.currentTime - 5 > 0) {
            audioRef.current.currentTime -= 5;
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        };
    };

    useEffect(() => {
        const updateCurrentTime = () => {
            if(audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            };
        };

        const audioElement = audioRef.current;
        if(audioElement) {
            audioElement.addEventListener('timeupdate', updateCurrentTime);

            return () => {
                audioElement.addEventListener("timeupdate", updateCurrentTime);
            };
        };
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;
        if(audio?.audioUrl) {
            if(audioElement) {
                audioElement.play().then(() => {
                    setIsPlaying(true);
                });
            };
        } else {
            audioElement?.pause();
            setIsPlaying(false);
        };
    }, [audio]);

    const handleLoadedMetadata = () => {
        if(audioRef.current) {
            setDuration(audioRef.current.duration);
        };
    };
    
    const handleAudioEnded = () => {
        setIsPlaying(false);
    };
    
    return ( 
        <div className={cn(
            "sticky bottom-0 left-0 flex size-full flex-col", {
                'hidden': !audio?.audioUrl || audio.audioUrl === "",
            }
        )}>
            <Progress
                value={(currentTime / duration) * 100}
                className="w-full"
                max={duration}
            />
            <section className="bg-[rgba(18,18,18,0.64)] backdrop-blur-[37px] flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
                <audio
                    ref={audioRef}
                    src={audio?.audioUrl}
                    className="hidden"
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                />
                <div className="flex items-center gap-4 max-md:hidden">
                    <Link href={`/podcast/${audio?.podcastId}`}>
                        <Image
                            src={audio?.imageUrl! || "/images/player1.png"}
                            alt="player"
                            width={64}
                            height={64}
                            className="aspect-square rounded-xl"
                        />
                    </Link>

                    <div className="flex w-[160px] flex-col">
                        <h2 className="text-[14px] truncate font-semibold text-white-1">
                            {audio?.title}
                        </h2>
                        <p className="text-[12px] font-normal text-white-2">
                            {audio?.author}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center cursor-pointer gap-3 md:gap-6">
                    <div className="flex items-center gap-1.5">
                        <Image
                            src="/icons/reverse.svg"
                            alt="rewind"
                            width={24}
                            height={24}
                            onClick={rewind}
                        />
                        <h2 className="text-[12px] font-bold text-white-4">
                            -5
                        </h2>
                    </div>
                    <Image
                        src={isPlaying ? "/icons/pause.svg" : "/icons/play.svg"}
                        width={30}
                        height={30}
                        alt="play"
                        onClick={togglePlayPause}
                    />
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-[12px] font-bold text-white-4">
                            +5
                        </h2>
                        <Image
                            src="/icons/forward.svg"
                            alt="forward"
                            width={24}
                            height={24}
                            onClick={forward}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <h2 className="text-[16px] font-normal text-white-2 max-md:hidden pt-1">
                        {formatTime(duration)}
                    </h2>
                    <div className="flex w-full gap-2">
                        <Image
                            src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
                            alt="mute unmute"
                            width={24}
                            height={24}
                            onClick={toggleMute}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </section>
        </div>
     );
}
 
export default PodcastPlayer;