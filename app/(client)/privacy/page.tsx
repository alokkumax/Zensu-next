import Container from "@/components/Container";
import { Title, SubText, SubTitle } from "@/components/ui/text";

export const metadata = {
  title: "Privacy Policy | Zensu",
  description: "How Zensu collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <Container className="px-8 py-12 max-w-4xl">
        <Title className="mb-6">Privacy Policy</Title>

        <section className="space-y-3 mb-8">
          <SubTitle>Information We Collect</SubTitle>
          <SubText>
            We collect information you provide (like name, email, address) and
            technical data (such as device, browser, and analytics) to improve
            our services.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>How We Use Information</SubTitle>
          <SubText>
            To process orders, provide customer support, personalize content,
            and improve site performance. We may send service updates and
            marketing communications with your consent.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>Sharing & Disclosure</SubTitle>
          <SubText>
            We share data with trusted providers (payments, shipping,
            analytics) under contractual safeguards. We do not sell your
            personal information.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>Security</SubTitle>
          <SubText>
            We implement technical and organizational measures to protect your
            data. No method is 100% secure, but we strive for industry best
            practices.
          </SubText>
        </section>

        <section className="space-y-3 mb-8">
          <SubTitle>Your Choices</SubTitle>
          <SubText>
            You can update your information, unsubscribe from marketing, and
            request access or deletion as permitted by law.
          </SubText>
        </section>

        <section className="space-y-3">
          <SubTitle>Contact</SubTitle>
          <SubText>
            Questions about privacy? Email privacy@zensu.store.
          </SubText>
        </section>
      </Container>
    </div>
  );
} 