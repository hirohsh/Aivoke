import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Data {
  id: number;
  name: string;
}

export interface SelectBoxProps {
  items: Data[];
  selected: Data;
  onChange: (value: Data) => void;
  nonce?: string;
}

export function SelectBox({ items, selected, onChange, nonce }: SelectBoxProps) {
  // Selectコンポーネントは文字列をvalueとして扱うため、
  // 選択されたアイテムのIDを文字列として管理し、変更時に対応するDataオブジェクトを返す
  const handleValueChange = (value: string) => {
    const selectedItem = items.find((item) => item.id.toString() === value);
    if (selectedItem) {
      onChange(selectedItem);
    }
  };

  return (
    <Select value={selected.id.toString()} onValueChange={handleValueChange}>
      <SelectTrigger
        nonce={nonce}
        className="min-w-[120px] border-none bg-transparent shadow-none hover:cursor-pointer hover:bg-input/60 focus-visible:ring-1 dark:bg-transparent dark:hover:bg-input/30"
      >
        <SelectValue nonce={nonce} placeholder={selected.name}>
          {selected.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent nonce={nonce}>
        {items.map((item) => (
          <SelectItem nonce={nonce} key={item.id} value={item.id.toString()}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
