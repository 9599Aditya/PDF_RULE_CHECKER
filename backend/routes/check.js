const fs = require('fs');
const pdfUtils = require('../utils/pdfUtils');
const fetch = require('node-fetch');

const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

async function callOpenAI(prompt) {
  if (!OPENAI_KEY) return null;
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    }),
  });
  const data = await resp.json();
  return data;
}

function heuristicCheck(text, ruleLower) {
  // Very small, human-style heuristics. Used when no OpenAI key is present.
  let status = 'fail';
  let evidence = '';
  let reasoning = '';
  let confidence = 60;

  if (ruleLower.includes('date')) {
    const m = text.match(/\b(19|20)\d{2}\b/);
    if (m) { status = 'pass'; evidence = `Found year: "${m[0]}"`; reasoning = 'Document includes a 4-digit year.'; confidence = 80; }
  } else if (ruleLower.includes('purpose')) {
    const idx = text.toLowerCase().indexOf('purpose');
    if (idx !== -1) { status = 'pass'; evidence = `Found 'purpose' near: "${text.substr(Math.max(0, idx-30), 60)}"`; reasoning = 'Contains a section or sentence mentioning purpose.'; confidence = 78; }
  } else if (ruleLower.includes('define') || ruleLower.includes('definition') || ruleLower.includes('term')) {
    const m = text.match(/define[s]?\s+\w+|definition of|means\s+"[^"]+"/i);
    if (m) { status = 'pass'; evidence = `Found definition-like phrase: "${m[0]}"`; reasoning = 'Document appears to define a term.'; confidence = 75; }
  } else if (ruleLower.includes('responsible') || ruleLower.includes('responsibility')) {
    const m = text.match(/responsibl(?:e|ity)|owner|responsible for/i);
    if (m) { status = 'pass'; evidence = `Found responsible text: "${m[0]}"`; reasoning = 'Mentions responsibility or owner.'; confidence = 72; }
  } else if (ruleLower.includes('require')) {
    const m = text.match(/requirement|requirements|must have|shall/gi);
    if (m) { status = 'pass'; evidence = `Found requirements-ish word: "${m[0]}"`; reasoning = 'Looks like the document lists requirements.'; confidence = 70; }
  } else {
    // generic search for rule keywords
    if (text.toLowerCase().includes(ruleLower)) { status='pass'; evidence = `Found phrase: "${ruleLower}"`; reasoning = 'Exact phrase found.'; confidence = 85; }
  }

  return { status, evidence, reasoning, confidence };
}

async function checkPdfWithRules(filePath, rules) {
  const text = await pdfUtils.extractTextFromPdf(filePath);
  const results = [];

  // If OpenAI key present, ask LLM for each rule. Otherwise use heuristic.
  for (const rule of rules) {
    const ruleLower = rule.toLowerCase();
    if (!OPENAI_KEY) {
      const res = heuristicCheck(text, ruleLower);
      results.push({ rule, status: res.status, evidence: res.evidence, reasoning: res.reasoning, confidence: res.confidence });
      continue;
    }

    // Build prompt
    const prompt = `Check the following document and for the rule: "${rule}". Reply JSON with keys: status (pass/fail), evidence (1 sentence), reasoning (short), confidence (0-100). Document text:\n\n${text.slice(0, 3000)}`;
    try {
      const aiResp = await callOpenAI(prompt);
      const content = aiResp?.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // normalize fields
        results.push({
          rule,
          status: parsed.status || 'fail',
          evidence: parsed.evidence || '',
          reasoning: parsed.reasoning || '',
          confidence: parsed.confidence || 0
        });
      } else {
        results.push({ rule, status: 'fail', evidence: content.slice(0,200), reasoning: 'Could not parse LLM answer', confidence: 40 });
      }
    } catch (err) {
      console.error('LLM error', err);
      const res = heuristicCheck(text, ruleLower);
      results.push({ rule, status: res.status, evidence: res.evidence, reasoning: res.reasoning, confidence: res.confidence });
    }
  }

  return results;
}

module.exports = { checkPdfWithRules };
