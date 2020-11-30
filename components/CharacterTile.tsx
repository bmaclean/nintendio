import clsx from 'clsx';
import { HTMLAttributes, useState } from 'react';
import { SmashCharacter } from '../types/SmashCharacter';
import { User } from '../types/User';

interface CharcaterTileProps extends HTMLAttributes<HTMLDivElement> {
  character: SmashCharacter;
  onDisableCharacter: (character: SmashCharacter) => void;
  onAssignCharacter: (character: SmashCharacter) => void;
  userOptions?: User[];
}

export default function CharacterTile({
  character,
  className,
  onDisableCharacter,
  onAssignCharacter,
  userOptions,
  ...props
}: CharcaterTileProps) {
  const [active, setActive] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  return (
    <div
      className={clsx(
        `${active ? 'static h-auto z-30' : 'h-14 mb-0'} ${
          character.disabled && !active ? 'opacity-50' : 'opacity-100'
        } ${
          character.selected
            ? `border-${user?.colour || 'purple'}-500 ring-2 ring-${
                user?.colour || 'purple'
              }-500 bg-${user?.colour || 'purple'}-200`
            : 'border-0'
        } transition-all duration-300 bg-gray-100 rounded-md hover:bg-blue-400 text-gray-500 hover:text-blue-100 cursor-pointer text-sm flex items-center justify-start p-2 flex-col`,
        className
      )}
      onClick={() => setActive(!active)}
      onMouseLeave={() => setActive(false)}
      {...props}
    >
      <div className="flex items-center w-full pb-2">
        <img
          src={`/thumbnails/${character.thumbnail || 'smash.png'}`}
          className="rounded-full h-10 w-10"
        />
        <span className="pl-4 overflow-ellipsis overflow-hidden">
          {character.name}
        </span>
      </div>

      <div
        className={`${
          active ? 'visible' : 'invisible'
        } w-full flex justify-center items-center flex-col`}
      >
        <button
          onClick={() =>
            onDisableCharacter({
              ...character,
              disabled: !character.disabled,
            })
          }
          className={'px-2 py-1 text-gray-200 w-full font-bold'}
        >
          {character.disabled ? 'ENABLE' : 'DISABLE'}
        </button>
        {userOptions.length ? (
          userOptions.map((user, i) => (
            <button
              key={user.name + i}
              onClick={() => {
                onAssignCharacter({
                  ...character,
                  selected: !character.selected,
                });
                setUser(user);
              }}
              disabled={character.disabled}
              className={`${
                character.selected ? 'opacity-50' : ''
              } px-2 py-1 mt-1 w-full text-${
                user.colour
              }-400 font-bold rounded-md bg-${user.colour}-100`}
            >
              {character.selected ? 'UNASSIGN' : `ASSIGN TO ${user.name}`}
            </button>
          ))
        ) : (
          <button
            onClick={() =>
              onAssignCharacter({
                ...character,
                selected: !character.selected,
              })
            }
            disabled={character.disabled}
            className={`${
              character.selected ? 'opacity-50' : ''
            } px-2 py-1 mt-1 w-full text-blue-400 font-bold rounded-md bg-blue-100`}
          >
            {character.selected ? 'UNASSIGN' : 'ASSIGN'}
          </button>
        )}
      </div>
    </div>
  );
}
