"use client";

import Container from "@/components/Container";
import { Title, SubText, SubTitle } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to submit");
      }

      const name = (payload["name"] as string) || "there";
      toast.success(`Thanks ${name}! Your message has been sent.`);
      form.reset();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white">
      <Container className="px-8 py-12 max-w-5xl">
        <Title className="mb-2">Contact Us</Title>
        <SubText className="text-base mb-8">
          Questions about sizing, materials, or orders? Send us a message — our team typically replies within 24 hours.
        </SubText>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SubTitle className="mb-2">Full name</SubTitle>
                  <Input name="name" placeholder="Jane Doe" required />
                </div>
                <div>
                  <SubTitle className="mb-2">Email</SubTitle>
                  <Input name="email" type="email" placeholder="jane@domain.com" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SubTitle className="mb-2">Phone</SubTitle>
                  <Input name="phone" type="tel" placeholder="+1 555 123 4567" />
                </div>
                <div>
                  <SubTitle className="mb-2">Subject</SubTitle>
                  <Input name="subject" placeholder="Order inquiry" />
                </div>
              </div>
              <div>
                <SubTitle className="mb-2">Message</SubTitle>
                <Textarea name="message" placeholder="How can we help?" required className="min-h-28" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div>
              <SubTitle>Support</SubTitle>
              <SubText className="mt-2">
                Email: support@zensu.store
                <br />
                Mon–Fri, 9am–6pm (local time)
              </SubText>
            </div>
            <div>
              <SubTitle>Showroom</SubTitle>
              <SubText className="mt-2">
                21 Harbor Street, Suite 804
                <br />
                San Francisco, CA 94107
              </SubText>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 