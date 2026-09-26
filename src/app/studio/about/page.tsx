import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="studio-page">
      <p className="kicker">About</p>
      <h1 className="display">A studio that would rather you use the work than believe a paragraph about it.</h1>
      <p className="lede">
        WASP is independent. We design and build websites, stores, products, and the occasional unjustified experiment.
      </p>
      <hr className="rule" />
      <div className="grid-2">
        <p>
          The name is not a metaphor we will over-explain. It is short, slightly unfriendly, and easy to say in a room.
        </p>
        <p>
          We sound confident because the work is supposed to be. We sound brief because most agency copy is a hostage situation.
        </p>
      </div>
      <p style={{ marginTop: 24 }}>
        Websites are too small a word. If you want a brochure, there are templates. If you want a place, <Link href="/start">start here</Link>.
      </p>
    </div>
  );
}
