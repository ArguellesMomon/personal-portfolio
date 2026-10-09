import BrandSpark from './BrandSpark.jsx';
import { Activity, Camera, Check, Cpu, Fingerprint, Heart, MapPin, Sparkles } from 'lucide-react';

// Illustrative project concepts, not screenshots or measured results.
export default function ProjectArtwork({ project, large = false }) {
  if (project.image)
    return (
      <div className={`project-art real-art ${large ? 'art-large' : ''}`}>
        <img
          src={project.image}
          alt={project.imageAlt || project.title}
          loading="lazy"
          width={project.imageWidth}
          height={project.imageHeight}
          style={{ objectPosition: project.imagePosition || 'center' }}
        />
      </div>
    );
  const type = project.id;
  return (
    <div className={`project-art art-${type} ${large ? 'art-large' : ''}`} aria-hidden="true">
      <span className="art-grid" />
      <span className="art-orb orb-one" />
      <span className="art-orb orb-two" />
      {type === 'aedescapella' ? (
        <div className="device-visual">
          <div className="device-top">
            <span>
              <span className="live-dot" /> AedesCapella
            </span>
            <Cpu size={18} />
          </div>
          <div className="waveform">
            {Array.from({ length: 35 }, (_, i) => (
              <i
                key={i}
                style={{ '--wave': `${12 + Math.abs(Math.sin(i * 1.7)) * 48}px`, '--i': i }}
              />
            ))}
          </div>
          <div className="device-bottom">
            <span>ACOUSTIC MONITORING</span>
            <span>ESP32-S3 ↗</span>
          </div>
          <div className="sensor-chip">
            <Activity size={15} /> Listen. Detect. Respond.
          </div>
        </div>
      ) : type === 'wellbot' ? (
        <div className="wellbot-visual">
          <div className="app-bar">
            <span className="pip-icon">
              <Sparkles size={17} />
            </span>
            <span>
              Pip<span>Your wellness companion</span>
            </span>
            <i />
          </div>
          <div className="chat-bubble">
            A little pause can go a long way.
            <br />
            How are you feeling today? <Heart size={13} />
          </div>
          <div className="mood-options">
            <span>Taking a breath</span>
            <span>Let’s talk</span>
          </div>
          <div className="chat-input">
            A moment for yourself <span>↑</span>
          </div>
        </div>
      ) : type === 'eventure' ? (
        <div className="phone-visual">
          <div className="phone-notch" />
          <div className="phone-header">
            eventure<span>●</span>
          </div>
          <div className="event-picture">
            <Sparkles size={28} />
            <span>
              Make room for
              <br />
              new experiences.
            </span>
          </div>
          <div className="phone-content">
            <strong>Your next campus event</strong>
            <span>
              <MapPin size={11} /> On campus
            </span>
            <div className="booking-steps">
              <i />
              <i />
              <i />
            </div>
            <div className="phone-cta">
              Reserve your spot <Check size={12} />
            </div>
          </div>
        </div>
      ) : type === 'king-ace-trading' || type === 'node-red-dashboard' ? (
        <div className="chart-visual">
          <div className="app-bar">
            <Activity size={17} />
            <span>{type === 'king-ace-trading' ? 'Demand forecasting' : 'Analytics overview'}</span>
          </div>
          <div className="chart-bars">
            {[28, 45, 36, 62, 52, 72, 65, 88, 78, 95].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="chart-caption">
            {type === 'king-ace-trading'
              ? 'From historical data to informed decisions'
              : 'Connected data. Clearer insights.'}
          </div>
        </div>
      ) : type === 'iris' ? (
        <div className="iris-visual">
          <div className="scan-corner" />
          <Fingerprint size={76} strokeWidth={1} />
          <span>IRIS</span>
          <small>Facial recognition · Raspberry Pi</small>
        </div>
      ) : type === 'photobooth' ? (
        <div className="photo-visual">
          <div className="photo-strip">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <Camera size={26} strokeWidth={1.2} />
                <span>
                  <BrandSpark />
                </span>
              </div>
            ))}
            <small>little moments, kept.</small>
          </div>
          <span className="photo-label">
            Offline.
            <br />
            On camera.
          </span>
        </div>
      ) : (
        <div className="diary-visual">
          <MapPin size={30} />
          <span>
            A place for
            <br />
            every memory.
          </span>
          <small>TRAVEL DIARY</small>
        </div>
      )}
      <span className="art-caption">
        {type === 'aedescapella' || type === 'iris' ? 'SYSTEM CONCEPT' : 'INTERFACE CONCEPT'}
      </span>
    </div>
  );
}
