import { EmptyStateProps } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const EmptyState = ({
    title,
    buttonLink,
    buttonText,
    search,
} : EmptyStateProps) => {
    return ( 
        <section className="flex items-center justify-center size-full flex-col gap-3">
            <Image
                src="/icons/emptyState.svg"
                alt="emptyState"
                width={250}
                height={250}
            />
            <div className="flex items-center justify-center w-full max-w-[254px] flex-col gap-3">
                <h1 className="text-[16px] text-center font-medium text-white-1">
                    {title}
                </h1>
                {search && (
                    <p className="text-center text-[16px] font-medium text-white-2">
                        سعی کنید جستجو را برای یافتن آنچه به دنبال آن هستید تنظیم کنید
                    </p>
                )}
                {buttonLink && (
                    <Button className="bg-orange-1">
                        <Link href={buttonLink} className="gap-1 flex">
                            <Image
                                src="/icons/discover.svg"
                                alt="discover"
                                width={20}
                                height={20}
                            />
                            <h1 className="text-[16px] font-extrabold text-white-1">
                                {buttonText}
                            </h1>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
     );
}
 
export default EmptyState;