import React, { useReducer } from 'react';
import { GetStaticProps } from 'next';
import smashCharacters from '../assets/characters.json';
import { SmashCharacter } from '../types/SmashCharacter';
import { CharacterTile } from '../components';

interface SmashDownPageProps {
  characters: SmashCharacter[];
}

type CharacterReducerAction = {
  type: 'UPDATE_CHARACTER';
  character?: SmashCharacter;
};

function charactersReducer(
  state: SmashCharacter[],
  action: CharacterReducerAction
): SmashCharacter[] {
  switch (action.type) {
    case 'UPDATE_CHARACTER':
      return state.map((oldChar) =>
        oldChar.id === action.character.id ? action.character : oldChar
      );
    default:
      return state;
  }
}

export default function SmashDownPage({
  characters,
}: SmashDownPageProps): JSX.Element {
  const [state, dispatch] = useReducer(charactersReducer, characters);

  return (
    <div className="flex flex-col justify-center items-center w-screen bg-gradient-to-r from-blue-100 to-blue-200 pb-16">
      <div className="flex items-center justify-center h-44 flex-col">
        <h1 className="font-header text-7xl text-blue-900">Smash Down</h1>
        <hr className="border-blue-900 w-24" />
      </div>
      <div className="flex flex-row max-w-6xl flex-wrap pl-4">
        {state.map((character) => (
          <CharacterTile
            key={character.id}
            character={character}
            className="mr-4 w-36 mb-4"
            onDisableCharacter={(character) => {
              dispatch({ type: 'UPDATE_CHARACTER', character });
            }}
            onAssignCharacter={(character) => {
              dispatch({ type: 'UPDATE_CHARACTER', character });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () =>
  // TODO: find an API that works
  // const res = await fetch('http://smashdb.me/api/characters')
  // const data = await res.json()
  ({
    props: {
      characters: smashCharacters,
    }, // will be passed to the page component as props
  });
