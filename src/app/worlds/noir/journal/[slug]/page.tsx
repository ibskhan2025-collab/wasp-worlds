import Link from "next/link";
import { notFound } from "next/navigation";
import { noirJournal } from "@/data/noir";

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = noirJournal.find((j) => j.slug === slug);
  if (!article) notFound();
  return (
    <article style={{ padding: "40px 24px 80px", maxWidth: 680 }}>
      <Link href="/worlds/noir/journal" className="kicker">
        ← Journal
      </Link>
      <h1 style={{ fontSize: "clamp(2.6rem, 6vw, 4.4rem)", fontWeight: 500 }}>{article.title}</h1>
      <p className="kicker">{article.date}</p>
      {article.body.map((p) => (
        <p key={p} style={{ fontSize: "1.2rem" }}>
          {p}
        </p>
      ))}
    </article>
  );
}
