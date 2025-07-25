import { Facebook, Github, Linkedin, Slack, Youtube } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}
const socialLink = [
  {
    title: "Youtube",
    href: "https://www.youtube.com/",
    icon: <Youtube className="w-5 h-5 text-black" />,
  },
//   {
//     title: "Github",
//     href: "https://www.youtube.com/",
//     icon: <Github className="w-5 h-5 text-black" />,
//   },
  {
    title: "Linkedin",
    href: "https://www.youtube.com/",
    icon: <Linkedin className="w-5 h-5 text-black" />,
  },
  {
    title: "Facebook",
    href: "https://www.youtube.com/",
    icon: <Facebook className="w-5 h-5 text-black" />,
  },
  {
    title: "Slack",
    href: "https://www.youtube.com/",
    icon: <Slack className="w-5 h-5 text-black" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLink?.map((item) => (
          <Tooltip key={item?.title}>
            <TooltipTrigger asChild>
              <Link
                key={item?.title}
                target="_blank"
                rel="noopener noreferrer"
                href={item?.href}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop-dark-grey hoverEffect",
                  iconClassName
                )}
              >
                {item?.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor border border-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item?.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
