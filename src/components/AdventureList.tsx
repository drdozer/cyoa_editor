import React from 'react';
import { Adventure } from '../types';
import { PlusCircle, Edit, Trash } from 'lucide-react';

interface AdventureListProps {
  adventures: Adventure[];
  onCreateAdventure: () => void;
  onEditAdventure: (id: string) => void;
  onDeleteAdventure: (id: string) => void;
}

const AdventureList: React.FC<AdventureListProps> = ({
  adventures,
  onCreateAdventure,
  onEditAdventure,
  onDeleteAdventure,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Choose Your Own Adventure Stories</h1>
      <button
        onClick={onCreateAdventure}
        className="mb-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <PlusCircle className="mr-2" size={20} />
        Create New Adventure
      </button>
      {adventures.length === 0 ? (
        <p className="text-gray-600">No adventures created yet. Start by creating a new one!</p>
      ) : (
        <ul className="space-y-4">
          {adventures.map((adventure) => (
            <li
              key={adventure.id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <span className="text-xl font-semibold">{adventure.title}</span>
              <div className="space-x-2">
                <button
                  onClick={() => onEditAdventure(adventure.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => onDeleteAdventure(adventure.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdventureList;