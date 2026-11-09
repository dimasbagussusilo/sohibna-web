import type { LegalContent } from './index'

// English — mirrors the authoritative Bahasa Indonesia text section-for-section.

export const content: LegalContent = {
  privacy: {
    title: 'Privacy Policy',
    metaDescription:
      'How Sohibna collects, uses, and protects your data — no ads, no trackers, no data selling.',
    updatedLabel: 'Last updated',
    updated: 'November 9, 2026',
    backHome: 'Back to Home',
    sections: [
      {
        h: 'Who we are',
        p: [
          'Sohibna is an Islamic worship and learning companion app developed by PT. FRAME DIGITAL SOLUSINDO ("we", "us"). This policy explains what data we process when you use the Sohibna app and website, and the rights you have over that data.',
        ],
      },
      {
        h: 'Your account data',
        p: [
          'When you create an account we store your name, email address, and password. Passwords are always stored as a one-way hash — we cannot read them.',
          'If you sign in with Google, authentication is handled through Firebase Authentication; we receive your Google account email and name. Your email is used for account verification and password recovery.',
        ],
      },
      {
        h: 'Your worship and activity data',
        p: [
          'To provide the reading, memorization, and progress features, we store the data you create in the app: bookmarks and favorite verses, labels, last-read positions, Quran-reading goals and their progress, memorization targets and per-verse memorization status, review queue, daily reflection notes and moods, AI conversations you choose to save, and your app preferences and settings.',
          'This data syncs to your account so it is available on all your devices. You are free to skip creating an account — most features work without one.',
        ],
      },
      {
        h: 'Your location',
        p: [
          'Prayer times and the qibla direction are computed on your device. To display city names, coordinates are sent to a third-party geocoding service (BigDataCloud) without any identity attached. We do not store your location history on our servers.',
        ],
      },
      {
        h: 'Our AI features',
        p: [
          'When you use Ask AI, Kitab AI, or Reflection, your question and the conversation context are sent to a third-party language-model service (Groq) to generate an answer, and the book-reference search uses Google\'s embedding service (Gemini).',
          'AI answers can be wrong and are not fatwa — for worship decisions, consult qualified scholars or the appropriate religious authority. A limited sample of questions and answers may be logged on our server for quality assurance and handling of reports.',
        ],
      },
      {
        h: 'Profile photo (optional)',
        p: [
          'If you upload a profile photo, it is stored in our file storage and reachable through a link. Please upload only a photo you are comfortable sharing. You can replace or remove it at any time from your profile page.',
        ],
      },
      {
        h: 'No ads, no trackers',
        p: [
          'Sohibna shows no advertising and includes no third-party analytics SDKs. We do not sell, rent, or trade your data to anyone.',
        ],
      },
      {
        h: 'Third parties',
        p: [
          'To operate the service we work with: hosting and database providers, file storage, the email delivery service (Brevo), Google (Firebase Authentication and Gemini), Groq (the AI model), the BigDataCloud geocoding service, and Google Play if you downloaded the app there. Each processes data only as needed for that function.',
        ],
      },
      {
        h: 'Processing basis and consent',
        p: [
          'Under Indonesia\'s Personal Data Protection Law No. 27 of 2022, we process your data to deliver the service you request and, in part, based on the consent you give when creating an account. You may withdraw that consent by deleting your account.',
        ],
      },
      {
        h: 'Your rights',
        anchor: 'delete',
        p: [
          'You have the right to access, obtain a copy of, correct, and delete your personal data, to restrict its processing, to withdraw consent, and to object.',
          'The fastest way to delete your data: in the app, open the "Me" menu and choose "Delete Account" — all of your synced data is removed from our servers. You can also contact us at support@sohibna.com for any other right, and we will respond within a reasonable time.',
        ],
      },
      {
        h: 'Data retention',
        p: [
          'Data is kept while your account is active. When you delete your account, your synced data is removed from our servers. Copies remaining on your device are cleared when you sign out or uninstall the app.',
        ],
      },
      {
        h: 'Security',
        p: [
          'We take reasonable measures: all traffic is encrypted (HTTPS), passwords are hashed, and access tokens are short-lived. No system is perfect — if you believe you found a security issue, please report it to support@sohibna.com.',
        ],
      },
      {
        h: 'Children',
        p: [
          'Sohibna is not directed at children under 13, and we do not knowingly collect children\'s data. If you are a parent or guardian and believe your child created an account unsupervised, please contact us.',
        ],
      },
      {
        h: 'Policy changes and contact',
        p: [
          'If this policy changes, we update the date above and announce it on this page. Questions can be sent to support@sohibna.com.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    metaDescription:
      'The terms of use for the Sohibna app — an Islamic worship and learning companion by PT. FRAME DIGITAL SOLUSINDO.',
    updatedLabel: 'Last updated',
    updated: 'November 9, 2026',
    backHome: 'Back to Home',
    sections: [
      {
        h: 'Acceptance of these terms',
        p: [
          'By downloading, accessing, or using the Sohibna app and services, you agree to these Terms of Service together with our Privacy Policy. If you do not agree, please stop using the service.',
        ],
      },
      {
        h: 'About the Sohibna service',
        p: [
          'Sohibna is an Islamic worship and learning companion: reading and memorizing the Qur\'an, prayer times, qibla direction, Hijri calendar, dhikr, prayer and iqro learning, and AI-assisted discussion of Islamic literature.',
          'The service is provided "as is". We strive to keep content accurate, but do not guarantee it is free of errors or interruptions.',
        ],
      },
      {
        h: 'Not a fatwa',
        p: [
          'AI answers and learning materials in Sohibna are reference aids for education — not fatwa and not binding religious-legal advice. For worship decisions and matters of fiqh, consult qualified scholars or the appropriate religious authority. Differences of opinion (ikhtilaf) between schools of thought may exist.',
        ],
      },
      {
        h: 'Your account',
        p: [
          'You are responsible for keeping your password confidential and for all activity through your account. Provide accurate information when creating an account. If you become aware of unauthorized use of your account, contact us promptly.',
        ],
      },
      {
        h: 'Fair use',
        p: [
          'You agree not to: misuse the service, transmit content that violates law or public decency, overload the servers including through automation, or attempt to access systems or other people\'s data without authorization.',
        ],
      },
      {
        h: 'Your content',
        p: [
          'Content you create (bookmarks, notes, memorization records, reflections, conversations you save) remains yours. For the service to work, you grant us a limited license to store, process, and display that content back to you across your devices.',
        ],
      },
      {
        h: 'Intellectual property',
        p: [
          'The app, the Sohibna brand, and its source code are owned by PT. FRAME DIGITAL SOLUSINDO. Qur\'an text, translations, and commentaries belong to their respective publishers and institutions and are displayed with the attribution attached to them.',
        ],
      },
      {
        h: 'Voluntary support',
        p: [
          'The "Support Us" feature lets you give voluntary support toward the app\'s operations. Support unlocks no features, content, or privileges, and amounts received are non-refundable except where required by applicable law.',
        ],
      },
      {
        h: 'Paid features in the future',
        p: [
          'If we later offer a paid subscription (for example Sohibna+), transactions will be processed through Google Play Billing and subject to Google Play\'s terms. The core worship features — the Qur\'an, prayer times, adhan, qibla — remain free.',
        ],
      },
      {
        h: 'Changes and discontinuation',
        p: [
          'We may change, add, reduce, or discontinue any part or all of the service at any time with reasonable notice. You may stop using Sohibna at any time, including by deleting your account from within the app.',
        ],
      },
      {
        h: 'Governing law and disputes',
        p: [
          'These terms are governed by the law of the Republic of Indonesia. Disputes will first be pursued through mutual consultation; failing that, resolution is through the competent courts of Indonesia.',
        ],
      },
      {
        h: 'Google Play users',
        p: [
          'If you downloaded Sohibna from Google Play: these Terms do not limit any rights Google grants you, and disputes related to distribution through the Play Store are subject to the Google Play terms. Contact us: support@sohibna.com.',
        ],
      },
    ],
  },
}
