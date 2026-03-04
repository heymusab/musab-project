import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Rule-based AI symptom checker: suggests specialist from keywords
const SPECIALIZATION_KEYWORDS: Record<string, string[]> = {
  'General Physician': ['fever', 'cough', 'cold', 'flu', 'headache', 'body ache', 'fatigue', 'sore throat', 'general'],
  Cardiology: ['chest', 'heart', 'palpitation', 'blood pressure', 'bp', 'breath', 'breathing', 'dizziness'],
  Dermatology: ['skin', 'rash', 'itch', 'acne', 'hair fall', 'allergy', 'eczema'],
  'ENT': ['ear', 'nose', 'throat', 'sinus', 'hearing', 'earache'],
  Orthopedics: ['bone', 'joint', 'knee', 'back pain', 'fracture', 'muscle', 'sprain'],
  Pediatrics: ['child', 'baby', 'kid', 'infant', 'vaccination', 'growth'],
  Psychiatry: ['anxiety', 'depression', 'stress', 'sleep', 'mental', 'mood'],
  Ophthalmology: ['eye', 'vision', 'headache', 'red eye'],
  Gastroenterology: ['stomach', 'digestion', 'diarrhea', 'constipation', 'vomit', 'acid', 'liver'],
  Neurology: ['headache', 'migraine', 'seizure', 'numbness', 'stroke'],
};

export async function POST(req: NextRequest) {
  await getServerSession(authOptions); // optional: can be used without login for demo
  try {
    const body = await req.json();
    const text = ((body.symptoms as string) || '').toLowerCase().trim();
    if (!text) {
      return NextResponse.json({ suggestion: 'General Physician', message: 'Describe your symptoms for a better suggestion.' });
    }

    const words = text.split(/\s+/);
    const scores: Record<string, number> = {};

    for (const [spec, keywords] of Object.entries(SPECIALIZATION_KEYWORDS)) {
      let score = 0;
      for (const kw of keywords) {
        if (words.some((w) => w.includes(kw) || kw.includes(w))) score++;
        if (text.includes(kw)) score += 2;
      }
      if (score > 0) scores[spec] = score;
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const suggestion = sorted.length ? sorted[0][0] : 'General Physician';
    const message = sorted.length
      ? `Based on your symptoms, we recommend consulting a ${suggestion}.`
      : 'We suggest visiting a General Physician for a check-up.';

    return NextResponse.json({ suggestion, message, alternatives: sorted.slice(1, 3).map((s) => s[0]) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
