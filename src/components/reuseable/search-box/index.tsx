import { Input } from "@/components/ui";
import { cn } from "@/lib";
import { Search } from "lucide-react";
import React from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    time?: number;
}

export default function SearchBox({
    onChange,
    placeholder = "Search",
    className = "",
    time = 1000,
}: SearchBoxProps) {
    const [value, setValue] = React.useState<string>("");
    const [debouncedValue] = useDebounce(value, time);

    React.useEffect(() => {
        if (debouncedValue === "") {
            onChange("");
        } else {
            onChange(debouncedValue);
        }
    }, [debouncedValue, onChange]);

    return (
        <div
            className={cn(`relative border rounded-full `, className)}
        >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-shadow-secondery-figma" />
            <Input
                type="text"
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-4 py-2 rounded-full border-none w-full placeholder:text-grays"
            />
        </div>
    );
}
