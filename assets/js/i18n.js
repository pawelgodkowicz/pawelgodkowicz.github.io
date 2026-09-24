/**
 * Translation catalogue.
 *
 * Every user-facing string lives here — the markup only carries keys
 * (`data-i18n="hero.greeting"`), never duplicated copy. To add a language,
 * append a locale object with the same key structure and list its code in
 * `SUPPORTED_LOCALES`.
 */

export const SUPPORTED_LOCALES = ['en', 'pl'];
export const DEFAULT_LOCALE = 'en';

export const translations = {
  en: {
    meta: {
      title: 'Paweł Godkowicz — Data Analyst',
      description:
        'Data analyst with 5 years of experience in data processing at every scale, automation and building pipelines for the transport and infrastructure sector.',
    },
    a11y: {
      skipToContent: 'Skip to content',
      socialNav: 'Social profiles',
      sectionNav: 'Sections',
    },
    header: {
      role: 'Data Professional',
      linkedin: 'LinkedIn profile',
      github: 'GitHub profile',
      copyEmail: 'Copy email address',
      language: 'Switch language',
    },
    hero: {
      greeting: 'Hello!',
      intro: 'My name is Paweł, nice to meet you.',
      description:
        'I work as a data analyst and I genuinely enjoy what I do. This is my little corner of the web, so welcome and make yourself at home.',
      toggleMenu: 'Toggle navigation menu',
      portraitAlt: 'Portrait of Paweł Godkowicz',
    },
    nav: {
      about: 'About Me',
      resume: 'Resume',
      contact: 'Contact',
    },
    about: {
      title: 'About Me',
      lead: 'Data analyst with 5 years of experience in data processing — at both smaller and larger scale — automation and building pipelines in a transport planning team.',
      python:
        "I work primarily with Python — whether it's building large-scale pipelines processing millions of records, running quick ad-hoc analyses, or automating repetitive tasks to save time and reduce errors.",
      education:
        "I hold a Master's in Finance, a Bachelor's in Mathematics, and a postgraduate degree in Big Data. Constantly learning and expanding my toolkit to stay ahead of the curve.",
      sharing:
        'Outside of work, I share what I learn — I maintain educational repositories on GitHub and have delivered Python training for my colleagues.',
    },
    toolbox: {
      title: 'Toolbox',
      intro:
        'The stack I work with day to day spans data analysis, data science, big data and data engineering. Some of it I use professionally, some I develop on my own — in personal projects and while learning new technologies.',
    },
    hobbies: {
      title: 'Interests & Hobbies',
      crossfit: {
        title: 'CrossFit',
        alt: 'Athlete training with a barbell',
        body: 'CrossFit is a fixed part of my week. I like the variety of the workouts, the work on strength and conditioning, and the fact that every session is a chance to improve on the last one.',
      },
      outdoor: {
        title: 'Mountains, Cycling & Walks',
        alt: 'Mountain trail at sunrise',
        body: 'In my free time I gravitate towards being outdoors. I enjoy mountain trips, walks and cycling. It is a good way for me to rest, change the scenery and get away from sitting at a computer all day.',
      },
      games: {
        title: 'Books & Board Games',
        alt: 'Books stacked on a shelf',
        body: 'I also like reading and spending time with friends. When a larger group gets together we often reach for board games — from light, easy-going ones to those that call for a bit more strategy and scheming.',
      },
    },
    resume: {
      title: 'The CV is password protected',
      prompt: 'Enter the password to open it. If you do not have one, get in touch and I will send it over.',
      passwordLabel: 'Password',
      submit: 'Open CV',
      cancel: 'Cancel',
      working: 'Decrypting…',
      wrongPassword: 'That password is not right.',
      loadFailed: 'Could not load the file. Check your connection and try again.',
      unsupported: 'This browser cannot decrypt the file. Try a current Chrome, Firefox or Safari.',
      ready: 'Done — the CV should have opened in a new tab.',
      openManually: 'Open the CV',
    },
    contact: {
      title: 'Reach Out',
      copy: 'Copy email address',
      copied: 'Copied!',
      copyFailed: 'Copy failed — select the address manually.',
    },
    footer: {
      rights: '© 2026 Paweł Godkowicz. All rights reserved.',
    },
  },

  pl: {
    meta: {
      title: 'Paweł Godkowicz — Analityk Danych',
      description:
        'Analityk danych z 5-letnim doświadczeniem w przetwarzaniu danych w różnej skali, automatyzacji i tworzeniu pipeline’ów dla sektora transportu i infrastruktury.',
    },
    a11y: {
      skipToContent: 'Przejdź do treści',
      socialNav: 'Profile społecznościowe',
      sectionNav: 'Sekcje',
    },
    header: {
      role: 'Specjalista ds. danych',
      linkedin: 'Profil LinkedIn',
      github: 'Profil GitHub',
      copyEmail: 'Skopiuj adres e-mail',
      language: 'Zmień język',
    },
    hero: {
      greeting: 'Cześć!',
      intro: 'Mam na imię Paweł, miło mi cię poznać.',
      description:
        'Pracuję jako analityk danych i naprawdę lubię to, co robię. To moje małe miejsce w sieci, więc witaj i rozgość się.',
      toggleMenu: 'Rozwiń menu nawigacji',
      portraitAlt: 'Zdjęcie portretowe Pawła Godkowicza',
    },
    nav: {
      about: 'O mnie',
      resume: 'CV',
      contact: 'Kontakt',
    },
    about: {
      title: 'Poznajmy się',
      lead: 'Analityk danych z 5-letnim doświadczeniem w przetwarzaniu danych — zarówno na mniejszą, jak i większą skalę — automatyzacji oraz tworzeniu pipeline’ów w zespole planowania transportu.',
      python:
        'Pracuję głównie z Pythonem — czy to budując wielkoskalowe pipeline’y przetwarzające miliony rekordów, przeprowadzając szybkie analizy ad-hoc, czy automatyzując powtarzalne zadania, by oszczędzać czas i redukować błędy.',
      education:
        'Posiadam tytuł magistra finansów, licencjata matematyki oraz studia podyplomowe z Big Data. Nieustannie uczę się i rozwijam swój warsztat, by być o krok przed zmianami.',
      sharing:
        'Poza pracą dzielę się tym, czego się uczę — prowadzę repozytoria edukacyjne na GitHubie i prowadziłem szkolenie z Pythona dla współpracowników.',
    },
    toolbox: {
      title: 'Toolbox',
      intro:
        'Stack, z którym pracuję na co dzień, obejmuje narzędzia z obszaru analizy danych, data science, big data i inżynierii danych. Część wykorzystuję zawodowo, część rozwijam samodzielnie — w projektach własnych i przy nauce nowych technologii.',
    },
    hobbies: {
      title: 'Pasje i zainteresowania',
      crossfit: {
        title: 'CrossFit',
        alt: 'Sportowiec trenujący ze sztangą',
        body: 'CrossFit jest stałym elementem mojego tygodnia. Lubię różnorodność treningów, pracę nad siłą i kondycją oraz to, że każdy trening daje możliwość poprawienia czegoś względem poprzedniego.',
      },
      outdoor: {
        title: 'Góry, rower i spacery',
        alt: 'Górski szlak o wschodzie słońca',
        body: 'W wolnym czasie najchętniej wybieram aktywność na świeżym powietrzu. Lubię górskie wycieczki, spacery i jazdę na rowerze. To dla mnie dobry sposób na odpoczynek, zmianę otoczenia i oderwanie się od codziennego siedzenia przed komputerem.',
      },
      games: {
        title: 'Książki i gry planszowe',
        alt: 'Książki ułożone na półce',
        body: 'W wolnym czasie lubię również czytać książki i spędzać czas ze znajomymi. Kiedy spotykamy się w większym gronie, często sięgamy po gry planszowe — od prostych i luźnych gier po takie, które wymagają trochę więcej strategii i kombinowania.',
      },
    },
    resume: {
      title: 'CV zabezpieczone hasłem',
      prompt: 'Podaj hasło, aby je otworzyć. Jeśli go nie masz, napisz do mnie — prześlę je.',
      passwordLabel: 'Hasło',
      submit: 'Otwórz CV',
      cancel: 'Anuluj',
      working: 'Odszyfrowuję…',
      wrongPassword: 'To hasło się nie zgadza.',
      loadFailed: 'Nie udało się wczytać pliku. Sprawdź połączenie i spróbuj ponownie.',
      unsupported: 'Ta przeglądarka nie odszyfruje pliku. Użyj aktualnego Chrome, Firefoksa lub Safari.',
      ready: 'Gotowe — CV powinno otworzyć się w nowej karcie.',
      openManually: 'Otwórz CV',
    },
    contact: {
      title: 'Skontaktuj się',
      copy: 'Kopiuj adres e-mail',
      copied: 'Skopiowano!',
      copyFailed: 'Nie udało się skopiować — zaznacz adres ręcznie.',
    },
    footer: {
      rights: '© 2026 Paweł Godkowicz. Wszelkie prawa zastrzeżone.',
    },
  },
};

/**
 * Resolves a dotted key path ("hobbies.crossfit.title") against a locale.
 * Returns `null` when the key is missing so callers can leave the markup
 * fallback in place instead of rendering "undefined".
 */
export function translate(locale, path) {
  const table = translations[locale] ?? translations[DEFAULT_LOCALE];
  const value = path.split('.').reduce((node, key) => (node == null ? node : node[key]), table);
  return typeof value === 'string' ? value : null;
}
