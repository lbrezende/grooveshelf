"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface AlbumItem {
  title: string;
  artist: string;
  year: number;
  coverUrl: string;
}

function AlbumCarousel({ albums }: { albums: AlbumItem[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [api, current]);

  return (
    <div className="w-full py-16">
      <div className="container mx-auto">
        <Carousel setApi={setApi} className="w-full" opts={{ loop: true, align: "start" }}>
          <CarouselContent>
            {albums.map((album, index) => (
              <CarouselItem className="basis-1/3 sm:basis-1/4 lg:basis-1/6" key={index}>
                <div className="flex flex-col items-center gap-2 p-2">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted shadow-lg hover:scale-105 transition-transform duration-300">
                    <Image
                      src={album.coverUrl}
                      alt={`${album.title} - ${album.artist}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                  <div className="text-center w-full">
                    <p className="text-xs font-semibold text-foreground truncate">{album.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{album.artist} &middot; {album.year}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export { AlbumCarousel };
