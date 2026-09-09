import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="theme-color" content="#8B0000" />
        <title>{SITE_NAME}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
