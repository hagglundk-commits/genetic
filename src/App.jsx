import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Dna,
  Flame,
  GraduationCap,
  Lightbulb,
  Lock,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sprout,
  Swords,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const XP_PRACTICE_CORRECT = 20;
const XP_PRACTICE_ATTEMPT = 4;
const XP_TRAINING_CHECK = 8;
const XP_MINI_BOSS_PASS = 80;
const XP_FINAL_BOSS_PASS = 180;

const LEVELS = [
  {
    id: "cellDivisionLab",
    order: 1,
    title: "Cell Division Lab",
    shortTitle: "Cell Division Lab",
    topic: "cellDivision",
    icon: Brain,
    goal: "Explain mitosis, meiosis, gametes, and fertilization.",
    reminder: "Mitosis = body cells. Meiosis = gametes.",
    lesson:
      "Mitosis makes body cells for growth and repair. Meiosis makes gametes for reproduction. Gametes carry one allele for each gene, and fertilization combines two gametes.",
  },
  {
    id: "lettersLooks",
    order: 2,
    title: "Letters vs. Looks",
    shortTitle: "Letters vs. Looks",
    topic: "genotype",
    icon: Dna,
    goal: "Tell the difference between genotype and phenotype, and use dominant and recessive alleles correctly.",
    reminder: "Genotype = letters. Phenotype = visible trait.",
    lesson:
      "Genotype is the allele combination, such as BB, Bb, or bb. Phenotype is the trait you can observe. Dominant alleles can show with one copy, while recessive traits need two recessive alleles.",
  },
  {
    id: "punnettArena",
    order: 3,
    title: "Punnett Square Arena",
    shortTitle: "Punnett Arena",
    topic: "punnett",
    icon: Target,
    goal: "Use Punnett squares and probability to predict expected outcomes and compare them with actual results.",
    reminder: "Outside = gametes. Inside = offspring possibilities.",
    lesson:
      "Punnett squares show possible offspring allele combinations. They model probability, not guarantees, so small real-life groups may not match the exact expected ratio.",
  },
  {
    id: "inheritanceChallenge",
    order: 4,
    title: "Inheritance Pattern Challenge",
    shortTitle: "Inheritance Patterns",
    topic: "inheritancePatterns",
    icon: Award,
    goal: "Recognize simple dominance, incomplete dominance, and codominance.",
    reminder: "Incomplete = blend. Codominance = both show.",
    lesson:
      "Simple dominance means one allele can mask another. Incomplete dominance creates a blended phenotype. Codominance means both traits are visible at the same time.",
  },
  {
    id: "dnaDecoder",
    order: 5,
    title: "DNA Decoder",
    shortTitle: "DNA Decoder",
    topic: "dnaTraits",
    icon: BookOpen,
    goal: "Connect DNA, genes, proteins, transcription, and translation.",
    reminder: "DNA -> gene -> protein -> trait.",
    lesson:
      "Genes are sections of DNA. Genes hold instructions for proteins. Transcription copies DNA instructions into RNA, and translation uses that RNA message to build a protein.",
  },
  {
    id: "mutationLab",
    order: 6,
    title: "Mutation Lab",
    shortTitle: "Mutation Lab",
    topic: "mutations",
    icon: Sparkles,
    goal: "Explain what mutations are and how they can affect proteins, traits, and inheritance.",
    reminder: "Mutation = DNA change. Effects can vary.",
    lesson:
      "A mutation is a change in DNA. That change may affect a protein and possibly a trait. Some mutations are inherited if they happen in sperm or egg cells.",
  },
  {
    id: "selectionSurvival",
    order: 7,
    title: "Natural Selection Survival",
    shortTitle: "Natural Selection",
    topic: "selection",
    icon: Sprout,
    goal: "Explain how inherited variation affects survival, reproduction, and population change over time.",
    reminder: "Helpful inherited traits can become more common over time.",
    lesson:
      "Natural selection acts on inherited variation. Organisms with helpful inherited traits may survive and reproduce more, which can make those traits more common in a population over generations.",
  },
];

const FINAL_BOSS_ID = "finalBoss";
const PRACTICE_ARENA_ID = "practiceArena";
const WRITTEN_RESPONSE_ID = "writtenResponse";
const REQUIRED_BADGES = LEVELS.length;

