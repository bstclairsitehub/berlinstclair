'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// react-pageflip requires browser Canvas API - must be client-only (ssr: false)
const HTMLFlipBook = dynamic(
  () => import('react-pageflip').then((m) => m.default),
  { ssr: false }
);

interface FlipPage {
  headline: string;
  body: string;
  image?: string;
}

interface PageFlipReaderProps {
  pages: FlipPage[];
}

// ---------- Sub-page components ----------

function CoverPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full h-full bg-dp-bg text-white flex flex-col items-center justify-center px-10 py-12 select-none">
      {/* Decorative double rule */}
      <div className="w-full border-t-2 border-white mb-1" />
      <div className="w-full border-t border-white mb-10" />

      <p className="font-sans text-xs uppercase tracking-widest text-white/70 mb-3">
        Special Edition
      </p>

      <h1 className="font-masthead text-6xl text-white text-center leading-none mb-4">
        The Daily Gay
      </h1>

      <div className="w-12 border-t border-white/70 my-5" />

      <p className="font-body text-sm italic text-white/75 text-center mb-6">{today}</p>

      <p className="font-body text-xs text-white/70 text-center uppercase tracking-widest">
        All the News That&rsquo;s Fit to Read
      </p>

      <div className="w-full border-t border-white mt-10 mb-1" />
      <div className="w-full border-t-2 border-white" />
    </div>
  );
}

function ContentPage({ page, pageNumber }: { page: FlipPage; pageNumber: number }) {
  return (
    <div className="w-full h-full bg-dp-surface border border-dp-border flex flex-col overflow-hidden select-none">
      {/* Page header */}
      <div className="border-b border-dp-border px-6 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
        <span className="font-sans text-xs uppercase tracking-widest text-dp-text-muted">
          The Daily Gay
        </span>
        <span className="font-sans text-xs text-dp-text-muted">{pageNumber}</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3">
        {/* Optional image */}
        {page.image && (
          <div className="w-full h-36 overflow-hidden flex-shrink-0 border border-dp-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.image}
              alt={page.headline}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Headline */}
        <h2 className="font-headline text-xl text-dp-text leading-tight tracking-tight border-b border-dp-border pb-2 flex-shrink-0">
          {page.headline}
        </h2>

        {/* Body text in two-column layout for newspaper feel */}
        <div
          className="font-body text-dp-text leading-relaxed flex-1 overflow-hidden"
          style={{
            fontSize: '0.7rem',
            lineHeight: '1.6',
            columns: 2,
            columnGap: '1rem',
            columnRule: '1px solid #DFDFDF',
          }}
        >
          <p>{page.body.slice(0, 800)}{page.body.length > 800 ? '\u2026' : ''}</p>
        </div>
      </div>

      {/* Page footer */}
      <div className="border-t border-dp-border px-6 py-2 flex-shrink-0">
        <p className="font-sans text-xs text-dp-text-secondary uppercase tracking-widest text-center">
          Continued &rarr;
        </p>
      </div>
    </div>
  );
}

function BackCover() {
  return (
    <div className="w-full h-full bg-dp-bg text-white flex flex-col items-center justify-center px-10 select-none">
      <div className="w-full border-t-2 border-white mb-1" />
      <div className="w-full border-t border-white mb-10" />
      <span className="font-masthead text-5xl text-white">The Daily Gay</span>
      <div className="w-12 border-t border-white/70 my-5" />
      <p className="font-body italic text-white/70 text-sm text-center">
        Quality journalism for a better&#x2011;informed world.
      </p>
      <div className="w-full border-t border-white mt-10 mb-1" />
      <div className="w-full border-t-2 border-white" />
    </div>
  );
}

// ---------- Main component ----------

export default function PageFlipReader({ pages }: PageFlipReaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBookRef = useRef<any>(null);

  if (!pages || pages.length === 0) return null;

  const totalPages = pages.length + 2; // cover + content pages + back cover

  const handleFlipNext = () => {
    flipBookRef.current?.pageFlip()?.flipNext();
  };

  const handleFlipPrev = () => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const onFlip = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="w-full border-t-4 border-double border-dp-border-light pt-8 mt-10">
      {/* Toggle button row */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 border-t border-dp-border" />
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest font-semibold border border-dp-border px-5 py-2.5 text-dp-text hover:bg-dp-text hover:text-dp-bg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          {isOpen ? 'Close Flipbook' : 'Read as Flipbook'}
        </button>
        <div className="flex-1 border-t border-dp-border" />
      </div>

      {/* Flipbook reader */}
      {isOpen && (
        <div className="flex flex-col items-center gap-6">
          {/* Page indicator */}
          <p className="font-sans text-xs text-dp-text-muted uppercase tracking-widest">
            Page {currentPage + 1} of {totalPages}
          </p>

          {/* The flipbook itself */}
          <div className="shadow-2xl overflow-hidden">
            <HTMLFlipBook
              ref={flipBookRef}
              width={550}
              height={733}
              size="fixed"
              minWidth={300}
              maxWidth={550}
              minHeight={400}
              maxHeight={733}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onFlip}
              className="nyt-flipbook"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={700}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {/* Cover page */}
              <div>
                <CoverPage />
              </div>

              {/* Content pages */}
              {pages.map((page, index) => (
                <div key={index}>
                  <ContentPage page={page} pageNumber={index + 2} />
                </div>
              ))}

              {/* Back cover */}
              <div>
                <BackCover />
              </div>
            </HTMLFlipBook>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleFlipPrev}
              disabled={currentPage === 0}
              className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest font-semibold border border-dp-border px-4 py-2 text-dp-text hover:bg-dp-text hover:text-dp-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev
            </button>

            <span className="font-sans text-xs text-dp-text-muted uppercase tracking-widest select-none">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              type="button"
              onClick={handleFlipNext}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest font-semibold border border-dp-border px-4 py-2 text-dp-text hover:bg-dp-text hover:text-dp-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
