"use client";
import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetUserLinkedInProfile,
  useGetUserProfile,
  useGetUserProject,
} from "@/hooks/user-hook";
import ProjectCard from "@/components/project-card";
import Timeline, { transformLinkedInData } from "@/components/timeline";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import { ProjectListSkeleton } from "@/components/skeletons/project-skeleton";
import { TimelineSkeleton } from "@/components/skeletons/timeline-skeleton";
import { AboutSkeleton } from "@/components/skeletons/about-skeleton";
import { ArrowDown } from "lucide-react";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  BookOpen,
  Code,
  Layers,
  Globe,
  Share2,
  AtSign,
  Video,
  Image as ImageIcon,
  Link as LucideLink,
  Database,
  Hash,
  User,
  Download
} from 'lucide-react';
import ResumeGenerator from "@/components/ResumeGenerator";

const iconComponents = {
  'linkedin': Linkedin,
  'github': Github,
  'twitter': Twitter,
  'instagram': Instagram,
  'facebook': Facebook,
  'youtube': Youtube,
  'medium': BookOpen,
  'dev.to': Code,
  'stackoverflow': Layers,
  'hashnode': Hash,
  'personal_website': Globe,
  'mastodon': Share2,
  'threads': AtSign,
  'tiktok': Video,
  'pinterest': ImageIcon,
  'kaggle': Database,
  'generic': LucideLink
} as const;


