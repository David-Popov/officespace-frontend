import { Slider } from "@/components/ui/slider";
import { PriceRangeFilterProps } from "@/types/filter-props.types";

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ priceRange, onChange }) => (
  <div className="space-y-4">
    <h3 className="font-medium">Price Range (per hour)</h3>
    <div className="px-4">
      <Slider
        defaultValue={priceRange}
        max={1000}
        step={50}
        value={priceRange}
        onValueChange={onChange}
      />
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>
  </div>
);
