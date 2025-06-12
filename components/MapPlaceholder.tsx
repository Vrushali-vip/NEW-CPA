// export const MapPlaceholder = () => (
//     <div className="w-full flex justify-center items-center py-10">
//       <div className="w-full max-w-6xl h-[600px] rounded-xl overflow-hidden shadow-lg">
//         <iframe
//           src="https://map-ashen-two.vercel.app/"
//           title="Map"
//           className="w-full h-full border-0"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
  

// "use client";

// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/DropdownMenu";
// import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";

// export const MapPlaceholder = () => {
//   const [selectedMap, setSelectedMap] = useState("ukraine");

//   const mapSources: Record<string, string> = {
//     ukraine: "https://www.google.com/maps/d/u/0/embed?mid=1SCruvJ4faydto6n9giaSndEuEm6CUsQ&ehbc=2E312F&noprof=1&ll=48.530707931098505%2C31.176593999999987&z=5",
//     global: "https://map-ashen-two.vercel.app/",
//   };

//   const handleMapChange = (key: string) => {
//     setSelectedMap(key);
//   };

//   return (
//     <div className="flex justify-center items-start w-full py-6">
//       <div className="relative max-w-5xl w-full rounded-xl overflow-hidden border shadow-md">
//         <div className="absolute top-4 right-4 z-10">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="secondary"
//                 className="flex items-center gap-1 px-4 py-2 text-sm"
//               >
//                 {selectedMap === "ukraine" ? "Ukraine Map" : "Global Risk Map"}
//                 <ChevronDown className="w-4 h-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onSelect={() => handleMapChange("ukraine")}>
//                 Ukraine Map
//               </DropdownMenuItem>
//               <DropdownMenuItem onSelect={() => handleMapChange("global")}>
//                 Global Risk Map
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <iframe
//           src={mapSources[selectedMap]}
//           title="Map"
//           className="w-full h-[600px] border-0"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
// };

// "use client";

// import { useState } from "react";

// export const MapPlaceholder = () => {
//   const [selectedMap] = useState("ukraine");

//   const mapSources: Record<string, string> = {
//     ukraine:
//       "https://www.google.com/maps/d/u/0/embed?mid=1SCruvJ4faydto6n9giaSndEuEm6CUsQ&ehbc=2E312F&noprof=1&ll=48.530707931098505%2C31.176593999999987&z=5",
//     global: "https://map-ashen-two.vercel.app/",
//   };


//   return (
//     <div className="flex flex-col items-center w-full py-0 px-4">
//       <div className="mt-2 relative w-full overflow-hidden border shadow-md">
//         <iframe
//           src={mapSources[selectedMap]}
//           title="Map"
//           className="w-full h-[600px] border-0"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
// };

// "use client";

// import { useEffect, useRef, useState } from "react";

// export const MapPlaceholder = () => {
//   const [selectedMap] = useState("ukraine");
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   const mapSources: Record<string, string> = {
//     ukraine:
//       "https://www.google.com/maps/d/u/0/embed?mid=1SCruvJ4faydto6n9giaSndEuEm6CUsQ&ehbc=2E312F&noprof=1&ll=48.530707931098505%2C31.176593999999987&z=5",
//     global: "https://map-ashen-two.vercel.app/",
//   };

//   useEffect(() => {
//     const iframeContainer = iframeRef.current?.parentElement;
//     if (!iframeContainer) return;

//     const handleWheel = (e: WheelEvent) => {
//       if (e.deltaY > 0) {
//         // Prevent zoom out
//         e.preventDefault();
//       }
//     };

//     iframeContainer.addEventListener("wheel", handleWheel, { passive: false });

//     return () => {
//       iframeContainer.removeEventListener("wheel", handleWheel);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center w-full py-0 px-4">
//       <div className="mt-2 relative w-full overflow-hidden border shadow-md">
//         <iframe
//           ref={iframeRef}
//           src={mapSources[selectedMap]}
//           title="Map"
//           className="w-full h-[600px] border-0"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
// };

// "use client";

// export const MapPlaceholder = () => {
//   return (
//     <div className="flex flex-col items-center w-full py-0 px-4">
//       <div className="mt-2 relative w-full overflow-hidden border shadow-md">
//         <iframe
//           src="https://www.google.com/maps/d/u/0/embed?mid=1SCruvJ4faydto6n9giaSndEuEm6CUsQ&ehbc=2E312F&noprof=1&ll=48.530707931098505%2C31.176593999999987&z=5"
//           title="Map"
//           className="w-full h-[600px] border-0"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
// };



export const MapPlaceholder = () => {
  return (
    <div className="flex flex-col items-center w-full py-0 px-4">
      <div className="mt-2 relative w-full overflow-hidden border shadow-md">
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=1SCruvJ4faydto6n9giaSndEuEm6CUsQ&ehbc=2E312F&noprof=1&ll=48.530707931098505%2C31.176593999999987&z=5"
          title="Map"
          className="w-full h-[600px] border-0"
          allowFullScreen
          loading="lazy" 
        />
      </div>
    </div>
  );
};