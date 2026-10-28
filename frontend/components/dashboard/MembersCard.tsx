import { AppImage } from "@/components/ui/Image";

const members = [
  { name: "Sophia Brown", src: "/features/avatar-1.jpg" },
  { name: "Alex Johnson", src: "/features/avatar-2.jpg" },
  { name: "Mia Wilson", src: "/features/avatar-3.jpg" },
  { name: "Noah Davis", src: "/features/avatar-4.jpg" },
  { name: "Olivia Lee", src: "/features/avatar-1.jpg" },
  { name: "Liam Carter", src: "/features/avatar-2.jpg" },
];

export function MembersCard() {
  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Members</h2>
      <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
        {members.map((member) => (
          <div key={member.name} className="flex flex-col items-center text-center">
            <span className="relative h-9 w-9 overflow-hidden rounded-full bg-[#efeaf8]">
              <AppImage src={member.src} alt="" fill className="object-cover" sizes="36px" />
            </span>
            <p className="mt-1.5 font-sans text-[9px] leading-tight font-medium text-[#5b5568]">
              {member.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
