import React from 'react';
import { DeleteDeskModal } from './DeleteDeskModel';
import { EditDeskModal } from './EditDeskModal';
import { AddDeskModal } from './AddDeskModal';

type Desk = {
  deskId: number;
  name: string;
  locationId: number;
};

type DeskListProps = {
  desks: Desk[];
  selectedDeskId: number | null;
  isAdmin: boolean;
  onDeskSelect: (deskId: number) => void;
  onLocationRefresh: () => void;
};

const DeskList: React.FC<DeskListProps> = ({
  desks,
  selectedDeskId,
  isAdmin,
  onDeskSelect,
  onLocationRefresh,
}) => (
  <div className="">
    <div className="text-xl font-semibold mt-4">Desks</div>
    <div className="text-sm text-gray-400">
      {selectedDeskId
        ? `Desk ${
            desks.findIndex((desk) => desk.deskId === selectedDeskId) + 1
          } of ${desks.length} selected`
        : `${desks.length} ${desks.length === 1 ? 'desk' : 'desks'} available`}
    </div>
    <div
      className={`flex flex-wrap ${
        isAdmin ? 'flex-col' : 'flex-row'
      } items-start justify-center`}
    >
      {desks.map((desk) => (
        <div
          key={desk.deskId}
          className={`${
            isAdmin ? 'flex flex-row items-center justify-center' : ''
          }`}
        >
          <div
            className={`border rounded-lg p-2 ${
              isAdmin ? '' : 'm-2'
            } cursor-pointer`}
            onClick={() => onDeskSelect(desk.deskId)}
          >
            <div
              className={`text-center w-36 ${
                selectedDeskId === desk.deskId ? 'text-special' : ''
              }`}
            >
              <div className="font-bold">{desk.name}</div>
              <div className="text-xs">ID: {desk.deskId}</div>
            </div>
          </div>
          {isAdmin && (
            <>
              <DeleteDeskModal
                deskId={desk.deskId}
                deskName={desk.name}
                onSuccess={onLocationRefresh}
              />
              <EditDeskModal
                deskId={desk.deskId}
                deskName={desk.name}
                onSuccess={onLocationRefresh}
              />
            </>
          )}
        </div>
      ))}
      {isAdmin && (
        <AddDeskModal
          locationId={desks[0]?.locationId}
          onSuccess={onLocationRefresh}
          userId={2}
        />
      )}
    </div>
  </div>
);

export default DeskList;
