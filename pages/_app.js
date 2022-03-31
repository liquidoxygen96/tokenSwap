import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div className="dark:bg-slate-900">
      <div>
        <nav className="border-b p-6">
          <p className="text-white text-4xl font-bold">UmmaSwap</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 text-pink-500">Home</a>
            </Link>
            <Link href="/create-nft">
              <a className="mr-6 text-pink-500">Mint</a>
            </Link>
            <Link href="/my-nfts">
              <a className="mr-6 text-pink-500">My NFTs</a>
            </Link>
            <Link href="/dashboard">
              <a className="mr-6 text-pink-500">Dashboard</a>
            </Link>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
