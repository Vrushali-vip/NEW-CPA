// "use client";

// import { useRef } from "react";
// import { MapPlaceholder } from "@/components/MapPlaceholder";
// import InsuranceForm from "@/components/insurance-form/InsuranceForm";
// import { NewsFeed } from "@/components/NewsFeed";

// export default function Home() {
//   const newsRef = useRef<HTMLDivElement>(null);

//   return (
//     <main className="space-y-12 p-6 overflow-x-hidden max-w-full">
//       <MapPlaceholder />
//       <InsuranceForm />
//       <div ref={newsRef}>
//         <NewsFeed />
//       </div>
//     </main>
//   );
// }




import { MapPlaceholder } from "@/components/MapPlaceholder"; 
import InsuranceForm from "@/components/insurance-form/InsuranceForm"; 
import { NewsFeed } from "@/components/NewsFeed"; 



export default async function Home() {

  return (
    <main className="space-y-12 p-6 overflow-x-hidden max-w-full">
      <MapPlaceholder />

      <InsuranceForm />

      <div> 
        <NewsFeed />
      </div>
    </main>
  );
}