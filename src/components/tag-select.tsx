"use client"

import { ChevronsUpDown, Trash, X } from "lucide-react"
import * as React from "react"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog"
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
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "@/components/ui/context-menu"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

interface Tag {
	id: number,
	name: string
}

interface Props {
	value: Tag[],
	text: string,
	onChange: (tags: Tag[]) => void
	getTags: () => Promise<{ error: string | null, data: Tag[] | null }>
	createTag: (tag: string) => Promise<{ error: string | null, data: Tag | null }>
	deleteTag: (id: number) => Promise<{ error: string | null, data: null } | undefined>
}

export function TagsCombobox({ value = [], onChange, getTags, createTag, deleteTag, text }: Props) {
	const [open, setOpen] = React.useState(false)
	const [tagOptions, setTagOptions] = React.useState<Tag[]>([])
	const [queryValue, setQueryValue] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)

	React.useEffect(() => {
		async function loadTags() {
			setIsLoading(true)
			const { error, data } = await getTags()
			if (error) {
				console.error(error)
			} else if (data) {
				setTagOptions(data)
			}
			setIsLoading(false)
		}
		loadTags()
	}, [getTags])

	const handleCreateTag = async (tag: string) => {
		const { error, data } = await createTag(tag)
		if (error) {
			console.error(error)
		} else if (data) {
			setTagOptions([...tagOptions, data])
			onChange([...value, data])
		}
	}

	const handleDeleteTag = async (removingTag: Tag) => {
		await deleteTag(removingTag.id)
		setTagOptions(tagOptions.filter((t) => t.id !== removingTag.id))
		onChange(value.filter((tag) => tag !== removingTag))
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={isLoading}
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between h-fit"
				>
					{value.length > 0 ?
						<ul className="flex flex-wrap gap-2">
							{value.map((tag) => {
								return (<div key={tag.id} className="bg-gray-600 pl-2 rounded-md flex items-center gap-2">
									{tag.name}
									<div onClick={(e) => {
										e.stopPropagation()
										onChange(value.filter((t) => t !== tag))
									}} className="size-6 flex justify-center items-center hover:bg-red-600 rounded-md">
										<X />
									</div>
								</div>)
							})}
						</ul> : (isLoading ? "Loading..." : `select ${text} tags...`)}

					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput disabled={isLoading} value={queryValue} onValueChange={setQueryValue} onKeyDown={(e) => {
						if (e.key === 'Enter' && !tagOptions.some(tag =>
							tag.name.toLowerCase().includes(e.currentTarget.value.toLowerCase())
						)) {
							handleCreateTag(queryValue.trim())
						}
					}} placeholder="Search tags" />
					<CommandList>
						<CommandEmpty className="relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">Press enter to create {queryValue} tag</CommandEmpty>
						<CommandGroup>
							{tagOptions.map((tag) => (
								<TagContextMenu key={tag.id} tag={tag} onDelete={() => handleDeleteTag(tag)}>
									<CommandItem
										value={tag.name}
										disabled={value.some((t) => t.id === tag.id)}
										onSelect={() => {
											onChange([...value, tag])
										}}
										className="flex justify-between"
									>
										{tag.name}
									</CommandItem>
								</TagContextMenu>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}


function TagContextMenu({ children, tag, onDelete }: { children: React.ReactNode, tag: Tag, onDelete: () => void }) {
	const [open, setOpen] = React.useState(false)

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger>{children}</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setOpen(true)} className="flex items-center gap-2"><Trash className="size-4" />Delete</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the {tag.name} tag and remove it from all posts.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => {
							onDelete()
							setOpen(false)
						}}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>


		</>
	)
}




