
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TicketCard from "./TicketCard";

const KanbanColumn = ({ title, tickets, color }) => {

  return (
    <div className="min-w-[300px] flex-1 bg-slate-900/60 rounded-2xl p-4">

      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />

          <h2 className="font-semibold text-white">
            {title}
          </h2>
        </div>

        <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
          {tickets.length}
        </span>

      </div>

      <Droppable droppableId={title}>
        {(provided, snapshot) => (

          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[450px] space-y-3 rounded-xl transition ${
              snapshot.isDraggingOver
                ? "bg-slate-800/80"
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
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1
                    }}
                  >
                    <TicketCard ticket={ticket} />
                  </div>

                )}
              </Draggable>

            ))}

            {provided.placeholder}

          </div>

        )}
      </Droppable>

    </div>
  );
};

export default KanbanColumn;
