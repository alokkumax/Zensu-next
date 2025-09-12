import Container from "@/components/Container";
import { Title, SubText, SubTitle } from "@/components/ui/text";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Help | Zensu",
  description: "Get help with orders, returns, and product care.",
};

export default function HelpPage() {
  return (
    <div className="bg-white">
      <Container className="px-8 py-12 max-w-5xl">
        <Title className="mb-2">Help Center</Title>
        <SubText className="text-base mb-8">
          Find quick answers and guides for your Zensu gear.
        </SubText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <SubTitle>Track your order</SubTitle>
            <SubText className="mt-2 mb-3">
              View the latest shipping updates for your purchase.
            </SubText>
            <Link href="/orders">
              <Button variant="outline">Go to Orders</Button>
            </Link>
          </div>
          <div>
            <SubTitle>Returns & refunds</SubTitle>
            <SubText className="mt-2 mb-3">
              Start a return within 30 days of delivery.
            </SubText>
            <Link href="/contact">
              <Button variant="outline">Start a Return</Button>
            </Link>
          </div>
          <div>
            <SubTitle>Product care</SubTitle>
            <SubText className="mt-2">
              Wipe with a damp cloth, avoid harsh solvents, and store in a cool, dry place.
            </SubText>
          </div>
        </div>

        <div className="mt-12">
          <SubTitle>Still need help?</SubTitle>
          <SubText className="mt-2">
            Email us at support@zensu.store or use the <Link className="underline" href="/contact">contact form</Link>.
          </SubText>
        </div>
      </Container>
    </div>
  );
} 