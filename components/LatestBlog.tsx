import React from "react";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { Blog, Blogcategory } from "@/sanity.types";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();
  return (
    <div className="my-12 container mx-auto px-4 max-w-7xl">
      {/* Centered Heading */}
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-center font-poppins mb-2">
          Stories
        </h2>
        <p className="text-sm text-center md:text-sm font-poppins text-[#767676] mb-8">
          Discover our newest articles and stay up to date with the latest trends and stories
        </p>
      </div>
      
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs?.map((blog: Blog) => (
          <div key={blog?._id} className="flex flex-col items-center text-center group">
            {/* Image Container */}
            <Link
              href={`/blog/${blog?.slug?.current}`}
              className="w-full max-w-md mx-auto overflow-hidden"
            >
              {blog?.mainImage && (
                <div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center">
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    // fill
                    className="object-cover flex align-center"
                    height={400}
                    width={400}
                  />
                </div>
              )}
            </Link>

            {/* Content */}
            <div className="mt-5 max-w-md mx-auto">
              
              <h3 className="text-lg font-medium mb-2">{blog?.title}</h3>
              {/* <div className="flex items-center justify-center gap-4 text-sm text-[#767676] mb-3">
                {blog?.blogcategories?.map((item, index) => (
                  <p
                      key={index}
                      className="font-semibold text-shop-light-black/30 tracking-wider"
                    >
                      {item?.title}
                    </p>
                ))}
                <span className="flex items-center gap-1">
                  <Calendar size={15} />
                  {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                </span>
              </div> */}
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="inline-block text-[#767676] italic text-sm underline hover:text-shop_dark_green transition"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;