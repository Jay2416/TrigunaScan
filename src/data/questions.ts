import { Question } from '@/types'

const gunaQuestions = {
  sattva: [
    "I frequently find enjoyment in quiet contemplation or self-inquiry.",
    "I believe my emotions are usually regulated and under my conscious control.",
    "I am motivated to help others primarily out of a sense of selfless service.",
    "My decisions are generally guided by principles of fairness and ethical virtue.",
    "I maintain a consistent feeling of inner peacefulness and contentment.",
    "I prefer eating light, fresh foods over heavy, processed, or highly stimulating meals.",
    "My thinking process is usually clear, focused, and free from excessive mental noise.",
    "I feel connected to a purpose greater than my personal achievement or gain."
  ],
  rajas: [
    "I have a strong desire for acquiring and possessing material goods.",
    "When criticized, I feel intensely depressed or personally attacked.",
    "I find it difficult to sit still or maintain focus without active movement or stimulation.",
    "My work style is characterized by a strong drive toward immediate goals and achievements.",
    "I thrive in environments where I can be a dominant figure or a decisive leader/boss.",
    "I frequently chase new activities or relationships hoping they will bring lasting satisfaction.",
    "I prefer highly spicy, fried, or stimulating foods and beverages (e.g., caffeine).",
    "I experience intense emotions (excitement or anger) that are sometimes difficult to modulate."
  ],
  tamas: [
    "I frequently feel overwhelmed by emotional situations and prefer to avoid them entirely.",
    "I often lack motivation and the mental drive to start or complete tasks.",
    "When presented with new information, my first reaction is often skepticism and resistance to change.",
    "I spend large amounts of time in idleness, often feeling tired or sluggish even after rest.",
    "I believe that life is mostly defined by suffering, chaos, or negativity.",
    "I tend to seek immediate sensual gratification (e.g., overeating, excessive screen time).",
    "When things go wrong, I feel stuck or paralyzed, struggling to initiate corrective action.",
    "My mind is often foggy, confused, or prone to unrealistic fantasies and ambiguity."
  ]
};

// Function to randomize questions while maintaining guna mapping
export function getRandomizedQuestions(): Question[] {
  const questions: Question[] = [];
  
  // Create questions with proper IDs and categories
  Object.entries(gunaQuestions).forEach(([guna, questionTexts]) => {
    questionTexts.forEach((text, index) => {
      questions.push({
        id: `${guna.toUpperCase()}_${index + 1}`,
        text: text,
        category: guna as 'sattva' | 'rajas' | 'tamas'
      });
    });
  });
  
  // Randomize the order using Fisher-Yates shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return questions;
}

// Export the randomized questions (will be different each time the module is loaded)
export const personalityQuestions = getRandomizedQuestions();

