import { Activity, Brain, Heart, Bird, Flag } from 'lucide-react';

export const getBubbleWordColor = (word: string): string => {
  const wordUpper = word.toUpperCase().trim();
  if (wordUpper.startsWith('S')) {
    const num = parseInt(wordUpper.substring(1));
    if (!isNaN(num)) {
      const index = (num - 1) % 5;
      const colors = ['#ef4444', '#38bdf8', '#facc15', '#2dd4bf', '#c084fc'];
      return colors[index];
    }
  } else if (wordUpper.startsWith('N')) {
    const num = parseInt(wordUpper.substring(1));
    if (!isNaN(num)) {
      const cleanNum = ((num - 1) % 10) % 5;
      const colors = ['#ef4444', '#38bdf8', '#facc15', '#2dd4bf', '#c084fc'];
      return colors[cleanNum];
    }
  }
  return 'rgba(255, 255, 255, 0.85)';
};

export const getBubbleIcon = (word: string) => {
  const wordUpper = word.toUpperCase().trim();
  let index = -1;
  if (wordUpper.startsWith('S')) {
    const num = parseInt(wordUpper.substring(1));
    if (!isNaN(num)) {
      index = (num - 1) % 5;
    }
  } else if (wordUpper.startsWith('N')) {
    const num = parseInt(wordUpper.substring(1));
    if (!isNaN(num)) {
      index = ((num - 1) % 10) % 5;
    }
  }
  const icons = [Activity, Brain, Heart, Bird, Flag];
  if (index >= 0 && index < icons.length) {
    return icons[index];
  }
  return null;
};

export const getDecorIcon = (word: string) => {
  const wordLower = word.toLowerCase().trim();
  if (wordLower.startsWith('d')) {
    const num = parseInt(wordLower.substring(1));
    if (!isNaN(num)) {
      const index = (num - 1) % 5;
      const icons = [Activity, Brain, Heart, Bird, Flag];
      return icons[index];
    }
  }
  return null;
};