const QUESTION_BANK = [
  {
    topic: "genotype",
    difficulty: 1,
    q: "Which best describes a genotype?",
    choices: ["The observable trait", "The allele combination", "A sperm or egg cell", "A change in DNA"],
    answer: 1,
    explain: "Genotype means the allele combination, such as BB, Bb, or bb.",
  },
  {
    topic: "genotype",
    difficulty: 1,
    q: "Which is a phenotype?",
    choices: ["Bb", "TT", "black fur", "bb"],
    answer: 2,
    explain: "A phenotype is the trait that can be observed. Black fur is a phenotype.",
  },
  {
    topic: "genotype",
    difficulty: 2,
    q: "If B is dominant for black fur and b is recessive for white fur, what phenotype is Bb?",
    choices: ["black fur", "white fur", "gray fur", "cannot be predicted"],
    answer: 0,
    explain: "Bb has one dominant allele, so the dominant phenotype appears.",
  },
  {
    topic: "genotype",
    difficulty: 2,
    q: "Which two genotypes can show the same dominant phenotype?",
    choices: ["BB and Bb", "Bb and bb", "BB and bb", "Only bb"],
    answer: 0,
    explain: "BB and Bb both contain a dominant allele, so both can show the dominant phenotype.",
  },
  {
    topic: "genotype",
    difficulty: 3,
    q: "A rabbit shows a recessive phenotype. What must be true about its genotype?",
    choices: ["It has two recessive alleles", "It has one dominant allele", "It must be heterozygous", "Its genotype cannot be known"],
    answer: 0,
    explain: "A recessive phenotype appears only when both alleles are recessive.",
  },
  {
    topic: "cellDivision",
    difficulty: 1,
    q: "What does meiosis produce?",
    choices: ["Identical body cells", "Gametes", "Proteins", "Mutations"],
    answer: 1,
    explain: "Meiosis produces gametes, such as sperm and egg cells.",
  },
  {
    topic: "cellDivision",
    difficulty: 1,
    q: "What does mitosis produce?",
    choices: ["Genetically identical body cells", "Sperm and egg cells", "RNA messages", "Only recessive traits"],
    answer: 0,
    explain: "Mitosis produces identical body cells for growth and repair.",
  },
  {
    topic: "cellDivision",
    difficulty: 2,
    q: "A gamete carries how many alleles for one gene?",
    choices: ["One", "Two", "Four", "None"],
    answer: 0,
    explain: "Gametes carry one allele for each gene.",
  },
  {
    topic: "cellDivision",
    difficulty: 2,
    q: "What happens during fertilization?",
    choices: ["Two gametes combine", "DNA disappears", "Mitosis makes gametes", "Proteins become genes"],
    answer: 0,
    explain: "Fertilization combines two gametes, bringing together one allele from each parent.",
  },
  {
    topic: "cellDivision",
    difficulty: 3,
    q: "Which statement best compares mitosis and meiosis?",
    choices: ["Both make gametes", "Mitosis makes body cells and meiosis makes gametes", "Mitosis changes genes and meiosis repairs tissue", "They are exactly the same process"],
    answer: 1,
    explain: "Mitosis makes body cells, while meiosis makes gametes for reproduction.",
  },
  {
    topic: "punnett",
    difficulty: 1,
    q: "A Punnett square shows...",
    choices: ["Guaranteed exact offspring", "Possible allele combinations", "The steps of mitosis", "Only harmful mutations"],
    answer: 1,
    explain: "Punnett squares show possible allele combinations and probabilities.",
  },
  {
    topic: "punnett",
    difficulty: 2,
    q: "In the cross Bb x bb, what can the Bb parent give?",
    choices: ["B only", "b only", "B or b", "BB only"],
    answer: 2,
    explain: "A heterozygous parent can contribute either allele.",
  },
  {
    topic: "punnett",
    difficulty: 2,
    q: "In a Bb x bb cross, what percent of offspring are expected to be bb?",
    choices: ["0%", "25%", "50%", "100%"],
    answer: 2,
    explain: "Half of the possible offspring in this cross are bb.",
  },
  {
    topic: "punnett",
    difficulty: 3,
    q: "A Punnett square predicts 75% black fur, but a litter of four has two black and two white. Why?",
    choices: ["Punnett squares show probability, not guarantees", "The parents changed genes on purpose", "Dominant traits disappeared", "Mitosis made gametes"],
    answer: 0,
    explain: "Real-life small samples do not always match the exact predicted ratio.",
  },
  {
    topic: "punnett",
    difficulty: 2,
    q: "If 5 out of 20 animals show a trait, what percentage show the trait?",
    choices: ["5%", "20%", "25%", "50%"],
    answer: 2,
    explain: "5 divided by 20 equals 0.25, or 25%.",
  },
  {
    topic: "inheritancePatterns",
    difficulty: 1,
    q: "Incomplete dominance means...",
    choices: ["Both traits show separately", "Traits blend", "One allele always disappears", "Only males show the trait"],
    answer: 1,
    explain: "Incomplete dominance leads to a blended phenotype.",
  },
  {
    topic: "inheritancePatterns",
    difficulty: 1,
    q: "Codominance means...",
    choices: ["Traits blend", "Both traits show at the same time", "The recessive trait always shows", "The trait cannot be inherited"],
    answer: 1,
    explain: "In codominance, both traits appear together.",
  },
  {
    topic: "inheritancePatterns",
    difficulty: 2,
    q: "Red flower x white flower = pink flower. What inheritance pattern is this?",
    choices: ["Incomplete dominance", "Codominance", "Mitosis", "Natural selection"],
    answer: 0,
    explain: "Pink is a blend, so this is incomplete dominance.",
  },
  {
    topic: "inheritancePatterns",
    difficulty: 2,
    q: "A cow has both red hairs and white hairs visible. What inheritance pattern is this?",
    choices: ["Incomplete dominance", "Codominance", "Translation", "Mutation only"],
    answer: 1,
    explain: "Both traits are visible, so this is codominance.",
  },
  {
    topic: "inheritancePatterns",
    difficulty: 3,
    q: "Which example best shows simple dominance?",
    choices: ["Red and white flowers make pink", "A heterozygous organism shows the dominant trait", "Both traits appear together", "A trait becomes more common over time"],
    answer: 1,
    explain: "In simple dominance, one allele masks the other in a heterozygous genotype.",
  },
  {
    topic: "dnaTraits",
    difficulty: 1,
    q: "Which chain best connects genes to traits?",
    choices: ["Trait to protein to gene to DNA", "DNA to gene to protein to trait", "Protein to DNA to trait to gene", "Gamete to trait to DNA to protein"],
    answer: 1,
    explain: "Genes are sections of DNA that give instructions for proteins, which help produce traits.",
  },
  {
    topic: "dnaTraits",
    difficulty: 1,
    q: "A gene is best described as...",
    choices: ["A section of DNA", "A visible trait", "A whole organism", "A type of mutation"],
    answer: 0,
    explain: "A gene is a section of DNA containing instructions.",
  },
  {
    topic: "dnaTraits",
    difficulty: 2,
    q: "What do genes give instructions for?",
    choices: ["Proteins", "Sunlight", "Only body size", "Punnett squares"],
    answer: 0,
    explain: "Genes hold instructions for making proteins.",
  },
  {
    topic: "dnaTraits",
    difficulty: 2,
    q: "What is transcription?",
    choices: ["Copying DNA instructions into an RNA message", "Building a protein from an RNA message", "Making gametes", "Passing helpful traits to offspring"],
    answer: 0,
    explain: "Transcription copies DNA instructions into RNA.",
  },
  {
    topic: "dnaTraits",
    difficulty: 2,
    q: "What is translation?",
    choices: ["Copying DNA into RNA", "Using an RNA message to build a protein", "Making two identical cells", "Changing a trait on purpose"],
    answer: 1,
    explain: "Translation uses RNA instructions to build a protein.",
  },
  {
    topic: "mutations",
    difficulty: 1,
    q: "A mutation is...",
    choices: ["A change in DNA", "Always harmful", "The same as phenotype", "A type of gamete"],
    answer: 0,
    explain: "A mutation is a change in DNA, and its effect can vary.",
  },
  {
    topic: "mutations",
    difficulty: 2,
    q: "Which statement about mutations is most accurate?",
    choices: ["All mutations are harmful", "Mutations never affect traits", "Mutations may or may not affect traits", "Mutations only happen in plants"],
    answer: 2,
    explain: "Some mutations change traits, while others do not have a noticeable effect.",
  },
  {
    topic: "mutations",
    difficulty: 2,
    q: "A DNA change causes a protein to work differently. What may happen next?",
    choices: ["A trait may change", "The organism must disappear", "The DNA becomes a phenotype", "Gametes stop existing"],
    answer: 0,
    explain: "Changes to proteins can sometimes change traits.",
  },
  {
    topic: "mutations",
    difficulty: 3,
    q: "Which mutation could be passed to offspring?",
    choices: ["A mutation in a skin cell", "A mutation in a sperm or egg cell", "A mutation in a muscle cell", "A mutation in a hair cell only"],
    answer: 1,
    explain: "Mutations in gametes can be inherited by offspring.",
  },
  {
    topic: "selection",
    difficulty: 1,
    q: "Which best describes natural selection?",
    choices: ["Animals change because they need to", "Helpful inherited traits can become more common over generations", "All organisms become stronger", "Traits disappear randomly every generation"],
    answer: 1,
    explain: "Natural selection favors helpful inherited traits across generations.",
  },
  {
    topic: "selection",
    difficulty: 2,
    q: "A drought occurs. Some cattle already have an inherited trait that helps them conserve water. What is likely over generations?",
    choices: ["More cattle may inherit the water-conserving trait", "All cattle immediately change their genes", "The trait disappears because droughts are harmful", "Only body cells become gametes"],
    answer: 0,
    explain: "If the trait helps survival and reproduction, it may become more common.",
  },
  {
    topic: "selection",
    difficulty: 2,
    q: "What must be true for a helpful trait to become more common through natural selection?",
    choices: ["It must be inherited", "It must be learned only", "It must be harmful", "It must happen during mitosis only"],
    answer: 0,
    explain: "Natural selection acts on inherited traits that can be passed on.",
  },
  {
    topic: "selection",
    difficulty: 3,
    q: "Which sentence avoids the common misconception about natural selection?",
    choices: ["The beetles changed color because they needed to", "The population changed because beetles with helpful inherited traits reproduced more", "Every beetle decided to become darker", "The environment gave every beetle a new gene"],
    answer: 1,
    explain: "Populations change over generations because some inherited traits help survival and reproduction.",
  },
];

const WRITTEN_RESPONSE_PROMPTS = [
  {
    id: "dog-coat-phenotype",
    title: "Question 1: Explaining a Phenotype",
    shortTitle: "Explaining a Phenotype",
    standard: "SEP 2: Developing and Using Models",
    scenario:
      "A breeder owns two black Labrador Retrievers, Duke and Bella. Both parents appear black, but one puppy in a recent litter, Mocha, has a chocolate coat.",
    geneKey: "B = dominant black coat, b = recessive chocolate coat",
    parentLabels: ["Duke", "Bella"],
    expectedParentGenotypes: ["Bb", "Bb"],
    topAlleles: ["B", "b"],
    sideAlleles: ["B", "b"],
    expectedGrid: [
      ["BB", "Bb"],
      ["Bb", "bb"],
    ],
    samplePartA:
      "The most likely genotype for both Duke and Bella is Bb. A chocolate puppy is only possible if each parent carries one recessive b allele, even though both parents show the dominant black phenotype.",
    samplePartC:
      "Mocha has a chocolate phenotype because her genotype is bb. The Punnett square shows that Duke and Bella can each pass on a recessive b allele, and when both recessive alleles combine, the recessive phenotype appears instead of the dominant black coat.",
    requiredTerms: ["genotype", "phenotype", "dominant", "recessive"],
    reasoningChecks: [
      { id: "uses-model", label: "References the Punnett square or model as evidence", patterns: ["punnett", "square", "model", "boxes"] },
      { id: "explains-bb", label: "Explains that Mocha must have genotype bb", patterns: ["bb", "b b"] },
      { id: "connects-parents", label: "Explains that each parent contributed a recessive b allele", patterns: ["each parent", "both parents", "duke", "bella", "passed on", "contributed", "gave"] },
      { id: "chocolate-conclusion", label: "Connects the recessive genotype to the chocolate phenotype", patterns: ["chocolate", "brown", "phenotype"] },
    ],
  },
  {
    id: "dog-coat-prediction",
    title: "Question 2: Predicting Outcomes with a Model",
    shortTitle: "Predicting Outcomes",
    standard: "SEP 2: Using a Model to Predict",
    scenario:
      "Mocha has genotype bb and a chocolate coat. She will be bred with Atlas, a black male with genotype Bb.",
    geneKey: "BB or Bb = black coat, bb = chocolate coat",
    parentLabels: ["Atlas", "Mocha"],
    expectedParentGenotypes: ["Bb", "bb"],
    topAlleles: ["b", "b"],
    sideAlleles: ["B", "b"],
    expectedGrid: [
      ["Bb", "Bb"],
      ["bb", "bb"],
    ],
    predictionAnswer: {
      ratioBlack: "1",
      ratioChocolate: "1",
      percentBlack: "50",
      percentChocolate: "50",
    },
    samplePartA:
      "Atlas is Bb and Mocha is bb, so the model uses one parent that can pass B or b and one parent that can only pass b.",
    samplePartC:
      "The breeder's claim is only partially accurate. The Punnett square shows a 1:1 ratio, so 50% of the puppies are predicted to be black and 50% are predicted to be chocolate.",
    requiredTerms: ["genotype", "phenotype", "dominant", "recessive"],
    reasoningChecks: [
      { id: "uses-model", label: "References the Punnett square or model as evidence", patterns: ["punnett", "square", "model", "boxes"] },
      { id: "claim-eval", label: "Evaluates the breeder's claim", patterns: ["partially accurate", "partly accurate", "partially", "claim"] },
      { id: "ratio-evidence", label: "Uses the 1:1 ratio or 50/50 evidence", patterns: ["1:1", "1 to 1", "50%", "50/50", "half"] },
      { id: "both-phenotypes", label: "Mentions both black and chocolate outcomes", patterns: ["black", "chocolate"] },
    ],
  },
];

