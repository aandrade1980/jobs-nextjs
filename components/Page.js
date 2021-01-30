import React from 'react';
import { NextSeo } from 'next-seo';

const Page = ({ name, path, children }) => {
  const title = `Jobs Post – ${name}`;
  const url = `https://jobs-ten.vercel.app${path}`;

  return (
    <>
      <NextSeo title={title} canonical={url} />
      {children}
    </>
  );
};

export default Page;
