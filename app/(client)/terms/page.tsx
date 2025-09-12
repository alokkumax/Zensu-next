import Container from "@/components/Container";
import { Title, SubText, SubTitle } from "@/components/ui/text";

export const metadata = {
  title: "Terms & Conditions | Zensu",
  description: "Zensu terms of service and conditions of sale.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <Container className="px-8 py-12 max-w-4xl">
        <Title className="mb-6">Terms & Conditions</Title>

        <section className="space-y-3 mb-8">
          <SubTitle>1. Introduction</SubTitle>
          <SubText>
            These Terms & Conditions govern your use of the Zensu website and purchases
            of our products. By accessing our site, you agree to these terms.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>2. Orders & Payment</SubTitle>
          <SubText>
            All orders are subject to availability and confirmation of the order price.
            We reserve the right to refuse any order. Prices include applicable taxes where required.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>3. Shipping & Delivery</SubTitle>
          <SubText>
            Estimated delivery windows are provided at checkout. Delays may occur due to
            carrier constraints. Title and risk pass to you upon delivery.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>4. Returns & Warranty</SubTitle>
          <SubText>
            Unused items may be returned within 30 days in original condition. Zensu cases
            include a limited warranty against manufacturing defects; normal wear is excluded.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>5. Acceptable Use</SubTitle>
          <SubText>
            Do not misuse our services, attempt unauthorized access, or disrupt functionality.
            Violations may result in account suspension.
          </SubText>
        </section>

        <section className="space-y-3">
          <SubTitle>6. Contact</SubTitle>
          <SubText>
            For questions about these terms, contact support@zensu.store.
          </SubText>
        </section>
      </Container>
    </div>
  );
} 