import useParallax from '../../../hooks/useParallax';
import './SiteBackdrop.css';

// Desktop/tablet gets the wide 16:9 crop; phones get the 9:16 crop (see the
// <picture> element below) so the subject stays centered instead of being
// cropped toward an edge on a narrow screen.
const BACKDROP_DESKTOP = '/hero-portrait.jpg';
const BACKDROP_MOBILE = '/hero-portrait-mobile.jpg';

// Rendered once, at the top of the page (see App.jsx), behind everything
// else. Unlike the old Hero-scoped version, this is position:fixed — it
// never scrolls, so it reads as the page's actual background rather than
// something that belongs to one section. Sections after Hero (starting with
// About) layer an increasingly opaque background over it as you scroll, so
// it fades out of view naturally instead of needing its own scroll-linked
// opacity logic.
export default function SiteBackdrop() {
  const parallaxRef = useParallax();

  return (
    <div className="site-backdrop" aria-hidden="true">
      <picture>
        <source media="(max-width: 639px)" srcSet={BACKDROP_MOBILE} />
        <img ref={parallaxRef} src={BACKDROP_DESKTOP} alt="" className="site-backdrop__image" />
      </picture>
      <div className="site-backdrop__scrim" />
    </div>
  );
}
