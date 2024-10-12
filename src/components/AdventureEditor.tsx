import React, { useState, useEffect } from 'react';
import { Adventure, Place, Choice, LintingError } from '../types';
import { ArrowLeft, PlusCircle, Save, AlertTriangle } from 'lucide-react';
import { lintAdventure } from '../utils/linting';

interface AdventureEditorProps {
  adventure: Adventure | null;
  onSave: (adventure: Adventure) => void;
  onBack: () => void;
}

const AdventureEditor: React.FC<AdventureEditorProps> = ({ adventure, onSave, onBack }) => {
  const [title, setTitle] = useState(adventure?.title || '');
  const [places, setPlaces] = useState<Place[]>(adventure?.places || []);
  const [lintingErrors, setLintingErrors] = useState<LintingError[]>([]);

  useEffect(() => {
    if (adventure) {
      setTitle(adventure.title);
      setPlaces(adventure.places);
    }
  }, [adventure]);

  useEffect(() => {
    const errors = lintAdventure({ id: adventure?.id || '', title, places });
    setLintingErrors(errors);
  }, [title, places]);

  const handleSave = () => {
    if (title.trim() === '') {
      alert('Please enter a title for the adventure.');
      return;
    }

    if (places.length === 0) {
      alert('Please add at least one place to the adventure.');
      return;
    }

    const newAdventure: Adventure = {
      id: adventure?.id || Date.now().toString(),
      title,
      places,
    };

    onSave(newAdventure);
  };

  const addPlace = () => {
    const newPlace: Place = {
      id: Date.now().toString(),
      title: `Place ${places.length + 1}`,
      description: '',
      isStart: places.length === 0,
      isEnding: false,
      choices: [],
    };
    setPlaces([...places, newPlace]);
    return newPlace;
  };

  const updatePlace = (index: number, updatedPlace: Place) => {
    const newPlaces = [...places];
    newPlaces[index] = updatedPlace;
    setPlaces(newPlaces);
  };

  const addChoice = (placeIndex: number) => {
    const updatedPlace = { ...places[placeIndex] };
    updatedPlace.choices.push({ text: '', nextPlaceId: '' });
    updatePlace(placeIndex, updatedPlace);
  };

  const updateChoice = (placeIndex: number, choiceIndex: number, updatedChoice: Choice) => {
    const updatedPlace = { ...places[placeIndex] };
    updatedPlace.choices[choiceIndex] = updatedChoice;
    updatePlace(placeIndex, updatedPlace);
  };

  const getPlaceErrors = (placeId: string) => {
    return lintingErrors.filter(error => error.type === 'place' && error.id === placeId);
  };

  const getChoiceErrors = (placeId: string, choiceIndex: number) => {
    return lintingErrors.filter(error => error.type === 'choice' && error.id === `${placeId}-${choiceIndex}`);
  };

  const handleNewPlaceForChoice = (placeIndex: number, choiceIndex: number) => {
    const newPlace = addPlace();
    updateChoice(placeIndex, choiceIndex, {
      ...places[placeIndex].choices[choiceIndex],
      nextPlaceId: newPlace.id,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="mr-2" size={20} />
          Back to Adventures
        </button>
        <button
          onClick={handleSave}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Save className="mr-2" size={20} />
          Save Adventure
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adventure Title"
        className="w-full text-2xl font-bold mb-4 p-2 border rounded"
      />

      {places.map((place, placeIndex) => (
        <div key={place.id} className="mb-8 bg-white shadow-md rounded-lg p-4 relative">
          {getPlaceErrors(place.id).length > 0 && (
            <div className="absolute top-2 right-2 text-yellow-500 group">
              <AlertTriangle size={24} />
              <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 p-2 rounded shadow-lg z-10">
                {getPlaceErrors(place.id).map((error, index) => (
                  <p key={index} className="text-yellow-600">{error.message}</p>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={place.title}
              onChange={(e) =>
                updatePlace(placeIndex, { ...place, title: e.target.value })
              }
              placeholder="Place Title"
              className="flex-grow text-xl font-semibold p-2 border rounded mr-2"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={place.isStart}
                onChange={(e) =>
                  updatePlace(placeIndex, { ...place, isStart: e.target.checked })
                }
                className="mr-2"
              />
              Start
            </label>
            <label className="flex items-center ml-4">
              <input
                type="checkbox"
                checked={place.isEnding}
                onChange={(e) =>
                  updatePlace(placeIndex, { ...place, isEnding: e.target.checked })
                }
                className="mr-2"
              />
              Ending
            </label>
          </div>
          <textarea
            value={place.description}
            onChange={(e) =>
              updatePlace(placeIndex, { ...place, description: e.target.value })
            }
            placeholder="Place Description"
            className="w-full h-24 mb-4 p-2 border rounded"
          />
          {!place.isEnding && (
            <>
              <h4 className="font-semibold mb-2">Choices:</h4>
              {place.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex mb-2 relative">
                  {getChoiceErrors(place.id, choiceIndex).length > 0 && (
                    <div className="absolute -left-6 top-2 text-yellow-500 group">
                      <AlertTriangle size={16} />
                      <div className="hidden group-hover:block absolute left-0 bg-white border border-gray-200 p-2 rounded shadow-lg z-10">
                        {getChoiceErrors(place.id, choiceIndex).map((error, index) => (
                          <p key={index} className="text-yellow-600">{error.message}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) =>
                      updateChoice(placeIndex, choiceIndex, {
                        ...choice,
                        text: e.target.value,
                      })
                    }
                    placeholder="Choice text"
                    className="flex-grow mr-2 p-2 border rounded"
                  />
                  <select
                    value={choice.nextPlaceId}
                    onChange={(e) =>
                      updateChoice(placeIndex, choiceIndex, {
                        ...choice,
                        nextPlaceId: e.target.value,
                      })
                    }
                    className="p-2 border rounded mr-2"
                  >
                    <option value="">Select next place</option>
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleNewPlaceForChoice(placeIndex, choiceIndex)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    New Place
                  </button>
                </div>
              ))}
              <button
                onClick={() => addChoice(placeIndex)}
                className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
              >
                <PlusCircle className="mr-2" size={16} />
                Add Choice
              </button>
            </>
          )}
        </div>
      ))}

      <button
        onClick={addPlace}
        className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <PlusCircle className="mr-2" size={20} />
        Add New Place
      </button>
    </div>
  );
};

export default AdventureEditor;