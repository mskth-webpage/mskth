import EventPresenter from "@/presenter/admin/EventPresenter";
import GalleryPresenter from "@/presenter/admin/GalleryPresenter";

export default function EventPage() {
  return (
    <>
      <EventPresenter />
      <GalleryPresenter />
    </>
  );
}