import { Helmet } from "react-helmet-async";
import PageShell from "../components/PageShell";
import ElectronicsSticker from "../components/ElectronicsSticker";
import PartsBin from "../components/PartsBin";
import ProfileCard from "../components/ProfileCard";
import { site } from "../content/site";

export default function AboutPage() {
  const labels = site.content.labels;

  return (
    <>
      <Helmet>
        <title>About | Yash Gulati</title>
        <meta name="description" content={`About ${site.identity.name}`} />
        <link rel="canonical" href="https://yashgulati.tech/about" />
      </Helmet>
      <PageShell activeRoute="about">
        <section className="notebook-section">
          <div className="section-heading">
            <h2>About</h2>
            <ElectronicsSticker
              kind="resistor"
              note={site.stickers.find((s) => s.kind === "resistor")?.note ?? ""}
            />
          </div>

          {site.about.story && Array.isArray(site.about.story) && site.about.story.length > 0 && (
            <div className="about-story">
              {site.about.story.map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {site.education.length > 0 && (
            <ProfileCard title={labels.aboutEducation}>
              {site.education.map((item) => (
                <div className="fact-row" key={`${item.degree}-${item.school}`}>
                  <strong>{item.degree}</strong>
                  <p>{item.school}</p>
                  {item.years && <p>{item.years}</p>}
                  {item.coursework && item.coursework.length > 0 && (
                    <p>
                      <strong>Coursework:</strong> {item.coursework.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </ProfileCard>
          )}

          {site.internship && (site.internship.org || site.internship.points) && (
            <ProfileCard title={labels.internshipLabel}>
              {site.internship.org && (
                <p>
                  <strong>{labels.organization}:</strong> {site.internship.org}
                </p>
              )}
              {site.internship.program && (
                <p>
                  <strong>{labels.program}:</strong> {site.internship.program}
                </p>
              )}
              {site.internship.title && (
                <p>
                  <strong>{labels.role}:</strong> {site.internship.title}
                </p>
              )}
              {site.internship.dates && (
                <p>
                  <strong>{labels.dates || 'Dates'}:</strong> {site.internship.dates}
                </p>
              )}
              {site.internship.points && site.internship.points.length > 0 && (
                <ul>
                  {site.internship.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </ProfileCard>
          )}

          {site.certifications.length > 0 && (
            <ProfileCard title={labels.certHeading}>
              <div className="cert-strips">
                {site.certifications.map((cert) => (
                  <div className="cert-strip" key={cert.name}>
                    <strong>{cert.name}</strong>
                    {cert.issuer && <span>, {cert.issuer}</span>}
                    {cert.year && <span>, {cert.year}</span>}
                  </div>
                ))}
              </div>
              {site.nextCerts && <p className="margin-note">{site.nextCerts}</p>}
            </ProfileCard>
          )}

          {site.skillGroups && site.skillGroups.length > 0 && (
            <PartsBin />
          )}

          <div className="education-note">
            <p>
              <span>{site.education[0]?.degree}</span> {site.education[0]?.school}
            </p>
          </div>
        </section>
      </PageShell>
    </>
  );
}
