
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TicketCard from "./TicketCard";

const KanbanColumn = ({
  status,
  tickets,
  onTicketClick,
}) => {
  const colors = {
    "To Do": "border-blue-500",
    "In Progress": "border-yellow-500",
    Done: "border-green-500",
  };

  return (
    <div
      className={`min-w-[300px] flex-1 bg-gray-900 border-t-4 ${
        colors[status] || "border-gray-600"
      } rounded-xl p-4`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{status}</h3>

        <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full">
          {tickets.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] space-y-3 rounded-lg transition ${
              snapshot.isDraggingOver
                ? "bg-gray-800"
                : ""
            }`}
          >
            {tickets.map((ticket, index) => (
              <Draggable
                key={ticket._id}
                draggableId={ticket._id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={
                      snapshot.isDragging
                        ? "opacity-80"
                        : ""
                    }
                  >
                    <TicketCard
                      ticket={ticket}
                      onClick={() => onTicketClick?.(ticket)}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {tickets.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                No tickets here
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;