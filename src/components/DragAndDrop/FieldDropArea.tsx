import React from 'react';
import { useDrop } from 'react-dnd';
import { FormField } from '../../types';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import DraggableField from './DraggableField';

interface FieldDropAreaProps {
  stepId: string;
  fields: FormField[];
}

const FieldDropArea: React.FC<FieldDropAreaProps> = ({ stepId, fields }) => {
  const { dispatch } = useFormBuilder();
  
  const [{ isOver }, drop] = useDrop({
    accept: ['FIELD', 'TOOLBOX_ITEM'],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: any) => {
      if (item.type === 'TOOLBOX_ITEM') {
        // Handle dropping a new field from the toolbox
        dispatch({
          type: 'ADD_FIELD',
          payload: { stepId, field: item.field }
        });
      }
    },
  });

  const moveField = (dragIndex: number, hoverIndex: number) => {
    // Create a new array with the fields in the new order
    const newFields = [...fields];
    const draggedField = newFields[dragIndex];
    
    // Remove the dragged field and insert it at the new position
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    
    // Update the state with the new order
    dispatch({
      type: 'REORDER_FIELDS',
      payload: { stepId, newOrder: newFields }
    });
  };

  return (
    <div
      ref={drop}
      className={`min-h-[200px] p-4 rounded-md transition-colors ${
        isOver ? 'bg-[var(--bg-color)] border-2 border-dashed border-blue-300' : 'bg-[var(--card-bg)]'
      }`}
    >
      {fields.length === 0 && (
        <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">Drag and drop fields here</p>
        </div>
      )}
      
      {fields.map((field, index) => (
        <DraggableField
          key={field.id}
          field={field}
          index={index}
          stepId={stepId}
          moveField={moveField}
        />
      ))}
    </div>
  );
};

export default FieldDropArea;