import React from 'react';
import { 
  Type, 
  AlignLeft, 
  ListChecks, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Hash, 
  Mail, 
  Phone 
} from 'lucide-react';
import ToolboxItem from './ToolboxItem';

const Toolbox: React.FC = () => {
  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-md">
      <h3 className="text-sm font-medium  mb-3">Form Elements</h3>
      
      <div className="space-y-2">
        <ToolboxItem 
          type="text" 
          label="Text" 
          icon={<Type size={18} />} 
        />
        
        <ToolboxItem 
          type="textarea" 
          label="Textarea" 
          icon={<AlignLeft size={18} />} 
        />
        
        <ToolboxItem 
          type="dropdown" 
          label="Dropdown" 
          icon={<ListChecks size={18} />} 
        />
        
        <ToolboxItem 
          type="checkbox" 
          label="Checkbox" 
          icon={<CheckSquare size={18} />} 
        />
        
        <ToolboxItem 
          type="radio" 
          label="Radio" 
          icon={<Circle size={18} />} 
        />
        
        <ToolboxItem 
          type="date" 
          label="Date" 
          icon={<Calendar size={18} />} 
        />
        
        <ToolboxItem 
          type="number" 
          label="Number" 
          icon={<Hash size={18} />} 
        />
        
        <ToolboxItem 
          type="email" 
          label="Email" 
          icon={<Mail size={18} />} 
        />
        
        <ToolboxItem 
          type="phone" 
          label="Phone" 
          icon={<Phone size={18} />} 
        />
      </div>
    </div>
  );
};

export default Toolbox;