import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { GenerateThumbnailProps } from "@/types";
import { Input } from "./ui/input";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";

const GenerateThumbnail = ({
    setImage,
    setImageStorageId,
    image,
}: GenerateThumbnailProps) => {

    const [isAiThumbnail, setIsAiThumbnail] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const { toast } = useToast();

    const imageRef = useRef<HTMLInputElement>(null);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);
    const getImageUrl = useMutation(api.podcasts.getUrl);

    const handleImage = async (blob: Blob, fileName: string) => {
        setIsImageLoading(true);
        setImage('');

        try {
            const file = new File([blob], fileName, { type: "image/png" });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setImageStorageId(storageId);

            const imageUrl = await getImageUrl({ storageId });

            setImage(imageUrl!);
            setIsImageLoading(false);
            toast({
                title: "پوستر با موفقیت آپلود شد"
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "مشکلی پیش آمده",
                variant: "destructive"
            });
        }
    };
    
    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        try {
            const files = e.target.files;
            if(!files) return;
            const file = files[0];
            const blob = await file.arrayBuffer()
                .then((ab) => new Blob([ab]))

            handleImage(blob, file.name);
        } catch (error) {
            console.log(error);
            toast({
                title: "مشکلی پیش آمده",
                variant: "destructive"
            });
        }
    };
    
    return ( 
        <>
            <div className="mt-[30px] flex w-full max-w-[520px] flex-col justify-between gap-2 rounded-lg border border-black-6 bg-black-1 px-2.5 py-2 md:flex-row md:gap-0">
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiThumbnail(true)}
                    className={cn("", {
                        'bg-black-6': isAiThumbnail
                    })}
                >
                    ایجاد پوستر با هوش مصنوعی
                </Button>
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiThumbnail(false)}
                    className={cn("", {
                        'bg-black-6': !isAiThumbnail
                    })}
                >
                    انتخاب پوستر دلخواه
                </Button>
            </div>
            {isAiThumbnail ? (
                <div className="flex flex-col gap-5">
                    <div className="mt-5 flex flex-col gap-2.5">
                        <Label className="text-[16px] font-bold text-white-1">
                            متن پرامپت برای ایجاد پوستر
                        </Label>
                        <Textarea
                            className="text-[16px] placeholder:text-[16px] bg-black-1 rounded-[6px] placeholder:text-gray-1 font-light border-none text-gray-1 focus-visible:ring-offset-orange-1"
                            placeholder="متن پرامپت"
                            rows={5}
                        />
                    </div>
                    <div className="w-full max-w-[200px]">
                        <Button type="submit" className="text-[16px] w-full bg-orange-1 py-4 font-bold text-white-1">
                            {isImageLoading ? (
                                <>
                                    آپلود
                                    <Loader size={20} className="animate-spin mr-2" />
                                </>
                            ) : (
                                "تبدیل"
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-black-6 bg-black-1" onClick={() => imageRef?.current?.click()}>
                    <Input
                        type="file"
                        className="hidden"
                        ref={imageRef}
                        onChange={(e) => uploadImage(e)}
                    />
                    {!isImageLoading ? (
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
                        <p className="text-[12px] font-normal text-gray-1">
                            SVG, PNG, JPG, or GIF
                        </p>
                    </div>
                </div>
            )}
            {image && (
                <div className="flex items-center justify-center">
                    <Image
                        src={image}
                        width={200}
                        height={200}
                        className="mt-5"
                        alt="thumbnail"
                    />
                </div>
            )}
        </>
     );
}
 
export default GenerateThumbnail;