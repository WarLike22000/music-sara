"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { categoryDetails } from "@/constants"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { CategoryType } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "عنوان باید بیشتر 2 کاراکتر باشد",
  }),
  podcastDescription: z.string().min(2, {
    message: "توضیحات باید بیشتر از 2 کاراکتر باشد",
  }),
})

function CreatePodcast() {

    const router = useRouter();
    const [imageStorageId, setImageStorageId] = useState<Id<'_storage'> | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    
    const [audioUrl, setAudioUrl] = useState('');
    const [audioStorageId, setAudioStorageId] = useState<Id<'_storage'> | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);
    
    const [category, setCategory] = useState<CategoryType | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const createPodcast = useMutation(api.podcasts.createPodcast);
    
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          podcastTitle: "",
          podcastDescription: "",
        },
      })
     

      async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);

            if(!audioUrl || !imageUrl) {
                toast({
                    title: "لطفا پادکست و پوستر را انتخاب کنید",
                });
                setIsSubmitting(false);
                throw new Error("لطفا پادکست و پوستر را انتخاب کنید");
            };

            const podcast = await createPodcast({
                podcastTitle: data.podcastTitle,
                podcastDescription: data.podcastDescription,
                audioUrl,
                imageUrl,
                views: 0,
                audioDuration,
                audioStorageId: audioStorageId!,
                imageStorageId: imageStorageId!,
                category: category!,
            });
            toast({
                title: "پادسکت با موفقیت ایجاد شد"
            });
            setIsSubmitting(false);
            router.push("/");
        } catch (error) {
            console.log(error);
            toast({
                title: "مشکلی پیش آمده",
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
      }
    

  return (
    <section className="mt-10 flex flex-col">
        <h1 className="text-[20px] font-bold text-white-1">
            ایجاد پادسکت
        </h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
                <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
                    <FormField
                        control={form.control}
                        name="podcastTitle"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2.5">
                                <FormLabel className="text-[16px] font-bold text-white-1">عنوان پادسکت</FormLabel>
                                <FormControl>
                                    <Input
                                        className="text-[16px] placeholder:text-[16px] bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1 focus-visible:ring-offset-orange-1"
                                        placeholder="podcaster"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-white-1" />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col gap-2.5">
                        <Label className="text-[16px] font-bold text-white-1">
                            دسته بندی موسیقی
                        </Label>
                        <Select onValueChange={(value: CategoryType) => setCategory(value)}>
                            <SelectTrigger dir="rtl" className={cn(
                                'w-full text-[16px] border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1'
                            )}>
                                <SelectValue placeholder="دسته بندی" className="placeholder:text-gray-1" />
                            </SelectTrigger>
                            <SelectContent dir="rtl" className="text-[16px] border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                                {
                                    categoryDetails.map((item) => (
                                        <SelectItem key={item.id} value={item.name} className="capitalize focus:bg-orange-1">
                                            {item.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="podcastDescription"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2.5">
                                <FormLabel className="text-[16px] font-bold text-white-1">توضیحات</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="text-[16px] placeholder:text-[16px] bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1 focus-visible:ring-offset-orange-1"
                                        placeholder="توضیحی کوتاه در مورد پادکست"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-white-1" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col pt-10">
                    <GeneratePodcast
                        setAudioStorageId={setAudioStorageId}
                        setAudio={setAudioUrl}
                        category={category!}
                        audio={audioUrl}
                        setAudioDuration={setAudioDuration}
                    />

                    <GenerateThumbnail
                        setImage={setImageUrl}
                        setImageStorageId={setImageStorageId}
                        image={imageUrl}
                    />

                    <div className="mt-10 w-full">
                        <Button type="submit" className="text-[16px] w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-300 hover:bg-black-1">
                            {isSubmitting ? (
                                <>
                                    درحال ارسال
                                    <Loader size={20} className="animate-spin mr-2" />
                                </>
                            ) : (
                                'ایجاد و انتشار'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
            </Form>
    </section>
  )
}

export default CreatePodcast;