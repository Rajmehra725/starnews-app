export type NewsItem = {
  id: string;
  title: string;
  image?: string;
  description?: string;
  category?: "panna" | "satna" | "chhatarpur";
};