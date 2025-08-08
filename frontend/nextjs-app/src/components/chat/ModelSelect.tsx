'use client';
import { useModel } from '@/providers/ModelProvider';
import { ModelId, ModeSelectItem } from '@/types/modelTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ModelSelect() {
  const { handleModelChange, selectedModel, modelDefinition } = useModel();

  const selectItems: ModeSelectItem[] = modelDefinition
    ? Object.entries(modelDefinition).map(([id, { name }]) => ({
        id: id as ModelId,
        name,
      }))
    : [];

  return (
    <Select value={selectedModel ?? ''} onValueChange={handleModelChange} disabled={!selectedModel}>
      <SelectTrigger className="min-w-[120px] border-none bg-transparent shadow-none hover:cursor-pointer hover:bg-input/60 focus-visible:ring-1 dark:bg-transparent dark:hover:bg-input/30">
        <SelectValue placeholder={'Please register your API key.'} />
      </SelectTrigger>
      <SelectContent>
        {selectItems.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