const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((level) => [level.id, level]));
const WRITTEN_RESPONSE_BY_ID = Object.fromEntries(WRITTEN_RESPONSE_PROMPTS.map((prompt) => [prompt.id, prompt]));

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createLevelProgress() {
  return {
    unlocked: false,
    introSeen: false,
    practiceAttempts: 0,
    practiceCorrect: 0,
    trainingChecks: 0,
    pendingTrainingChecks: 0,
    currentDifficulty: 1,
    highestDifficultyReached: 1,
    practiceStreak: 0,
    practiceSeenQuestionIds: [],
    miniBoss: {
      attempts: 0,
      bestScore: 0,
      passed: false,
    },
  };
}

function createWrittenResponsePromptProgress(prompt) {
  return {
    parentGenotypes: prompt.parentLabels.map(() => ""),
    punnettCells: Array(4).fill(""),
    ratioBlack: "",
    ratioChocolate: "",
    percentBlack: "",
    percentChocolate: "",
    responseText: "",
    checkedPartA: false,
    checkedPartB: false,
    checkedPartC: false,
  };
}

function createWrittenResponseProgress() {
  const prompts = {};
  WRITTEN_RESPONSE_PROMPTS.forEach((prompt) => {
    prompts[prompt.id] = createWrittenResponsePromptProgress(prompt);
  });
  return {
    selectedPromptId: WRITTEN_RESPONSE_PROMPTS[0].id,
    prompts,
  };
}

function createProgress(reviewCode = "") {
  const levels = {};
  LEVELS.forEach((level, index) => {
    levels[level.id] = createLevelProgress();
    if (index === 0) levels[level.id].unlocked = true;
  });
  return {
    reviewCode,
    xp: 0,
    badgesEarned: [],
    currentLevelId: LEVELS[0].id,
    levels,
    finalBoss: {
      unlocked: false,
      attempts: 0,
      bestScore: 0,
      passed: false,
    },
    writtenResponse: createWrittenResponseProgress(),
  };
}

function normalizeGenotype(value) {
  const cleaned = String(value || "").replace(/[^Bb]/g, "");
  if (cleaned.length !== 2) return cleaned;
  const alleles = cleaned.split("").sort((a, b) => {
    const order = { B: 0, b: 1 };
    return order[a] - order[b];
  });
  return alleles.join("");
}

function sanitizeProgress(raw, reviewCode) {
  const base = createProgress(reviewCode);
  if (!raw || typeof raw !== "object") return base;
  const levels = {};
  LEVELS.forEach((level, index) => {
    const source = raw.levels?.[level.id] || {};
    levels[level.id] = {
      ...createLevelProgress(),
      ...source,
      unlocked: index === 0 ? true : Boolean(source.unlocked),
      introSeen: Boolean(source.introSeen),
      practiceAttempts: Number(source.practiceAttempts) || 0,
      practiceCorrect: Number(source.practiceCorrect) || 0,
      trainingChecks: Number(source.trainingChecks) || 0,
      pendingTrainingChecks: Number(source.pendingTrainingChecks) || 0,
      currentDifficulty: Math.min(3, Math.max(1, Number(source.currentDifficulty) || 1)),
      highestDifficultyReached: Math.min(3, Math.max(1, Number(source.highestDifficultyReached) || 1)),
      practiceStreak: Number(source.practiceStreak) || 0,
      practiceSeenQuestionIds: Array.isArray(source.practiceSeenQuestionIds) ? source.practiceSeenQuestionIds.filter((id) => typeof id === "string") : [],
      miniBoss: {
        attempts: Number(source.miniBoss?.attempts) || 0,
        bestScore: Number(source.miniBoss?.bestScore) || 0,
        passed: Boolean(source.miniBoss?.passed),
      },
    };
  });
  const writtenResponse = createWrittenResponseProgress();
  WRITTEN_RESPONSE_PROMPTS.forEach((prompt) => {
    const source = raw.writtenResponse?.prompts?.[prompt.id] || {};
    writtenResponse.prompts[prompt.id] = {
      ...writtenResponse.prompts[prompt.id],
      parentGenotypes: prompt.parentLabels.map((_, index) => String(source.parentGenotypes?.[index] || "")),
      punnettCells: [0, 1, 2, 3].map((index) => String(source.punnettCells?.[index] || "")),
      ratioBlack: String(source.ratioBlack || ""),
      ratioChocolate: String(source.ratioChocolate || ""),
      percentBlack: String(source.percentBlack || ""),
      percentChocolate: String(source.percentChocolate || ""),
      responseText: String(source.responseText || ""),
      checkedPartA: Boolean(source.checkedPartA),
      checkedPartB: Boolean(source.checkedPartB),
      checkedPartC: Boolean(source.checkedPartC),
    };
  });
  return {
    ...base,
    ...raw,
    reviewCode,
    xp: Number(raw.xp) || 0,
    badgesEarned: Array.isArray(raw.badgesEarned) ? raw.badgesEarned.filter((id) => LEVEL_BY_ID[id]) : [],
    currentLevelId: LEVEL_BY_ID[raw.currentLevelId] ? raw.currentLevelId : LEVELS[0].id,
    levels,
    finalBoss: {
      unlocked: Boolean(raw.finalBoss?.unlocked),
      attempts: Number(raw.finalBoss?.attempts) || 0,
      bestScore: Number(raw.finalBoss?.bestScore) || 0,
      passed: Boolean(raw.finalBoss?.passed),
    },
    writtenResponse: {
      selectedPromptId: WRITTEN_RESPONSE_BY_ID[raw.writtenResponse?.selectedPromptId] ? raw.writtenResponse.selectedPromptId : WRITTEN_RESPONSE_PROMPTS[0].id,
      prompts: writtenResponse.prompts,
    },
  };
}

function storageKey(reviewCode) {
  return `genetics-review-${reviewCode}`;
}

function levelQuestions(levelId) {
  return QUESTION_BANK.filter((question) => question.topic === LEVEL_BY_ID[levelId].topic);
}

