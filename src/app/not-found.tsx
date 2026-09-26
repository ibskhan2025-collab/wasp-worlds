import Link from "next/link";

export default function NotFound() {
  return (
    <div className="opening">
      <h1>THIS ROOM DOESN&apos;T EXIST.</h1>
      <p className="sub">404</p>
      <Link className="enter" href="/" style={{ display: "inline-block" }}>
        Exhibition
      </Link>
    </div>
  );
}
