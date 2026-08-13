"use client";

import { Eye, Heart } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

function ConfiguredArticleEngagement({ slug, initialViews = 0, initialLikes = 0 }) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let id = sessionStorage.getItem("zhuo-view-session");
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("zhuo-view-session", id); }
    fetch(`/api/articles/${slug}/view`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId: id }) })
      .then((response) => response.ok ? response.json() : null).then((data) => { if (data) setViews(data.viewCount); }).catch(() => {});
  }, [slug]);

  async function toggleLike() {
    if (!session) { router.push(`/login?next=${encodeURIComponent(pathname)}#engagement`); return; }
    setPending(true);
    try {
      const response = await fetch(`/api/articles/${slug}/like`, { method: liked ? "DELETE" : "POST" });
      if (response.ok) { const data = await response.json(); setLiked(data.liked); setLikes(data.likeCount); }
    } finally { setPending(false); }
  }

  return <div className="article-engagement" id="engagement"><span><Eye size={19} />观看 {views}</span><button type="button" className={liked ? "liked" : ""} onClick={toggleLike} disabled={pending} aria-pressed={liked}><Heart size={19} weight={liked ? "fill" : "regular"} />{liked ? "已点赞" : "点赞"} {likes}</button></div>;
}

export function ArticleEngagement({ configured = false, ...props }) {
  if (!configured) return <div className="article-engagement" id="engagement"><span><Eye size={19} />观看 {props.initialViews || 0}</span><button type="button" disabled title="云端服务配置后开放"><Heart size={19} />点赞 {props.initialLikes || 0}</button></div>;
  return <ConfiguredArticleEngagement {...props} />;
}
