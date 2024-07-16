import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";


export default function App({ Component, pageProps }) {
  return <div className="text-black bg-white">
  <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
  <Component {...pageProps} />
</div>;;
}
