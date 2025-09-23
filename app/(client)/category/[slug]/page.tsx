import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import { getCategories } from "@/sanity/queries";
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;
  return (
    <Container>
      <div className="py-4 md:py-8 px-4 md:px-12">
        <CategoryProducts categories={categories} slug={slug} />
      </div>
    </Container>
  );
};

export default CategoryPage;