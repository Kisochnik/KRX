"use client";

import { useState } from "react";
import { Image as ImageIcon, Radio, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";
import { StoriesRow } from "@/components/feed/stories-row";
import { PostCard } from "@/components/feed/post-card";
import { feedPosts } from "@/lib/mock-feed";
import type { FeedTab } from "@/types/feed";

const tabs: FeedTab[] = ["For You", "Following", "KRX Live"];

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState<FeedTab>("For You");
  const [composerOpen, setComposerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0 pb-24 lg:pb-0">
        <Navbar onCreatePost={() => setComposerOpen(true)} />
        <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-[minmax(0,680px)_280px]">
          <section className="min-w-0 space-y-5">
            <StoriesRow />
            <div className="grid grid-cols-3 rounded-md border border-[#2a2a2a] bg-[#0b0b0b] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`h-10 rounded-md text-sm font-bold transition ${
                    activeTab === tab
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#0b0b0b] p-4 text-left transition hover:border-white/60"
              onClick={() => setComposerOpen(true)}
            >
              <Avatar name="You" tone="line" />
              <span className="min-w-0 flex-1 text-sm text-neutral-500">
                Create the future.
              </span>
              <ImageIcon className="h-4 w-4 text-neutral-400" />
              <Video className="h-4 w-4 text-neutral-400" />
            </button>
            <div className="space-y-5">
              {feedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
          <aside className="hidden space-y-8 border-l border-[#2a2a2a] pl-6 lg:block">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <h2 className="text-sm font-black uppercase text-white">
                  KRX Live
                </h2>
              </div>
              <div className="space-y-4 text-sm">
                {["Creator room", "Night market", "Design stream"].map((item, index) => (
                  <div key={item} className="border-b border-[#2a2a2a] pb-4">
                    <p className="font-semibold text-white">{item}</p>
                    <p className="mt-1 text-neutral-500">{(index + 2) * 4}.2K watching</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="mb-4 text-sm font-black uppercase text-white">
                Pulse
              </h2>
              <div className="space-y-3 text-sm text-neutral-400">
                <p>Feed stability 99.98%</p>
                <p>Anti spam active</p>
                <p>Realtime layer queued</p>
              </div>
            </section>
          </aside>
        </main>
      </div>
      <Modal open={composerOpen} title="Create post" onClose={() => setComposerOpen(false)}>
        <div className="space-y-4">
          <textarea
            className="min-h-32 w-full resize-none rounded-md border border-[#2a2a2a] bg-[#0b0b0b] p-3 text-sm text-white outline-none transition focus:border-white"
            placeholder="Create the future."
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2 text-neutral-400">
              <Button type="button" variant="secondary" size="icon" title="Image" aria-label="Image">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button type="button" variant="secondary" size="icon" title="Video" aria-label="Video">
                <Video className="h-4 w-4" />
              </Button>
            </div>
            <Button type="button" onClick={() => setComposerOpen(false)}>
              Publish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
