"use client";

import { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { CarouselProps } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoaderSpinner from './LoaderSpinner';

const EmblaCarousel = ({
    fansLikeDetail
} : CarouselProps) => {

    const router = useRouter();
    
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true
  }, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  const slides = fansLikeDetail && fansLikeDetail?.filter((item) => item.totalPodcasts > 0);

  if(!slides) return <LoaderSpinner />

  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden" dir="rtl" ref={emblaRef}>

      <div className="flex">
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item._id}
            className="relative flex h-fit aspect-square w-full flex-none cursor-pointer flex-col justify-end rounded-xl border-none overflow-hidden"
            onClick={() => router.push(`/podcast/${item.podcast[0]?.podcastId}`)}
          >
            <Image
              src={item.imageUrl}
              alt="card"
              fill
              className="absolute size-full"
            />
            <div className="bg-[rgba(18,18,18,0.64)] backdrop-blur-[37px] relative z-10 flex flex-col p-4">
              <h2 className="text-[14px] font-semibold text-white-1">
                {item.podcast[0]?.podcastTitle}
              </h2>
              <p className="text-[12px] font-normal text-white-2">
                {item.name}
              </p>
            </div>
          </figure>
        ))}
      </div>
      
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  )
}

export default EmblaCarousel
