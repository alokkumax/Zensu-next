import Container from "@/components/Container";
import { Title, SubText, SubTitle } from "@/components/ui/text";
import Image from "next/image";

export const metadata = {
  title: "About Us | Zensu",
  description: "Learn about Zensu — premium suitcases engineered for modern travel.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <Container className="px-8 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <Title className="mb-4">About Zensu</Title>
            <SubText className="text-base">
              Zensu crafts premium suitcases that blend minimalist design with
              rugged performance. From aerospace-grade shells to whisper-quiet
              wheels, every detail is engineered to glide through the chaos of
              modern travel. Our mission is simple: make your journey lighter,
              smarter, and more stylish.
            </SubText>
            <SubText className="text-base mt-4">
              Founded by frequent flyers and gear nerds, we obsess over the
              things that matter — durability, capacity, security, and comfort.
              Each Zensu case undergoes drop, tumble, and climate tests so you
              can focus on the destination, not the luggage.
            </SubText>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image src="/hero2.jpg" alt="Zensu suitcase" fill className="object-cover" />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <SubTitle>Engineered Shells</SubTitle>
            <SubText className="mt-2">
              Lightweight polycarbonate with micro–textured finish resists
              scuffs while staying travel-tough.
            </SubText>
          </div>
          <div>
            <SubTitle>Glide Effortlessly</SubTitle>
            <SubText className="mt-2">
              360° silent spinner wheels and reinforced axles for smooth
              movement across terminals and streets.
            </SubText>
          </div>
          <div>
            <SubTitle>Security First</SubTitle>
            <SubText className="mt-2">
              TSA‑approved locks and interior compression to keep your
              essentials organized and protected.
            </SubText>
          </div>
        </div>

        <div className="mt-14">
          <Title className="mb-4 text-2xl">Sustainability</Title>
          <SubText className="text-base">
            We minimize waste with modular parts and repairable components. Our
            packaging is recyclable, and we partner with carriers to offset
            shipping emissions.
          </SubText>
        </div>
      </Container>
    </div>
  );
} 