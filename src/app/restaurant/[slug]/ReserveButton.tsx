"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import ReservationModal from "@/components/ReservationModal";

export default function RestaurantReserveButton({
  restaurant,
}: {
  restaurant: { id: string; name: string; city: string | null };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-sm font-bold transition-colors"
      >
        <Calendar className="w-4 h-4" /> Reserver
      </button>
      {open && (
        <ReservationModal
          restaurant={restaurant}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
