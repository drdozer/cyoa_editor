export interface Place {
  id: string;
  title: string;
  description: string;
  isStart: boolean;
  isEnding: boolean;
  choices: Choice[];
}

export interface Choice {
  text: string;
  nextPlaceId: string;
}

export interface Adventure {
  id: string;
  title: string;
  places: Place[];
}

export interface LintingError {
  type: 'place' | 'choice';
  id: string;
  message: string;
}