const extractDomainName = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const Page = ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = use(params);
  const { data: user, isLoading: isUserDataLoading } =
    useGetUserProfile(username);
  const { data: userProjects, isLoading: isUserProjectsLoading } =
    useGetUserProject(username);
  const { data: linkedInData, isLoading: isUserLinkedInDataLoading } =
    useGetUserLinkedInProfile(username);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-[400px] space-y-2">
        <Link href="/" className="block">
          <Image
            src="/images/logo-full.png"
            alt="devb.io"
            width={140}
            height={50}
            className="h-10 w-auto"
          />
        </Link>
      
        {isUserDataLoading || !user ? (
          <ProfileSkeleton />
        ) : (
          <div className="rounded-xl border-[1px] border-black bg-white overflow-hidden">
            <div className="h-28 bg-[linear-gradient(94.26deg,#EAFFD1_31.3%,#B9FF66_93.36%)] relative">
              <div className="absolute left-8 bottom-0 translate-y-1/2">
                <div className="bg-[#AFE555] rounded-[19px] w-32 h-32 flex items-center justify-center">
                  <Image
                    src={user.avatar_url}
                    alt={user?.name}
                    width={120}
                    height={120}
                    className="rounded-[16px]"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-8 pb-4 pt-20">
              <div className="flex flex-col items-start text-left">
                <h2 className="font-bold text-2xl mb-2 text-black">{user.name.toUpperCase()}</h2>
                <p className="text-gray-700 text-md">{user.bio}</p>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5" />
                  <h2 className="font-bold">Connect with me</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl border-[1px] border-black hover:bg-[#B9FF66] transition-all duration-300"
                    title="GitHub"
                  >
                    <span className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300">
                      <Github size={24} strokeWidth={2} className="text-black" />
                    </span>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      GitHub
                    </span>
                  </a>
                  {user.social_accounts.map((account) => {
                    if (account.provider.toLowerCase() === 'github') return null;
                    const provider = account.provider.toLowerCase();
                    const tooltipText = account.provider === 'generic' ? extractDomainName(account.url) : account.provider;
                    
                    return (
                      <a
                        key={account.url}
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl border-[1px] border-black hover:bg-[#B9FF66] transition-all duration-300"
                        title={tooltipText}
                      >
                        {account.url.includes('devb.io') ? (
                          <Image src="/images/logo.png" alt="devb.io" width={24} height={24} />
                        ) : (
                          <span className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300">
                            {(() => {
                              const IconComponent = iconComponents[provider as keyof typeof iconComponents] || iconComponents.generic;
                              return <IconComponent size={24} strokeWidth={2} className="text-black" />;
                            })()}
                          </span>
                        )}
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {tooltipText}
                        </span>
                      </a>
                    );
                  })}
                  <ResumeGenerator username={username} />
                </div>
              </div>

              {user.achievements?.total_contributions && ( <div className="mt-4">
                <h2 className="font-bold mb-4">{user.achievements?.total_contributions } Contributions</h2>
                <div className=" overflow-hidden">
                  <div className="relative w-full" style={{ height: '100px' }}>
                    <img
                      className="absolute top-[30%] left-1/2 transform -translate-x-124 -translate-y-1/2 scale-[1]"
                      src={`https://ghchart.rshah.org/5F8417/${user.username}`}
                      alt={`${user.name}'s GitHub contributions`}
                      style={{
                        maxWidth: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>)}


            </div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-8">
        <h2 className="text-2xl font-bold mb-4">
          Get to know me <ArrowDown strokeWidth={2} className="inline" />
        </h2>

        {isUserDataLoading || !user ? (
          <AboutSkeleton />
        ) : (
          <div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className={"flex flex-col gap-4 flex-1"}>
              
                <div className="bg-white rounded-xl p-6 border-1 border-black border-b-4">
                  <h2 className="text-xl font-bold mb-4">💻 Languages</h2>
                  <div className="flex flex-wrap gap-3">
                    {userProjects?.top_languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 rounded-lg border-black"
                      >
                        {language[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-[#B9FF66] rounded-xl p-6 border-1 border-black border-b-4 flex-1">
                    <h3 className="font-bold mb-2">Issue Closed</h3>
                    <p className="text-2xl font-bold">1</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 border-1 border-black border-b-4 flex-1">
                    <h3 className="font-bold mb-2">PR Merged</h3>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>
              </div>

              <div className={"flex flex-col gap-4"}>
                <div className="bg-white rounded-xl p-6 border-1 border-black border-b-4">
                  <h2 className="text-xl font-bold mb-4">🤔 About</h2>
                  <p className="text-gray-700">
                    {user?.about ||
                      "Here's a professional profile summary that incorporates unique details from your profile: As a seasoned full-stack developer, I leverage my expertise in programming languages such as TypeScript, C, and JavaScript to drive business growth and innovation. With over 29 followers and 81 public repositories, I have established a strong online presence and contributed significantly to the developer community. Currently, I'm learning web development, blockchain, and Data Structures and Algorithms (DSA) to stay ahead of the curve. I'm excited to collaborate with like-minded professionals and tackle exciting projects. You can reach me on LinkedIn or Twitter, or email me at nayanprasad096@gmail.com."}
                  </p>
                </div>

                <div className="bg-[#B9FF66] rounded-xl p-6 border-1 border-black border-b-4 col-span-2">
                  <h2 className="text-xl font-bold mb-2">📍 Location</h2>
                  <p>{user?.location || "Kochi"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>

          {isUserLinkedInDataLoading || !linkedInData ? (
            <TimelineSkeleton />
          ) : (
            linkedInData &&
            linkedInData.experience.length > 0 && (
             <>
                 <h2 className="text-2xl font-bold mb-8">
            Experience <ArrowDown strokeWidth={2} className="inline" />
          </h2>
               <Timeline
                items={transformLinkedInData(linkedInData.experience)}
                backgroundColor="bg-[#B9FF66]"
              />
             </>
            )
          )}
        </div>

        <div>

          {isUserLinkedInDataLoading || !linkedInData ? (
            <TimelineSkeleton />
          ) : (
            linkedInData &&
            linkedInData.education.length > 0 && (
                <>
                 <h2 className="text-2xl font-bold mb-8">
            Education <ArrowDown strokeWidth={2} className="inline" />
          </h2>
                <Timeline
                items={transformLinkedInData(linkedInData.education)}
                backgroundColor="bg-white"
              />
                </>

            )
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">
            Projects <ArrowDown strokeWidth={2} className="inline" />
          </h2>
          {isUserProjectsLoading ? (
            <ProjectListSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProjects?.top_projects.map((project) => (
                <ProjectCard key={project.name} {...project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
