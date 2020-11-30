import React, { useEffect, useReducer, useState } from 'react';
import { GetStaticProps } from 'next';
import smashCharacters from '../assets/characters.json';
import { SmashCharacter } from '../types/SmashCharacter';
import { CharacterTile } from '../components';
import Button from '../components/Button';
import shuffle from '../utils/shuffle';

interface SmashDownPageProps {
  characters: SmashCharacter[];
}

type UpdateAction = {
  type: 'UPDATE_CHARACTER';
  character: SmashCharacter;
};

type UpdateAllAction = {
  type: 'UPDATE_CHARACTERS';
  characters: SmashCharacter[];
};

type CharacterReducerAction = UpdateAction | UpdateAllAction;

function charactersReducer(
  state: SmashCharacter[],
  action: CharacterReducerAction
): SmashCharacter[] {
  switch (action.type) {
    case 'UPDATE_CHARACTER':
      localStorage.setItem(
        action.character.id.toString(),
        JSON.stringify(action.character)
      );
      return state.map((oldChar) =>
        oldChar.id === action.character.id ? action.character : oldChar
      );
    case 'UPDATE_CHARACTERS':
      return [...action.characters];
    default:
      return state;
  }
}

export default function SmashDownPage({
  characters,
}: SmashDownPageProps): JSX.Element {
  const [state, dispatch] = useReducer(charactersReducer, characters);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let foundCachedCharacter = false;
    const preCacheState = [...characters];
    characters.forEach((character, i) => {
      const cachedItem = localStorage.getItem(character.id.toString());
      if (cachedItem) {
        foundCachedCharacter = true;
        preCacheState[i] = JSON.parse(cachedItem);
      }
    });

    if (foundCachedCharacter) {
      dispatch({ type: 'UPDATE_CHARACTERS', characters: preCacheState });
    }
  }, [characters]);

  function randomize(n?: number) {
    if (typeof n === 'undefined') {
      // Reset
      localStorage.clear();
      dispatch({ type: 'UPDATE_CHARACTERS', characters });
      return;
    }

    const randomizedCharacters = shuffle(
      // TODO: yuck
      characters.filter(
        (c) => !state.find((statefulChar) => statefulChar.id === c.id)?.disabled
      )
    ).slice(0, n * 3);

    if (randomizedCharacters.length < n) {
      // TODO: error: disabled too many characters to provide n randomized
      console.error('dumbass');
    }

    dispatch({ type: 'UPDATE_CHARACTERS', characters: randomizedCharacters });
  }

  return (
    <div className="flex flex-col justify-center items-center w-screen bg-gradient-to-r from-blue-100 to-blue-200 pb-16 min-h-screen">
      <div className="flex items-center justify-center h-44 flex-col">
        <h1 className="font-header text-7xl text-blue-900">Smash Down</h1>
        <hr className="border-blue-900 w-24" />
      </div>
      <div className="flex items-center justify-center flex-col mb-8">
        <input
          type="text"
          className="opacity-50 bg-grey-300 rounded h-8 w-64 p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pablo's a bitch"
        />
      </div>
      <div className="flex flex-row max-w-6xl flex-wrap justify-evenly w-full mb-8">
        <Button onClick={() => randomize(3)}>3 rounds</Button>
        <Button onClick={() => randomize(6)}>6 rounds</Button>
        <Button onClick={() => randomize(9)}>9 rounds</Button>
        <Button onClick={() => randomize(15)}>15 rounds</Button>
        <Button onClick={() => randomize(21)}>21 rounds</Button>
        <Button onClick={() => randomize()}>Reset</Button>
      </div>
      <div className="flex flex-row flex-grow max-w-6xl flex-wrap pl-4 justify-center">
        {state
          .filter((character) =>
            character.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((character) => (
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

SmashDownPage.title = 'Smash Down';

export const getStaticProps: GetStaticProps = async () =>
  // TODO: find an API that works
  // const res = await fetch('http://smashdb.me/api/characters')
  // const data = await res.json()
  ({
    props: {
      characters: smashCharacters,
    }, // will be passed to the page component as props
  });
