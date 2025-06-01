import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { FormField } from '../../types';
import { useFormBuilder } from '../../contexts/FormBuilderContext';

interface DraggableFieldProps {
  field: FormField;
  index: number;
  stepId: string;
  moveField: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, index, stepId, moveField }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { state, dispatch } = useFormBuilder();
  const isSelected = state.selectedFieldId === field.id;

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'FIELD',
    item: { type: 'FIELD', id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: 'FIELD',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveField(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleSelectField = () => {
    dispatch({ type: 'SELECT_FIELD', payload: field.id });
  };

  const handleDeleteField = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'REMOVE_FIELD',
      payload: { stepId, fieldId: field.id }
    });
  };

  const opacity = isDragging ? 0.4 : 1;
  
  return (
    <div 
      ref={dragPreview}
      style={{ opacity }}
      className={`mb-2 border rounded-md ${
        isSelected ? 'border-blue-500 bg-[var(--card2-bg)]' : 'bg-[var(--card-bg)]'
      }`}
      onClick={handleSelectField}
      data-handler-id={handlerId}
    >
      <div className="flex items-center p-3">
        <div ref={ref} className="mr-2 cursor-move">
          <GripVertical size={20} className="text-gray-400" />
        </div>
        
        <div className="flex-1">
          <div className="font-medium">{field.label || 'Untitled field'}</div>
          <div className="text-sm text-gray-500">{field.type}</div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleSelectField}
          >
            <Pencil size={18} className="text-gray-500" />
          </button>
          
          <button
            type="button"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleDeleteField}
          >
            <Trash2 size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableField;