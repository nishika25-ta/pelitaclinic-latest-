export interface GalleryImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

const IMAGES: GalleryImage[] = [
  {
    itemImageSrc: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1400&auto=format&fit=crop",
    thumbnailImageSrc: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=400&auto=format&fit=crop",
    alt: "Clinic reception",
    title: "Pelita Clinic Reception",
  },
  {
    itemImageSrc: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1400&auto=format&fit=crop",
    thumbnailImageSrc: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=400&auto=format&fit=crop",
    alt: "Doctor consultation",
    title: "Consultation Room",
  },
  {
    itemImageSrc: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop",
    thumbnailImageSrc: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop",
    alt: "Clinic services",
    title: "Patient Care Services",
  },
];

export const PhotoService = {
  getImages(): Promise<GalleryImage[]> {
    return Promise.resolve(IMAGES);
  },
};

