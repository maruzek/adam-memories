import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import type { User } from "@/types/User"

type ComboboxProps = {
    data?: User[],
    value?: string,
    onChange?: (value: string) => void,
}


export function Combobox({ data, value, onChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value || "Vyber známého"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Hledat známého..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Známý nenalezen...</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                key=""
                                value=""
                                onSelect={() => {
                                    onChange?.("");
                                    setOpen(false);
                                }}
                            >
                                Všichni uživatelé
                                <Check className={cn("ml-auto", value === "" ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                            {data && data.map((user) => (
                                <CommandItem
                                    key={user._id.toString()}
                                    value={user.email || "Neznámý uživatel"}
                                    onSelect={() => {
                                        onChange?.(user.email || "Neznámý uživatel");
                                    }}
                                >
                                    {user.email || "Neznámý uživatel"}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === user.email ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
