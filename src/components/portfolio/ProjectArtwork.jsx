import { Code2, Cpu, BarChart3, Smartphone, ClipboardCheck } from 'lucide-react';

export default function ProjectArtwork({ project, large = false, cover = false }) {
  const useCover = cover && Boolean(project.coverImage);
  if (project.evidence)
    return (
      <div className={`project-art qa-art ${large ? 'art-large' : ''}`}>
        <ClipboardCheck size={32} strokeWidth={1.4} aria-hidden="true" />
        <span className="eyebrow">QA workbook</span>
        <strong>Test cases & results</strong>
        <small>Unit · Integration · System</small>
      </div>
    );
  if (project.image)
    return (
      <div
        className={`project-art real-art ${project.imageLayout === 'portrait' ? 'portrait-art' : ''} ${project.imageSourceType === 'diagram' ? 'diagram-art' : ''} ${large ? 'art-large' : ''}`}
      >
        <img
          src={useCover ? project.coverImage : project.image}
          alt={(useCover ? project.coverImageAlt : project.imageAlt) || project.title}
          loading="lazy"
          width={useCover ? project.coverImageWidth : project.imageWidth}
          height={useCover ? project.coverImageHeight : project.imageHeight}
          style={{ objectPosition: project.imagePosition || 'top' }}
        />
      </div>
    );
  const Icon =
    { Mobile: Smartphone, 'Embedded/Hardware': Cpu, 'ML/Data': BarChart3 }[project.category] ||
    Code2;
  return (
    <div className={`project-art project-placeholder ${large ? 'art-large' : ''}`}>
      <Icon size={36} strokeWidth={1.4} aria-hidden="true" />
      <small>No public screenshot available</small>
    </div>
  );
}