function chooseQuestionForDifficulty(levelId, difficulty, excludeIds = []) {
  const allQuestions = levelQuestions(levelId).map((question, index) => ({ question, id: `${levelId}-${index}` }));
  const questions = allQuestions.filter((entry) => !excludeIds.includes(entry.id));
  const lastSeenId = excludeIds[excludeIds.length - 1];
  const resetPool = allQuestions.filter((entry) => entry.id !== lastSeenId);
  const pool = questions.length ? questions : resetPool.length ? resetPool : allQuestions;
  const exact = pool.filter((entry) => entry.question.difficulty === difficulty);
  if (exact.length) return exact[Math.floor(Math.random() * exact.length)];
  const easier = pool.filter((entry) => entry.question.difficulty <= difficulty);
  const finalPool = easier.length ? easier : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

function buildMiniBossQuestions(levelId, excludeIds = []) {
  const entries = levelQuestions(levelId).map((question, index) => ({ question, id: `${levelId}-${index}` }));
  const preferredEntries = entries.filter((entry) => !excludeIds.includes(entry.id));
  const sourceEntries = preferredEntries.length >= 5 ? preferredEntries : entries;
  const byDifficulty = [1, 2, 3].flatMap((difficulty) =>
    shuffle(sourceEntries.filter((entry) => entry.question.difficulty === difficulty)).slice(0, difficulty === 2 ? 2 : difficulty === 3 ? 2 : 1)
  );
  const selected = byDifficulty.length >= 5 ? byDifficulty.slice(0, 5) : shuffle(sourceEntries).slice(0, 5);
  return shuffle(selected);
}

function buildFinalBossQuestions() {
  const guaranteed = LEVELS.map((level) => {
    const source = levelQuestions(level.id).filter((question) => question.difficulty >= 2);
    const question = shuffle(source)[0];
    return { question, id: `${level.id}-final-guaranteed` };
  });
  const extraPool = shuffle(
    LEVELS.flatMap((level) =>
      levelQuestions(level.id).map((question, index) => ({ question, id: `${level.id}-final-${index}` }))
    )
  );
  const extras = [];
  for (const item of extraPool) {
    if (extras.length === 3) break;
    extras.push(item);
  }
  return shuffle([...guaranteed, ...extras]).slice(0, 10);
}

function miniBossReady(levelProgress) {
  return (
    levelProgress.practiceAttempts >= 8 &&
    levelProgress.practiceCorrect >= 6 &&
    levelProgress.pendingTrainingChecks === 0 &&
    levelProgress.highestDifficultyReached >= 2
  );
}

function finalBossReady(progress) {
  return LEVELS.every((level) => progress.levels[level.id].miniBoss.passed);
}

function nextLevelAfter(levelId) {
  const currentIndex = LEVELS.findIndex((level) => level.id === levelId);
  return currentIndex >= 0 ? LEVELS[currentIndex + 1] : null;
}

function difficultyLabel(value) {
  if (value <= 1) return "Easy";
  if (value === 2) return "Medium";
  return "Hard";
}

function completionCode(progress) {
  if (!progress.finalBoss.passed) return null;
  const seed = `${progress.reviewCode}-${progress.xp}-${progress.badgesEarned.length}-${progress.finalBoss.bestScore}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1679616;
  }
  const verification = hash.toString(36).toUpperCase().padStart(4, "0").slice(-4);
  return `${progress.reviewCode}-GEN-${progress.xp}-${progress.badgesEarned.length}-${progress.finalBoss.bestScore}-${verification}`;
}

function parentGenotypesCorrect(prompt, promptProgress) {
  return prompt.expectedParentGenotypes.every((expected, index) => normalizeGenotype(promptProgress.parentGenotypes[index]) === expected);
}

function punnettSquareCorrect(prompt, promptProgress) {
  return prompt.expectedGrid.flat().every((expected, index) => normalizeGenotype(promptProgress.punnettCells[index]) === expected);
}

function predictionCorrect(prompt, promptProgress) {
  if (!prompt.predictionAnswer) return true;
  return (
    String(promptProgress.ratioBlack).trim() === prompt.predictionAnswer.ratioBlack &&
    String(promptProgress.ratioChocolate).trim() === prompt.predictionAnswer.ratioChocolate &&
    String(promptProgress.percentBlack).replace("%", "").trim() === prompt.predictionAnswer.percentBlack &&
    String(promptProgress.percentChocolate).replace("%", "").trim() === prompt.predictionAnswer.percentChocolate
  );
}

function evaluateWrittenChecklist(prompt, text) {
  const normalized = String(text || "").toLowerCase();
  const requiredTermChecks = prompt.requiredTerms.map((term) => ({
    id: `term-${term}`,
    label: `Uses the term "${term}"`,
    passed: normalized.includes(term.toLowerCase()),
  }));
  const reasoningChecks = prompt.reasoningChecks.map((check) => ({
    id: check.id,
    label: check.label,
    passed: check.patterns.some((pattern) => normalized.includes(pattern.toLowerCase())),
  }));
  return [...requiredTermChecks, ...reasoningChecks];
}

function studyRecommendations(progress) {
  return LEVELS.map((level) => {
    const levelProgress = progress.levels[level.id];
    const accuracy = levelProgress.practiceAttempts > 0 ? levelProgress.practiceCorrect / levelProgress.practiceAttempts : 0;
    const miniBossRatio = levelProgress.miniBoss.bestScore / 5;
    const difficultyRatio = levelProgress.highestDifficultyReached / 3;
    const trainingRatio = levelProgress.practiceAttempts > 0 ? levelProgress.trainingChecks / levelProgress.practiceAttempts : 0;
    const score = accuracy * 0.45 + miniBossRatio * 0.4 + difficultyRatio * 0.15 - trainingRatio * 0.1;
    const reasons = [];
    if (levelProgress.miniBoss.bestScore < 4) reasons.push("mini boss score was lower");
    if (accuracy < 0.7) reasons.push("practice accuracy was inconsistent");
    if (levelProgress.trainingChecks > 2) reasons.push("several Training Checks were needed");
    if (!reasons.length) reasons.push("performance was steady");
    return {
      id: level.id,
      title: level.title,
      shortTitle: level.shortTitle,
      score,
      accuracy,
      miniBossScore: levelProgress.miniBoss.bestScore,
      highestDifficultyReached: levelProgress.highestDifficultyReached,
      reasons,
    };
  }).sort((a, b) => a.score - b.score);
}

function LoginScreen({ onLogin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!/^\d{5}$/.test(code)) {
      setError("Enter a valid 5-digit review code.");
      return;
    }
    onLogin(code);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(135deg,#f8fafc,#dcfce7_50%,#ecfccb)] p-4">
      <div className="grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-2xl backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">
            <Rocket className="h-4 w-4" />
            Genetics Game Map
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Genetics review adventure
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Clear each level, beat each mini boss, and unlock the final boss.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <FeatureCard icon={Target} title="Levels" text="One topic at a time." />
            <FeatureCard icon={Swords} title="Bosses" text="Beat mini bosses to move on." />
            <FeatureCard icon={ShieldCheck} title="Private" text="No names or emails collected." />
          </div>
        </section>

        <Card className="rounded-[2rem] border-0 bg-slate-950 text-white shadow-2xl">
          <CardContent className="p-8">
            <h2 className="text-3xl font-black">Enter Review Code</h2>
            <p className="mt-3 text-slate-300">
              Use your 5-digit code from your teacher.
            </p>
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              Use the same Chromebook and Chrome account if you need to come back later. Submit
              your completion code as soon as it unlocks.
            </div>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  5-digit code
                </span>
                <input
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 5));
                    setError("");
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-3xl font-bold tracking-[0.5em] text-white outline-none transition focus:border-emerald-300 focus:bg-white/15"
                  placeholder="12345"
                />
              </label>
              {error && <p className="text-sm text-amber-300">{error}</p>}
              <Button type="submit" className="w-full rounded-2xl bg-emerald-500 py-6 text-base font-semibold text-emerald-950 hover:bg-emerald-400">
                Start Game
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-4">
      <Icon className="h-5 w-5 text-emerald-700" />
      <div className="mt-3 font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-900 text-white",
    emerald: "bg-emerald-100 text-emerald-950",
    amber: "bg-amber-100 text-amber-950",
    sky: "bg-sky-100 text-sky-950",
  };
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cx("rounded-2xl p-3", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-black text-slate-950">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard({ progress, setMode, resetProgress }) {
  const unlockedCode = completionCode(progress);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-950">Progress Dashboard</h2>
          <p className="mt-2 text-slate-600">Track levels, bosses, badges, and your completion progress.</p>
        </div>
        <Button variant="outline" onClick={resetProgress} className="rounded-2xl">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset This Code
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Rocket} label="XP" value={progress.xp} tone="emerald" />
        <StatCard icon={Award} label="Badges Earned" value={`${progress.badgesEarned.length}/${REQUIRED_BADGES}`} tone="sky" />
        <StatCard icon={Swords} label="Current Level" value={LEVEL_BY_ID[progress.currentLevelId]?.order || 1} tone="amber" />
        <StatCard icon={Trophy} label="Final Boss" value={progress.finalBoss.passed ? "Passed" : `${progress.finalBoss.bestScore}/10`} tone="slate" />
      </div>

      <div className="grid gap-4">
        {LEVELS.map((level) => {
          const levelProgress = progress.levels[level.id];
          const Icon = level.icon;
          const isCurrent = progress.currentLevelId === level.id;
          return (
            <Card key={level.id} className="rounded-[2rem] border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-3xl bg-slate-100 p-4">
                      <Icon className="h-6 w-6 text-slate-900" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black text-slate-950">
                          Level {level.order}: {level.title}
                        </h3>
                        <span className={cx("rounded-full px-3 py-1 text-sm font-semibold", levelProgress.unlocked ? "bg-emerald-100 text-emerald-950" : "bg-slate-100 text-slate-600")}>
                          {levelProgress.unlocked ? "Unlocked" : "Locked"}
                        </span>
                        {levelProgress.miniBoss.passed && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-950">
                            Mini Boss Cleared
                          </span>
                        )}
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-5">
                        <div>Practice: {levelProgress.practiceAttempts}</div>
                        <div>Correct: {levelProgress.practiceCorrect}</div>
                        <div>Training Checks: {levelProgress.trainingChecks}</div>
                        <div>Difficulty: {difficultyLabel(levelProgress.highestDifficultyReached)}</div>
                        <div>Mini Boss: {levelProgress.miniBoss.bestScore}/5</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      disabled={!levelProgress.unlocked}
                      onClick={() => setMode(`level:${level.id}:intro`)}
                      className="rounded-2xl"
                    >
                      {isCurrent ? "Open Level" : "View Level"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black text-slate-950">Completion Code</h3>
          <div className="mt-4 rounded-3xl bg-slate-100 p-5">
            {unlockedCode ? (
              <div className="break-all text-xl font-black text-slate-950">{unlockedCode}</div>
            ) : (
              <p className="text-slate-600">Pass the final boss to unlock the completion code.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Home({ progress, setMode }) {
  const currentLevel = LEVEL_BY_ID[progress.currentLevelId];
  const currentProgress = progress.levels[currentLevel.id];
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#052e16,#14532d_45%,#365314)] p-8 text-white shadow-xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Level-Based Review</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Clear each level. Beat each mini boss. Unlock the final boss.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-emerald-50/90">
              Missed questions trigger a mini-lesson and a follow-up check before you can keep moving.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => setMode(`level:${currentLevel.id}:intro`)} className="rounded-2xl bg-white px-5 py-5 text-base text-emerald-950 hover:bg-emerald-50">
                <Target className="mr-2 h-4 w-4" />
                Continue Level {currentLevel.order}
              </Button>
              <Button onClick={() => setMode("dashboard")} variant="outline" className="rounded-2xl border-white/40 bg-white/10 px-5 py-5 text-base text-white hover:bg-white/15">
                View Dashboard
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm uppercase tracking-[0.25em] text-emerald-200">Current Level</div>
              <div className="mt-3 text-3xl font-black">{currentLevel.title}</div>
              <p className="mt-2 text-sm text-emerald-50/85">
                Practice {currentProgress.practiceAttempts}/8, correct {currentProgress.practiceCorrect}/6
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm uppercase tracking-[0.25em] text-emerald-200">Review Code</div>
              <div className="mt-3 text-3xl font-black tracking-[0.3em]">{progress.reviewCode}</div>
              <p className="mt-2 text-sm text-emerald-50/85">Keep using this same code each time you come back.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Rocket} label="XP" value={progress.xp} tone="emerald" />
        <StatCard icon={Award} label="Badges" value={`${progress.badgesEarned.length}/${REQUIRED_BADGES}`} tone="sky" />
        <StatCard icon={CheckCircle2} label="Training Checks" value={LEVELS.reduce((sum, level) => sum + progress.levels[level.id].trainingChecks, 0)} tone="amber" />
        <StatCard icon={Trophy} label="Final Boss" value={progress.finalBoss.passed ? "Passed" : "Locked"} tone="slate" />
      </div>
    </div>
  );
}

function LevelIntro({ level, progress, startPractice, startMiniBoss }) {
  const levelProgress = progress.levels[level.id];
  const ready = miniBossReady(levelProgress);
  const Icon = level.icon;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-950">
                <Icon className="h-4 w-4" />
                Level {level.order}
              </div>
              <h2 className="mt-5 text-4xl font-black text-slate-950">{level.title}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">{level.goal}</p>
              <div className="mt-5 rounded-3xl bg-slate-100 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Key reminder</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{level.reminder}</div>
              </div>
            </div>
            <div className="grid gap-4 lg:min-w-[280px]">
              <StatCard icon={Target} label="Practice Attempts" value={levelProgress.practiceAttempts} tone="sky" />
              <StatCard icon={CheckCircle2} label="Correct Answers" value={levelProgress.practiceCorrect} tone="emerald" />
              <StatCard icon={Swords} label="Mini Boss" value={levelProgress.miniBoss.passed ? "Passed" : ready ? "Unlocked" : "Locked"} tone="amber" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={startPractice} className="rounded-2xl">
              Begin Level
            </Button>
            <Button disabled={!ready} onClick={startMiniBoss} variant="outline" className="rounded-2xl">
              Start Mini Boss
            </Button>
          </div>
          {!ready && (
            <p className="mt-4 text-sm text-slate-600">
              Mini boss unlock: 8 practice attempts, 6 correct, all Training Checks resolved, and at least medium difficulty reached.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MiniLesson({ level }) {
  const Icon = level.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6"
    >
      <div className="flex gap-4">
        <div className="rounded-3xl bg-white p-4 text-amber-700 shadow-sm">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-950">Mini-Lesson</h3>
            <Icon className="h-5 w-5 text-amber-700" />
          </div>
          <p className="mt-3 leading-7 text-slate-700">{level.lesson}</p>
          <div className="mt-4 rounded-3xl bg-white p-4 font-semibold text-slate-800">Remember: {level.reminder}</div>
        </div>
      </div>
    </motion.div>
  );
}

function QuestionCard({ question, selected, answered, onSelect, heading, badge, footer }) {
  return (
    <Card className="rounded-[2rem] border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{heading}</div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{badge}</div>
        </div>
        <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-950">{question.q}</h3>
        <div className="mt-6 grid gap-3">
          {question.choices.map((choice, index) => {
            const correct = answered && index === question.answer;
            const wrong = answered && selected === index && index !== question.answer;
            return (
              <button
                key={`${question.q}-${choice}`}
                onClick={() => onSelect(index)}
                disabled={answered}
                className={cx(
                  "flex items-center justify-between rounded-3xl border p-4 text-left transition",
                  correct && "border-emerald-300 bg-emerald-50",
                  wrong && "border-red-300 bg-red-50",
                  !answered && "hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className="pr-4">{choice}</span>
                {correct && <CheckCircle2 className="h-5 w-5 text-emerald-700" />}
                {wrong && <XCircle className="h-5 w-5 text-red-700" />}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-3xl bg-slate-50 p-4 text-slate-700"
            >
              <strong>Explanation:</strong> {question.explain}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-6">{footer}</div>
      </CardContent>
    </Card>
  );
}

function LevelPractice({
  level,
  progress,
  applyPracticeAnswer,
  applyFollowUpAnswer,
  goToIntro,
  startMiniBoss,
}) {
  const levelProgress = progress.levels[level.id];
  const ready = miniBossReady(levelProgress);
  const [seen, setSeen] = useState([]);
  const [phase, setPhase] = useState("practice");
  const [questionState, setQuestionState] = useState(() =>
    chooseQuestionForDifficulty(level.id, levelProgress.currentDifficulty, [])
  );
  const [selected, setSelected] = useState(null);
  const [followUpState, setFollowUpState] = useState(null);
  const [followUpSelected, setFollowUpSelected] = useState(null);
  const [message, setMessage] = useState("");

  const refreshQuestion = (difficultyOverride) => {
    const nextSeen = [...seen, questionState.id];
    setSeen(nextSeen);
    setQuestionState(
      chooseQuestionForDifficulty(level.id, difficultyOverride || progress.levels[level.id].currentDifficulty, nextSeen)
    );
    setSelected(null);
    setFollowUpSelected(null);
    setFollowUpState(null);
    setPhase("practice");
    setMessage("");
  };

  const answerPractice = (choiceIndex) => {
    if (phase !== "practice") return;
    const correct = choiceIndex === questionState.question.answer;
    setSelected(choiceIndex);
    const result = applyPracticeAnswer(level.id, correct, questionState.id);
    if (correct) {
      setMessage(`Correct. +${XP_PRACTICE_CORRECT} XP.`);
      setPhase("resolved-practice");
      return;
    }
    setMessage(`Missed it. +${XP_PRACTICE_ATTEMPT} XP for the attempt.`);
    const nextFollow = chooseQuestionForDifficulty(level.id, 1, [...seen, questionState.id]);
    setFollowUpState(nextFollow);
    setPhase("lesson");
    if (result.nextDifficulty) {
      setQuestionState((current) => current);
    }
  };

  const answerFollowUp = (choiceIndex) => {
    if (phase !== "followup" || !followUpState) return;
    const correct = choiceIndex === followUpState.question.answer;
    setFollowUpSelected(choiceIndex);
    const result = applyFollowUpAnswer(level.id, correct, followUpState.id);
    if (correct) {
      setMessage(`Training Check complete. +${XP_TRAINING_CHECK} XP.`);
    } else {
      setMessage("Training Check missed. You'll stay with easier practice for now.");
    }
    setPhase("resolved-followup");
    if (result.nextDifficulty) {
      setQuestionState((current) => current);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-950">{level.title}</h2>
          <p className="mt-2 text-slate-600">
            Practice until the mini boss unlocks.
          </p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          Difficulty: {difficultyLabel(levelProgress.currentDifficulty)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Target} label="Attempts" value={levelProgress.practiceAttempts} tone="sky" />
        <StatCard icon={CheckCircle2} label="Correct" value={levelProgress.practiceCorrect} tone="emerald" />
        <StatCard icon={Award} label="Training Checks" value={levelProgress.trainingChecks} tone="amber" />
        <StatCard icon={Swords} label="Mini Boss" value={ready ? "Unlocked" : "Locked"} tone="slate" />
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className={cx("rounded-[2rem] border px-5 py-4 shadow-sm", message ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white")}>
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">XP Update</div>
          <p className="mt-2 text-base font-semibold text-slate-800">
            {message || (ready ? "Mini boss unlocked. Start it when you are ready." : "Answer questions to earn XP and build toward the mini boss.")}
          </p>
        </div>
        <StatCard icon={Rocket} label="Total XP" value={progress.xp} tone="emerald" />
      </div>

      {phase === "lesson" && <MiniLesson level={level} />}

      {(phase === "practice" || phase === "resolved-practice" || phase === "lesson") && (
        <QuestionCard
          question={questionState.question}
          selected={selected}
          answered={phase !== "practice"}
          onSelect={answerPractice}
          heading="Practice Question"
          badge={difficultyLabel(questionState.question.difficulty)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Get 3 correct in a row to increase difficulty.</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={goToIntro} className="rounded-2xl">
                  Back to Level
                </Button>
                {phase === "resolved-practice" && ready && (
                  <Button onClick={startMiniBoss} className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700">
                    Start Mini Boss
                  </Button>
                )}
                {phase === "resolved-practice" && !ready && (
                  <Button onClick={() => refreshQuestion()} className="rounded-2xl">
                    Next Question
                  </Button>
                )}
                {phase === "lesson" && (
                  <Button onClick={() => setPhase("followup")} className="rounded-2xl bg-amber-500 text-amber-950 hover:bg-amber-400">
                    Start Follow-Up
                  </Button>
                )}
              </div>
            </div>
          }
        />
      )}

      {(phase === "followup" || phase === "resolved-followup") && followUpState && (
        <QuestionCard
          question={followUpState.question}
          selected={followUpSelected}
          answered={phase === "resolved-followup"}
          onSelect={answerFollowUp}
          heading="Training Check"
          badge="Follow-Up"
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Get this follow-up right to clear the Training Check.</p>
              {phase === "resolved-followup" && ready && (
                <Button onClick={startMiniBoss} className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700">
                  Start Mini Boss
                </Button>
              )}
              {phase === "resolved-followup" && !ready && (
                <Button onClick={() => refreshQuestion(progress.levels[level.id].currentDifficulty)} className="rounded-2xl">
                  Return to Practice
                </Button>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}

function MiniBoss({ level, progress, applyMiniBossResult, backToLevel, continueAfterBoss }) {
  const [questions, setQuestions] = useState(() => buildMiniBossQuestions(level.id, progress.levels[level.id].practiceSeenQuestionIds));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passedBoss, setPassedBoss] = useState(false);

  const question = questions[index]?.question;

  const answer = (choiceIndex) => {
    if (selected !== null || finished) return;
    setSelected(choiceIndex);
  };

  const next = () => {
    const nextScore = score + (selected === question.answer ? 1 : 0);
    if (index === questions.length - 1) {
      const passed = nextScore >= 4;
      applyMiniBossResult(level.id, nextScore, passed);
      setScore(nextScore);
      setPassedBoss(passed);
      setFinished(true);
      return;
    }
    setScore(nextScore);
    setIndex((value) => value + 1);
    setSelected(null);
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className={cx("mx-auto flex h-16 w-16 items-center justify-center rounded-full", passedBoss ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900")}>
              {passedBoss ? <Trophy className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
            </div>
            <h2 className="mt-5 text-3xl font-black text-slate-950">Mini Boss Complete</h2>
            <p className="mt-3 text-lg text-slate-600">Score: <span className="font-bold text-slate-950">{score}/5</span></p>
            <p className="mt-2 text-slate-600">
              {passedBoss ? "Mini boss passed. The next level is unlocked." : "Mini boss failed. Go back to practice and try again."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={passedBoss ? continueAfterBoss : backToLevel} className="rounded-2xl">
                {passedBoss ? "Continue" : "Return to Level"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-950">{level.title} Mini Boss</h2>
          <p className="mt-2 text-slate-600">Five questions. Score at least 4 out of 5 to pass.</p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          Question {index + 1} of 5
        </div>
      </div>

      <QuestionCard
        question={question}
        selected={selected}
        answered={selected !== null}
        onSelect={answer}
        heading="Mini Boss Question"
        badge={difficultyLabel(question.difficulty)}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">Mini bosses do not include mini-lessons.</p>
            <Button disabled={selected === null} onClick={next} className="rounded-2xl">
              {index === questions.length - 1 ? "Finish Mini Boss" : "Next Question"}
            </Button>
          </div>
        }
      />
    </div>
  );
}

function FinalBoss({ progress, applyFinalBossResult }) {
  const ready = finalBossReady(progress);
  const [questions, setQuestions] = useState(() => buildFinalBossQuestions());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <Lock className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-5 text-3xl font-black text-slate-950">Final Boss Locked</h2>
            <p className="mt-3 text-slate-600">Pass all 7 mini bosses before opening the final boss.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[index]?.question;

  const answer = (choiceIndex) => {
    if (selected !== null || finished) return;
    setSelected(choiceIndex);
  };

  const next = () => {
    const nextScore = score + (selected === question.answer ? 1 : 0);
    if (index === questions.length - 1) {
      const passed = nextScore >= 8;
      applyFinalBossResult(nextScore, passed);
      setScore(nextScore);
      setFinished(true);
      return;
    }
    setScore(nextScore);
    setIndex((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setQuestions(buildFinalBossQuestions());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const passed = score >= 8;
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className={cx("mx-auto flex h-16 w-16 items-center justify-center rounded-full", passed ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900")}>
              {passed ? <Trophy className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
            </div>
            <h2 className="mt-5 text-3xl font-black text-slate-950">Final Boss Complete</h2>
            <p className="mt-3 text-lg text-slate-600">Score: <span className="font-bold text-slate-950">{score}/10</span></p>
            <p className="mt-2 text-slate-600">
              {passed ? "Final boss passed. Your completion code is now unlocked." : "Final boss failed. Try again when you're ready."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={restart} className="rounded-2xl">
                Try Final Boss Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-950">Final Boss</h2>
          <p className="mt-2 text-slate-600">Ten mixed questions. Score at least 8 out of 10 to pass.</p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          Question {index + 1} of 10
        </div>
      </div>

      <QuestionCard
        question={question}
        selected={selected}
        answered={selected !== null}
        onSelect={answer}
        heading="Final Boss Question"
        badge={LEVELS.find((level) => level.topic === question.topic)?.shortTitle || "Mixed"}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">The final boss uses mixed review from all levels.</p>
            <Button disabled={selected === null} onClick={next} className="rounded-2xl">
              {index === questions.length - 1 ? "Finish Final Boss" : "Next Question"}
            </Button>
          </div>
        }
      />
    </div>
  );
}

function WrittenResponseChecklist({ checks }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {checks.map((check) => (
        <div
          key={check.id}
          className={cx(
            "flex items-start gap-3 rounded-[1.25rem] border p-4",
            check.passed ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
          )}
        >
          <div className={cx("mt-0.5", check.passed ? "text-emerald-700" : "text-amber-700")}>
            {check.passed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </div>
          <div className="text-sm font-medium text-slate-800">{check.label}</div>
        </div>
      ))}
    </div>
  );
}

function WrittenResponseTab({ progress, updateWrittenResponse }) {
  const selectedPromptId = progress.writtenResponse?.selectedPromptId || WRITTEN_RESPONSE_PROMPTS[0].id;
  const prompt = WRITTEN_RESPONSE_BY_ID[selectedPromptId];
  const promptProgress = progress.writtenResponse.prompts[selectedPromptId];
  const checklist = evaluateWrittenChecklist(prompt, promptProgress.responseText);
  const partACorrect = parentGenotypesCorrect(prompt, promptProgress);
  const partBCorrect = punnettSquareCorrect(prompt, promptProgress) && predictionCorrect(prompt, promptProgress);
  const partCPassedCount = checklist.filter((check) => check.passed).length;

  const setPromptField = (field, value) => {
    updateWrittenResponse(selectedPromptId, { [field]: value });
  };

  const setParentGenotype = (index, value) => {
    const next = [...promptProgress.parentGenotypes];
    next[index] = value;
    setPromptField("parentGenotypes", next);
  };

  const setPunnettCell = (index, value) => {
    const next = [...promptProgress.punnettCells];
    next[index] = value;
    setPromptField("punnettCells", next);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,#3f1d7a,#1d4ed8_55%,#0f766e)] p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Written Response</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Practice SEP 2 Model-Based Answers</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-cyan-50/90">
          Build genetic models, complete Punnett squares, and write short evidence-based explanations like the ones on the test.
        </p>
      </section>

      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Prompt Select</h3>
              <p className="mt-2 text-slate-600">Choose one of the written-response questions from the dog coat genetics assessment.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{prompt.standard}</div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {WRITTEN_RESPONSE_PROMPTS.map((entry) => (
              <button
                key={entry.id}
                onClick={() => updateWrittenResponse(null, { selectedPromptId: entry.id })}
                className={cx(
                  "rounded-[1.5rem] border p-4 text-left transition",
                  selectedPromptId === entry.id ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{entry.standard}</div>
                <div className="mt-2 text-lg font-black text-slate-950">{entry.title}</div>
                <div className="mt-2 text-sm text-slate-600">{entry.shortTitle}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div>
            <h3 className="text-2xl font-black text-slate-950">{prompt.title}</h3>
            <p className="mt-3 leading-8 text-slate-700">{prompt.scenario}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-100 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Gene Key</div>
            <p className="mt-2 text-lg font-semibold text-slate-900">{prompt.geneKey}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Part A: Identify Parent Genotypes</h3>
              <p className="mt-2 text-slate-600">Enter the most likely genotype for each parent, then check your setup.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {prompt.parentLabels.map((label, index) => (
                <label key={label} className="space-y-2">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
                  <input
                    value={promptProgress.parentGenotypes[index]}
                    onChange={(event) => setParentGenotype(index, event.target.value)}
                    placeholder="Bb"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                  />
                </label>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setPromptField("checkedPartA", true)} className="rounded-2xl">
                Check Part A
              </Button>
              {promptProgress.checkedPartA && (
                <span className={cx("text-sm font-semibold", partACorrect ? "text-emerald-700" : "text-amber-700")}>
                  {partACorrect ? "Part A looks correct." : "Part A is not correct yet. Check the sample answer below."}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Part B: Construct the Punnett Square</h3>
              <p className="mt-2 text-slate-600">Use the alleles from the prompt to fill in each offspring genotype.</p>
            </div>
            <div className="overflow-x-auto">
              <div className="grid min-w-[320px] grid-cols-[90px_repeat(2,minmax(0,1fr))] gap-3">
                <div />
                {prompt.topAlleles.map((allele, index) => (
                  <div key={`${prompt.id}-top-${index}`} className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-lg font-black text-slate-900">
                    {allele}
                  </div>
                ))}
                {prompt.sideAlleles.map((allele, rowIndex) => (
                  <React.Fragment key={`${prompt.id}-row-${rowIndex}`}>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-lg font-black text-slate-900">{allele}</div>
                    {[0, 1].map((colIndex) => {
                      const flatIndex = rowIndex * 2 + colIndex;
                      return (
                        <input
                          key={`${prompt.id}-cell-${flatIndex}`}
                          value={promptProgress.punnettCells[flatIndex]}
                          onChange={(event) => setPunnettCell(flatIndex, event.target.value)}
                          placeholder="Bb"
                          className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {prompt.predictionAnswer && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Ratio: Black</div>
                  <input
                    value={promptProgress.ratioBlack}
                    onChange={(event) => setPromptField("ratioBlack", event.target.value)}
                    placeholder="1"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                  />
                </label>
                <label className="space-y-2">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Ratio: Chocolate</div>
                  <input
                    value={promptProgress.ratioChocolate}
                    onChange={(event) => setPromptField("ratioChocolate", event.target.value)}
                    placeholder="1"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                  />
                </label>
                <label className="space-y-2">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Percent Black</div>
                  <input
                    value={promptProgress.percentBlack}
                    onChange={(event) => setPromptField("percentBlack", event.target.value)}
                    placeholder="50"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                  />
                </label>
                <label className="space-y-2">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Percent Chocolate</div>
                  <input
                    value={promptProgress.percentChocolate}
                    onChange={(event) => setPromptField("percentChocolate", event.target.value)}
                    placeholder="50"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-sky-400"
                  />
                </label>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setPromptField("checkedPartB", true)} className="rounded-2xl">
                Check Part B
              </Button>
              {promptProgress.checkedPartB && (
                <span className={cx("text-sm font-semibold", partBCorrect ? "text-emerald-700" : "text-amber-700")}>
                  {partBCorrect ? "Part B looks correct." : "Part B needs another pass. Compare with the correct model below."}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="text-2xl font-black text-slate-950">Part C: Write Your Explanation</h3>
            <p className="mt-2 text-slate-600">Write 2-3 sentences that use evidence from the model and the required genetics vocabulary.</p>
          </div>
          <textarea
            value={promptProgress.responseText}
            onChange={(event) => setPromptField("responseText", event.target.value)}
            placeholder="Use the Punnett square as evidence in your explanation."
            className="min-h-[180px] w-full rounded-[1.5rem] border border-slate-200 px-4 py-4 text-base leading-7 text-slate-900 outline-none transition focus:border-sky-400"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setPromptField("checkedPartC", true)} className="rounded-2xl">
              Check Part C
            </Button>
            {promptProgress.checkedPartC && (
              <span className="text-sm font-semibold text-slate-700">
                Checklist complete: {partCPassedCount}/{checklist.length} targets met.
              </span>
            )}
          </div>
          {promptProgress.checkedPartC && <WrittenResponseChecklist checks={checklist} />}
        </CardContent>
      </Card>

      {(promptProgress.checkedPartA || promptProgress.checkedPartB || promptProgress.checkedPartC) && (
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <h3 className="text-2xl font-black text-slate-950">Teacher-Style Feedback</h3>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-100 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Correct Part A</div>
                <p className="mt-3 leading-7 text-slate-800">{prompt.samplePartA}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Correct Part B</div>
                <div className="mt-3 space-y-3 text-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    {prompt.expectedGrid.flat().map((cell, index) => (
                      <div key={`${prompt.id}-answer-${index}`} className="rounded-xl bg-white px-3 py-2 text-center font-black text-slate-950">
                        {cell}
                      </div>
                    ))}
                  </div>
                  {prompt.predictionAnswer && (
                    <p className="text-sm leading-7">
                      Ratio: {prompt.predictionAnswer.ratioBlack} black : {prompt.predictionAnswer.ratioChocolate} chocolate. Percent: {prompt.predictionAnswer.percentBlack}% black, {prompt.predictionAnswer.percentChocolate}% chocolate.
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Sample Part C</div>
                <p className="mt-3 leading-7 text-slate-800">{prompt.samplePartC}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CompletionCenter({ progress }) {
  const code = completionCode(progress);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#1e293b_55%,#334155)] p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Completion Center</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">
          {code ? "Completion Code Unlocked" : "Completion Code Locked"}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Pass the final boss to unlock the code.
        </p>
      </section>

      <Card className="rounded-[2rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black text-slate-950">Completion Code</h3>
          <div className={cx("mt-6 rounded-[2rem] p-6", code ? "bg-emerald-50" : "bg-slate-100")}>
            {code ? (
              <>
                <div className="break-all text-2xl font-black tracking-wide text-slate-950">{code}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={copy} className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500">
                    {copied ? "Copied" : "Copy Completion Code"}
                  </Button>
                  <Button asChild className="rounded-2xl bg-sky-600 text-white hover:bg-sky-500">
                    <a href="https://forms.gle/MGfQMCjpPJvUB33z8" target="_blank" rel="noreferrer">
                      Open Submission Form
                    </a>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-slate-600">Copy this code, open the Google Form, and paste it in right away.</p>
              </>
            ) : (
              <p className="text-slate-600">Keep clearing levels and bosses to unlock your code.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PracticeArena({ progress }) {
  const [selectedLevelId, setSelectedLevelId] = useState(LEVELS[0].id);
  const [seenIds, setSeenIds] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    chooseQuestionForDifficulty(LEVELS[0].id, 2, [])
  );
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [sessionStats, setSessionStats] = useState({ answered: 0, correct: 0 });

  const selectedLevel = LEVEL_BY_ID[selectedLevelId];
  const recommendations = studyRecommendations(progress);
  const focusTopics = recommendations.slice(0, 2);
  const strengthTopic = recommendations[recommendations.length - 1];

  const loadQuestion = (levelId, excludeIds = []) => {
    const available = levelQuestions(levelId).map((question, index) => ({ question, id: `${levelId}-extra-${index}` }));
    const pool = available.filter((entry) => !excludeIds.includes(entry.id));
    const source = pool.length ? pool : available;
    return shuffle(source)[0];
  };

  const switchTopic = (levelId) => {
    setSelectedLevelId(levelId);
    setSeenIds([]);
    setCurrentQuestion(loadQuestion(levelId, []));
    setSelected(null);
    setAnswered(false);
  };

  const answer = (choiceIndex) => {
    if (answered) return;
    const correct = choiceIndex === currentQuestion.question.answer;
    setSelected(choiceIndex);
    setAnswered(true);
    setSessionStats((current) => ({
      answered: current.answered + 1,
      correct: current.correct + (correct ? 1 : 0),
    }));
  };

  const nextQuestion = () => {
    const nextSeen = [...seenIds, currentQuestion.id];
    setSeenIds(nextSeen);
    setCurrentQuestion(loadQuestion(selectedLevelId, nextSeen));
    setSelected(null);
    setAnswered(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,#082f49,#155e75_55%,#164e63)] p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Practice Arena</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight">Keep Practicing By Topic</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-cyan-50/90">
          Pick any topic, answer extra questions, and use the study report to see what deserves another look.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-slate-950">Topic Select</h3>
                <p className="mt-2 text-slate-600">Students can jump into any finished topic for more review.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Session Score: {sessionStats.correct}/{sessionStats.answered}
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => switchTopic(level.id)}
                  className={cx(
                    "rounded-[1.5rem] border p-4 text-left transition",
                    selectedLevelId === level.id ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Level {level.order}</div>
                  <div className="mt-2 text-lg font-black text-slate-950">{level.title}</div>
                  <div className="mt-2 text-sm text-slate-600">{levelQuestions(level.id).length} questions in this topic bank</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-slate-950">Study Feedback</h3>
            <p className="mt-2 text-slate-600">These suggestions are based on game performance from the main levels and bosses.</p>
            <div className="mt-6 space-y-4">
              {focusTopics.map((topic, index) => (
                <div key={topic.id} className="rounded-[1.5rem] bg-amber-50 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                    {index === 0 ? "Top Review Target" : "Next Review Target"}
                  </div>
                  <div className="mt-2 text-lg font-black text-slate-950">{topic.title}</div>
                  <p className="mt-2 text-sm text-slate-700">
                    Focus here because {topic.reasons[0]}. Practice accuracy: {Math.round(topic.accuracy * 100)}%. Mini boss: {topic.miniBossScore}/5.
                  </p>
                </div>
              ))}
              <div className="rounded-[1.5rem] bg-emerald-50 p-4">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">Strongest Topic</div>
                <div className="mt-2 text-lg font-black text-slate-950">{strengthTopic.title}</div>
                <p className="mt-2 text-sm text-slate-700">
                  This looks strongest so far. Practice accuracy: {Math.round(strengthTopic.accuracy * 100)}%. Mini boss: {strengthTopic.miniBossScore}/5.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <QuestionCard
        question={currentQuestion.question}
        selected={selected}
        answered={answered}
        onSelect={answer}
        heading={`Practice Arena: ${selectedLevel.shortTitle}`}
        badge={difficultyLabel(currentQuestion.question.difficulty)}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">
              {answered
                ? selected === currentQuestion.question.answer
                  ? "Nice work. Keep the streak going."
                  : "Review the explanation, then try another one."
                : "Choose the best answer to keep practicing this topic."}
            </p>
            <Button onClick={nextQuestion} disabled={!answered} className="rounded-2xl">
              Next Topic Question
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default function GeneticsReviewWebsite() {
  const [reviewCode, setReviewCode] = useState("");
  const [mode, setMode] = useState("home");
  const [progress, setProgress] = useState(() => createProgress(""));

  useEffect(() => {
    if (!reviewCode) return;
    const raw = window.localStorage.getItem(storageKey(reviewCode));
    if (!raw) {
      setProgress(createProgress(reviewCode));
      return;
    }
    try {
      setProgress(sanitizeProgress(JSON.parse(raw), reviewCode));
    } catch {
      setProgress(createProgress(reviewCode));
    }
  }, [reviewCode]);

  useEffect(() => {
    if (!reviewCode) return;
    window.localStorage.setItem(storageKey(reviewCode), JSON.stringify(progress));
  }, [reviewCode, progress]);

  const safeMode = useMemo(() => {
    if (mode.startsWith("level:")) {
      const [, levelId] = mode.split(":");
      if (!LEVEL_BY_ID[levelId] || !progress.levels[levelId].unlocked) return "home";
    }
    if (mode === FINAL_BOSS_ID && !finalBossReady(progress)) return "home";
    if (mode === PRACTICE_ARENA_ID && !progress.finalBoss.passed) return "home";
    if (mode === WRITTEN_RESPONSE_ID && !progress.finalBoss.passed) return "home";
    return mode;
  }, [mode, progress]);

  const updateProgress = (updater) => {
    setProgress((current) => {
      const next = updater(current);
      next.finalBoss.unlocked = finalBossReady(next);
      return next;
    });
  };

  const handleLogin = (code) => {
    setReviewCode(code);
    setMode("home");
  };

  const resetProgress = () => {
    const fresh = createProgress(reviewCode);
    window.localStorage.setItem(storageKey(reviewCode), JSON.stringify(fresh));
    setProgress(fresh);
    setMode("home");
  };

  const logout = () => {
    setReviewCode("");
    setProgress(createProgress(""));
    setMode("home");
  };

  const openLevelIntro = (levelId) => {
    setMode(`level:${levelId}:intro`);
    updateProgress((current) => ({
      ...current,
      currentLevelId: levelId,
      levels: {
        ...current.levels,
        [levelId]: {
          ...current.levels[levelId],
          introSeen: true,
        },
      },
    }));
  };

  const startPractice = (levelId) => {
    setMode(`level:${levelId}:practice`);
    updateProgress((current) => ({
      ...current,
      currentLevelId: levelId,
    }));
  };

  const startMiniBoss = (levelId) => {
    setMode(`level:${levelId}:boss`);
  };

  const continueAfterMiniBoss = (levelId) => {
    const nextLevel = nextLevelAfter(levelId);
    if (nextLevel) {
      openLevelIntro(nextLevel.id);
      return;
    }
    setMode(FINAL_BOSS_ID);
  };

  const applyPracticeAnswer = (levelId, correct, questionId) => {
    let nextDifficulty = 1;
    updateProgress((current) => {
      const level = current.levels[levelId];
      const streak = correct ? level.practiceStreak + 1 : 0;
      const increasedDifficulty = correct && streak >= 3 && level.currentDifficulty < 3;
      nextDifficulty = correct
        ? increasedDifficulty
          ? level.currentDifficulty + 1
          : level.currentDifficulty
        : 1;
      const nextLevel = {
        ...level,
        practiceAttempts: level.practiceAttempts + 1,
        practiceCorrect: level.practiceCorrect + (correct ? 1 : 0),
        practiceStreak: increasedDifficulty ? 0 : streak,
        currentDifficulty: nextDifficulty,
        highestDifficultyReached: Math.max(level.highestDifficultyReached, nextDifficulty),
        pendingTrainingChecks: correct ? level.pendingTrainingChecks : level.pendingTrainingChecks + 1,
        practiceSeenQuestionIds: questionId && !level.practiceSeenQuestionIds.includes(questionId)
          ? [...level.practiceSeenQuestionIds, questionId]
          : level.practiceSeenQuestionIds,
      };
      return {
        ...current,
        xp: current.xp + (correct ? XP_PRACTICE_CORRECT : XP_PRACTICE_ATTEMPT),
        levels: {
          ...current.levels,
          [levelId]: nextLevel,
        },
      };
    });
    return { nextDifficulty };
  };

  const applyFollowUpAnswer = (levelId, correct, questionId) => {
    let nextDifficulty = 1;
    updateProgress((current) => {
      const level = current.levels[levelId];
      nextDifficulty = correct ? Math.max(1, level.currentDifficulty) : 1;
      const nextLevel = {
        ...level,
        practiceAttempts: level.practiceAttempts + 1,
        practiceCorrect: level.practiceCorrect + (correct ? 1 : 0),
        trainingChecks: level.trainingChecks + (correct ? 1 : 0),
        pendingTrainingChecks: correct ? Math.max(0, level.pendingTrainingChecks - 1) : level.pendingTrainingChecks,
        practiceStreak: correct ? level.practiceStreak + 1 : 0,
        currentDifficulty: correct ? level.currentDifficulty : 1,
        highestDifficultyReached: Math.max(level.highestDifficultyReached, correct ? level.currentDifficulty : 1),
        practiceSeenQuestionIds: questionId && !level.practiceSeenQuestionIds.includes(questionId)
          ? [...level.practiceSeenQuestionIds, questionId]
          : level.practiceSeenQuestionIds,
      };
      return {
        ...current,
        xp: current.xp + (correct ? XP_TRAINING_CHECK : XP_PRACTICE_ATTEMPT),
        levels: {
          ...current.levels,
          [levelId]: nextLevel,
        },
      };
    });
    return { nextDifficulty };
  };

  const applyMiniBossResult = (levelId, score, passed) => {
    updateProgress((current) => {
      const currentLevel = current.levels[levelId];
      const nextLevels = {
        ...current.levels,
        [levelId]: {
          ...currentLevel,
          miniBoss: {
            attempts: currentLevel.miniBoss.attempts + 1,
            bestScore: Math.max(currentLevel.miniBoss.bestScore, score),
            passed: currentLevel.miniBoss.passed || passed,
          },
        },
      };
      const nextBadges = current.badgesEarned.includes(levelId)
        ? current.badgesEarned
        : passed
          ? [...current.badgesEarned, levelId]
          : current.badgesEarned;
      const currentIndex = LEVELS.findIndex((level) => level.id === levelId);
      if (passed && currentIndex < LEVELS.length - 1) {
        nextLevels[LEVELS[currentIndex + 1].id] = {
          ...nextLevels[LEVELS[currentIndex + 1].id],
          unlocked: true,
        };
      }
      return {
        ...current,
        xp: current.xp + (passed ? XP_MINI_BOSS_PASS : 0),
        badgesEarned: nextBadges,
        currentLevelId:
          passed && currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1].id : current.currentLevelId,
        levels: nextLevels,
      };
    });
  };

  const applyFinalBossResult = (score, passed) => {
    updateProgress((current) => ({
      ...current,
      xp: current.xp + (passed ? XP_FINAL_BOSS_PASS : 0),
      finalBoss: {
        unlocked: true,
        attempts: current.finalBoss.attempts + 1,
        bestScore: Math.max(current.finalBoss.bestScore, score),
        passed: current.finalBoss.passed || passed,
      },
    }));
  };

  const updateWrittenResponse = (promptId, patch) => {
    updateProgress((current) => {
      if (promptId === null) {
        return {
          ...current,
          writtenResponse: {
            ...current.writtenResponse,
            ...patch,
          },
        };
      }
      return {
        ...current,
        writtenResponse: {
          ...current.writtenResponse,
          prompts: {
            ...current.writtenResponse.prompts,
            [promptId]: {
              ...current.writtenResponse.prompts[promptId],
              ...patch,
            },
          },
        },
      };
    });
  };

  if (!reviewCode) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const nav = [
    ["home", "Home"],
    ["dashboard", "Dashboard"],
    [FINAL_BOSS_ID, "Final Boss"],
    ["completion", "Completion Center"],
    [PRACTICE_ARENA_ID, "Practice Arena"],
    [WRITTEN_RESPONSE_ID, "Written Response"],
  ];

  let content = <Home progress={progress} setMode={setMode} />;
  if (safeMode === "dashboard") {
    content = <Dashboard progress={progress} setMode={setMode} resetProgress={resetProgress} />;
  } else if (safeMode === "completion") {
    content = <CompletionCenter progress={progress} />;
  } else if (safeMode === PRACTICE_ARENA_ID) {
    content = <PracticeArena progress={progress} />;
  } else if (safeMode === WRITTEN_RESPONSE_ID) {
    content = <WrittenResponseTab progress={progress} updateWrittenResponse={updateWrittenResponse} />;
  } else if (safeMode === FINAL_BOSS_ID) {
    content = <FinalBoss progress={progress} applyFinalBossResult={applyFinalBossResult} />;
  } else if (safeMode.startsWith("level:")) {
    const [, levelId, stage] = safeMode.split(":");
    const level = LEVEL_BY_ID[levelId];
    if (stage === "intro") {
      content = (
        <LevelIntro
          level={level}
          progress={progress}
          startPractice={() => startPractice(levelId)}
          startMiniBoss={() => startMiniBoss(levelId)}
        />
      );
    } else if (stage === "practice") {
      content = (
        <LevelPractice
          level={level}
          progress={progress}
          applyPracticeAnswer={applyPracticeAnswer}
          applyFollowUpAnswer={applyFollowUpAnswer}
          goToIntro={() => openLevelIntro(levelId)}
          startMiniBoss={() => startMiniBoss(levelId)}
        />
      );
    } else if (stage === "boss") {
      content = (
        <MiniBoss
          level={level}
          progress={progress}
          applyMiniBossResult={applyMiniBossResult}
          backToLevel={() => openLevelIntro(levelId)}
          continueAfterBoss={() => continueAfterMiniBoss(levelId)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#f0fdf4_45%,#ffffff)] p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-slate-950 p-4 text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-950">Genetics Review Game</div>
                <div className="text-sm text-slate-500">
                  Review code <span className="font-semibold tracking-[0.2em] text-slate-700">{reviewCode}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {nav.map(([id, label]) => (
                <Button
                  key={id}
                  variant={safeMode === id ? "default" : "outline"}
                  disabled={
                    (id === FINAL_BOSS_ID && !finalBossReady(progress)) ||
                    ((id === PRACTICE_ARENA_ID || id === WRITTEN_RESPONSE_ID) && !progress.finalBoss.passed)
                  }
                  onClick={() => setMode(id)}
                  className="rounded-2xl"
                >
                  {label}
                </Button>
              ))}
              <Button variant="outline" onClick={() => openLevelIntro(progress.currentLevelId)} className="rounded-2xl">
                Current Level
              </Button>
              <Button variant="outline" onClick={logout} className="rounded-2xl">
                Switch Code
              </Button>
            </div>
          </div>
        </header>

        {content}
      </div>
    </div>
  );
}
