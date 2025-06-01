import React from 'react';
import { useDrag } from 'react-dnd';
import { FormField, FieldType } from '../../types';
import { createNewField } from '../../utils/formUtils';

interface ToolboxItemProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ type, label, icon }) => {
  const field = React.useMemo(() => createNewField(type), [type]);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TOOLBOX_ITEM',
    item: { type: 'TOOLBOX_ITEM', field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  return (
    <div 
      ref={drag}
      className={`flex items-center p-3 mb-2 border rounded-md bg-[var(--card-bg)] cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="mr-2 text-gray-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default ToolboxItem;