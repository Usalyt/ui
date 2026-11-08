import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "tu-ui";

const slides = [
  "One item per view by default",
  "Arrow keys change slides",
  "Edge arrows disable themselves",
  "Slides can hold any content",
  "Vertical axis via orientation",
];

export function CarouselDemo() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(1);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full max-w-md px-12">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {slides.map((caption, i) => (
            <CarouselItem key={caption}>
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 p-6">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-center text-sm text-foreground">{caption}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
        {current} / {slides.length}
      </p>
    </div>
  );
}
