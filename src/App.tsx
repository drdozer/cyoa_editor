import React, { useState, useEffect } from 'react';
import AdventureList from './components/AdventureList';
import AdventureEditor from './components/AdventureEditor';
import { Adventure } from './types';
import { getAdventures, saveAdventure, deleteAdventure } from './utils/storage';

function App() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setAdventures(getAdventures());
  }, []);

  const handleCreateAdventure = () => {
    setCurrentAdventure(null);
    setIsEditing(true);
  };

  const handleEditAdventure = (id: string) => {
    const adventure = adventures.find((a) => a.id === id);
    if (adventure) {
      setCurrentAdventure(adventure);
      setIsEditing(true);
    }
  };

  const handleDeleteAdventure = (id: string) => {
    if (window.confirm('Are you sure you want to delete this adventure?')) {
      deleteAdventure(id);
      setAdventures(getAdventures());
    }
  };

  const handleSaveAdventure = (adventure: Adventure) => {
    saveAdventure(adventure);
    setAdventures(getAdventures());
    setIsEditing(false);
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isEditing ? (
        <AdventureEditor
          adventure={currentAdventure}
          onSave={handleSaveAdventure}
          onBack={handleBack}
        />
      ) : (
        <AdventureList
          adventures={adventures}
          onCreateAdventure={handleCreateAdventure}
          onEditAdventure={handleEditAdventure}
          onDeleteAdventure={handleDeleteAdventure}
        />
      )}
    </div>
  );
}

export default App;