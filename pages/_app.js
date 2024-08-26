// pages/_app.js
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
