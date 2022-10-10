/** @jsx h */
import fs from 'node:fs';

type Unit = string;
type Attrs = { [key: string]: string | number };
type H = (tag: string | ((attrs?: Attrs, ...children: string[]) => Unit), attrs?: Attrs, ...children: string[]) => Unit;
const h: H = (tag, attrs?, ...children) =>
  typeof tag === 'function'
    ? tag(attrs, ...children)
    : `<${tag}${Object.entries(attrs || {}).reduce((a, [v, k]) => `${a} ${v}="${k}"`, '')}>${children.join(
        ''
      )}</${tag}>`;

type Basics = {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    countryCode: string;
    region: string;
  };
  profiles: {
    url: string;
    network: string;
    username: string;
  }[];
};
type Work = {
  name: string;
  location: string;
  description: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
};
type Education = {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
};
type Skill = {
  name: string;
  level: string;
  keywords: string[];
};
type Language = {
  fluency: string;
  language: string;
};
type Reference = {
  reference: string;
  name: string;
};
type Resume = {
  basics: Basics;
  work: Work[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  references: Reference[];
};

const Basics = (resume: Resume): Unit => (
  <header class="header">
    <h1>{resume.basics.name}</h1>
    <img src={resume.basics.image} alt={resume.basics.name} title={resume.basics.name} />
  </header>
);

const Summary = (resume: Resume): Unit => (
  <article class="article">
    <h2>{resume.basics.label}</h2>
    <p>{resume.basics.summary}</p>
  </article>
);

const Details = (resume: Resume): Unit => (
  <article class="article">
    <h2>Details</h2>
    <ul class="double">
      <li>
        Location: {resume.basics.location.city}, {resume.basics.location.region}
      </li>
      <li>
        <span>Email: </span>
        <a href={`mailto:${resume.basics.email}`} rel="noopener noreferrer">
          {resume.basics.email}
        </a>
      </li>
      <li>
        <span>Website: </span>
        <a href={resume.basics.url} target="_blank" rel="noopener noreferrer">
          {resume.basics.url}
        </a>
      </li>
      {resume.basics.profiles
        .map((profile) => (
          <li>
            {profile.network}:{' '}
            <a href={profile.url} target="_blank" rel="noopener noreferrer">
              {profile.username}
            </a>
          </li>
        ))
        .join('')}
    </ul>
  </article>
);

const Work = (resume: Resume): Unit => (
  <article class="article">
    <h2>Employment History</h2>
    <ul class="list">
      {resume.work
        .map((work) => (
          <li>
            <h3>
              <span>
                <span>{work.position} at </span>
                {work.url ? (
                  <a href={work.url} target="_blank" rel="noopener noreferrer">
                    {work.name}
                  </a>
                ) : (
                  <span>{work.name}</span>
                )}
              </span>
              <time>
                , {work.startDate} — {work.endDate ? work.endDate : 'Now'}
              </time>
            </h3>
            <p>{work.summary}</p>
            <ul>{work.highlights.map((highlight) => <li>{highlight}</li>).join('')}</ul>
          </li>
        ))
        .join('')}
    </ul>
  </article>
);

const Education = (resume: Resume): Unit => (
  <article class="article">
    <h2>Education</h2>
    <ul class="list">
      {resume.education
        .map((education) => (
          <li>
            <h3>
              <span>
                <span>{education.studyType} at </span>
                {education.url ? (
                  <a href={education.url} target="_blank" rel="noopener noreferrer">
                    {education.institution}
                  </a>
                ) : (
                  <span>{education.institution}</span>
                )}
              </span>
              <time>
                , {education.startDate} — {education.endDate ? education.endDate : 'Now'}
              </time>
            </h3>
            <p>{education.area}</p>
          </li>
        ))
        .join('')}
    </ul>
  </article>
);

const Skills = (resume: Resume): Unit => (
  <article class="article">
    <h2>Skills</h2>
    <ul class="list double">
      {resume.skills
        .map((skill) => (
          <li>
            <h3>{skill.name}</h3>
            <p>{skill.keywords.join(', ')}</p>
          </li>
        ))
        .join('')}
    </ul>
  </article>
);

const Languages = (resume: Resume): Unit => (
  <article class="article">
    <h2>Languages</h2>
    <ul class="list double">
      {resume.languages
        .map((language) => (
          <li>
            <h3>{language.language}</h3>
            <p>{language.fluency}</p>
          </li>
        ))
        .join('')}
    </ul>
  </article>
);
const References = (resume: Resume): Unit =>
  resume.references?.length ? (
    <article class="article">
      <h2>References</h2>
      <ul class="list">
        {resume.references
          .map((reference) => (
            <li>
              <h3>{reference.name}</h3>
              <p>{reference.reference}</p>
            </li>
          ))
          .join('')}
      </ul>
    </article>
  ) : null;

const render = (resume: Resume): string =>
  '<!doctype html>' +
  (
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta http-equiv="x-ua-compatible" content="ie=edge"/>
        <meta name="viewport" content="width=768"/>
        <style>{fs.readFileSync('./index.css', 'utf-8')}</style>
      </head>
      <body>
        <main class="layout">
          <Basics {...resume} />
          <Summary {...resume} />
          <Details {...resume} />
          <Skills {...resume} />
          <Work {...resume} />
          <Education {...resume} />
          <Languages {...resume} />
          <References {...resume} />
        </main>
      </body>
    </html>
  );

export { render };
