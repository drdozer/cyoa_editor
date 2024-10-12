import { Adventure, Place, LintingError } from '../types';

export const lintAdventure = (adventure: Adventure): LintingError[] => {
  const errors: LintingError[] = [];

  adventure.places.forEach((place) => {
    const placeErrors = lintPlace(place);
    errors.push(...placeErrors);
  });

  if (!adventure.places.some(place => place.isStart)) {
    errors.push({
      type: 'place',
      id: 'adventure',
      message: 'Adventure has no starting place'
    });
  }

  return errors;
};

const lintPlace = (place: Place): LintingError[] => {
  const errors: LintingError[] = [];

  if (!place.isEnding && place.choices.length === 0) {
    errors.push({
      type: 'place',
      id: place.id,
      message: 'Place has no choices and is not an ending'
    });
  }

  if (place.isEnding && place.choices.length > 0) {
    errors.push({
      type: 'place',
      id: place.id,
      message: 'Ending place should not have choices'
    });
  }

  place.choices.forEach((choice, index) => {
    if (!choice.nextPlaceId) {
      errors.push({
        type: 'choice',
        id: `${place.id}-${index}`,
        message: 'Choice has no target place selected'
      });
    }
  });

  return errors;
};