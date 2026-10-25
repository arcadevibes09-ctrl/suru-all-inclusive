// src/engine/predictFormat.js

const HIGHLIGHT_TRIGGERS = [
  'never',
  'always',
  'immediately',
  '100%',
  'emergency',
  'fatal',
  'bypasses',
  'bypass',
  'strictly',
  'last line of defense',
  'first-line',
  'antidote',
  'priority',
  'life-threatening'
];

const BOX_TRIGGERS = [
  'half-life',
  'half-lives',
  'mg',
  'ml/hr',
  'formula',
  'calculation',
  'clinical pearl',
  'prevent overdosing',
  '4 to 5'
];

// Escapes special regex characters
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function predictTopicData(topicData) {
  if (!topicData || !topicData.text) return topicData;

  // 1. NORMALIZE: Clean up triple braces so the frontend doesn't render stray '{' and '}'
  const normalizedText = topicData.text
    .replace(/\{\{\{/g, '{{')
    .replace(/\}\}\}/g, '}}');

  // IF text already has manual tags ([[, {{, [PAGE]), return it untouched so old data never breaks!
  // We use normalizedText here so the cleaned tags are returned.
  if (
    normalizedText.includes('[[') ||
    normalizedText.includes('{{') ||
    normalizedText.includes('[PAGE]')
  ) {
    return {
      ...topicData,
      text: normalizedText
    };
  }

  const glossary = topicData.glossary || {};
  const rawParagraphs = normalizedText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Build searchable glossary terms
  const glossarySearchList = [];
  Object.keys(glossary).forEach((key) => {
    glossarySearchList.push(key.trim());
    const baseTerm = key.split('(')[0].trim();
    if (baseTerm && baseTerm !== key.trim() && baseTerm.length > 3) {
      glossarySearchList.push(baseTerm);
    }
  });
  // Sort longest first so multi-word terms match before single words
  glossarySearchList.sort((a, b) => b.length - a.length);

  const usedGlossaryTerms = new Set();
  const formattedPages = [];
  let currentPageBlocks = [];
  let paragraphCountOnPage = 0;

  // Helper: Inject [[Glossary]] tags into a string
  const injectGlossaryTags = (str) => {
    let result = str;
    glossarySearchList.forEach((term) => {
      const rootKey = term.split('(')[0].trim().toLowerCase();
      if (usedGlossaryTerms.has(rootKey)) return;

      const regex = new RegExp(`\\b(${escapeRegExp(term)})\\b`, 'i');
      if (regex.test(result)) {
        result = result.replace(regex, '[[$1]]');
        usedGlossaryTerms.add(rootKey);
      }
    });
    return result;
  };

  rawParagraphs.forEach((para, idx) => {
    const cleanPara = para.trim();
    const isShortTitle =
      cleanPara.startsWith('## ') ||
      (cleanPara.length < 55 &&
        !/[.!?:]$/.test(cleanPara) &&
        !cleanPara.startsWith('*') &&
        !cleanPara.startsWith('•'));

    // RULE 1: IF it's a heading (and not the very first block), start a new [PAGE]
    if (isShortTitle) {
      const headingText = cleanPara.startsWith('## ')
        ? cleanPara
        : `## ${cleanPara}`;

      if (currentPageBlocks.length > 0) {
        formattedPages.push(currentPageBlocks.join('\n\n'));
        currentPageBlocks = [];
        paragraphCountOnPage = 0;
      }
      currentPageBlocks.push(headingText);
      return;
    }

    // RULE 2: IF a page already has 3 body paragraphs, split to a new [PAGE]
    if (paragraphCountOnPage >= 3) {
      formattedPages.push(currentPageBlocks.join('\n\n'));
      currentPageBlocks = [];
      paragraphCountOnPage = 0;
    }

    const lowerPara = cleanPara.toLowerCase();

    // RULE 3: IF paragraph contains dosage/math/box triggers, wrap entire paragraph in [[[...]]]
    const isNoteBox =
      ( BOX_TRIGGERS.some((t) => lowerPara.includes(t)) && /\d/.test(cleanPara) ) ||
      lowerPara.startsWith('note:') ||
      lowerPara.startsWith('remember:');

    if (isNoteBox) {
      const withGlossary = injectGlossaryTags(cleanPara);
      currentPageBlocks.push(`[[[${withGlossary}]]]`);
      paragraphCountOnPage++;
    } else {
      // RULE 4: ELSE check sentences inside paragraph for high-alert {{Highlighter}} triggers
      // Fixed the broken \vert{} regex artifact to a standard pipe '|'
      const sentences = cleanPara.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleanPara];

      const processedSentences = sentences.map((sentence) => {
        const trimSent = sentence.trim();
        const lowerSent = trimSent.toLowerCase();

        const shouldHighlight = HIGHLIGHT_TRIGGERS.some((trigger) =>
          lowerSent.includes(trigger)
        );

        const withGlossary = injectGlossaryTags(trimSent);

        if (shouldHighlight) {
          return `{{${withGlossary}}}`;
        }
        return withGlossary;
      });

      currentPageBlocks.push(processedSentences.join(' '));
      paragraphCountOnPage++;
    }
  });

  if (currentPageBlocks.length > 0) {
    formattedPages.push(currentPageBlocks.join('\n\n'));
  }

  return {
    ...topicData,
    text: formattedPages.join('\n\n[PAGE]\n\n')
  };
}
