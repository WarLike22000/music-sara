"use client";

import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import Image from "next/image";

const useGeneratePodcast = ({
    setAudio, setAudioStorageId
}: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const { toast } = useToast();

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);

    const getAudioUrl = useMutation(api.podcasts.getUrl);

    const generatePodcast = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsGenerating(true);
        setAudio('');

        try {

            const files = e.target.files;
            if(!files) return;
            const fileInput = files[0];
            const blob = await fileInput.arrayBuffer()
                .then((ab) => new Blob([ab]))

            const file = new File([blob], fileInput.name, { type: 'audio/mpeg' });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioUrl = await getAudioUrl({ storageId });
            setAudio(audioUrl!);
            setIsGenerating(false);
            toast({
                title: "پادسکت با موفقیت ایجاد شد"
            });
        } catch (error) {
            console.log('Error generating podcast', error);
            toast({
                title: "ارور هنگام ایجاد پادکست",
                variant: "destructive"
            });
            setIsGenerating(false);
        }
    };
    
    return {
        isGenerating,
        generatePodcast,
    };
};

const GeneratePodcast = (props : GeneratePodcastProps) => {
    
    const { isGenerating, generatePodcast } = useGeneratePodcast(props);
    const podcastRef = useRef<HTMLInputElement>(null);

    const { audio, setAudioDuration } = props;

    return ( 
        <div>
                <Label className="text-[16px] font-bold text-white-1">
                    آپلود فایل پادکست
                </Label>
                <div className="flex items-center justify-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-black-6 bg-black-1" onClick={() => podcastRef?.current?.click()}>
                    <Input
                        type="file"
                        className="hidden"
                        ref={podcastRef}
                        onChange={(e) => generatePodcast(e)}
                    />
                    {!isGenerating ? (
                        <Image
                            src="/icons/upload-image.svg"
                            alt="upload"
                            width={40}
                            height={40}
                        />
                    ) : (
                        <div className="text-[16px] flex items-center justify-center font-medium text-white-1">
                            آپلود
                            <Loader size={20} className="animate-spin mr-2" />
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                        <h2 className="text-[12px] font-bold text-orange-1">
                            برای آپلود کلیک کنید
                        </h2>
                    </div>
                </div>
            
            {
                audio && (
                    <audio
                        controls
                        src={audio}
                        autoPlay
                        className="mt-5"
                        onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                    />
                )
            }
        </div>
     );
}
 
export default GeneratePodcast;