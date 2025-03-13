"use client"

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AddJobDialog from "@/components/add-job-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	loading?: boolean
}

export function DataTable<TData, TValue>({
	columns,
	data,
	loading = false,
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			columnFilters,
			columnVisibility: {
				...columnVisibility,
				Stale: false,
			}
		}
	})

	const handleMultiDrop = (value: string, isChecked: boolean) => {
		let filterValue: string[] = (table.getColumn('Status')?.getFilterValue()) as string[] ?? [];

		if (isChecked) {
			filterValue = [...filterValue, value]
		} else {
			filterValue = filterValue.filter((v) => v !== value)
		}

		table.getColumn('Status')?.setFilterValue(filterValue)
	}

	const handleStale = (value: string, isChecked: boolean) => {
		let filterValue: string[] = (table.getColumn('Stale')?.getFilterValue()) as string[] ?? [];

		if (isChecked) {
			filterValue = [...filterValue, value]
		} else {
			filterValue = filterValue.filter((v) => v !== value)
		}

		table.getColumn('Stale')?.setFilterValue(filterValue)
	}


	return (
		<div>
			<div className="flex flex-col md:flex-row items-center py-4 gap-2">
				<Input
					placeholder="Filter company name..."
					value={(table.getColumn("Company")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("Company")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
					disabled={loading}
				/>
				<div className="flex flex-row gap-2 w-full">
					<AddJobDialog loading={loading} />
					<div className="ml-auto flex flex-row gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" disabled={loading}>Status</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel>Status</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem
									checked={(table.getColumn('Status')?.getFilterValue() as string[] ?? []).includes('applied')}
									onCheckedChange={(checked) => {
										handleMultiDrop('applied', checked)
									}}
								>
									Applied
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={(table.getColumn('Status')?.getFilterValue() as string[] ?? []).includes('interviewing')}
									onCheckedChange={(checked) => {
										handleMultiDrop('interviewing', checked)
									}}
								>
									Interviewing
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={(table.getColumn('Status')?.getFilterValue() as string[] ?? []).includes('offer')}
									onCheckedChange={(checked) => {
										handleMultiDrop('offer', checked)
									}}
								>
									Offer
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={(table.getColumn('Status')?.getFilterValue() as string[] ?? []).includes('rejected')}
									onCheckedChange={(checked) => {
										handleMultiDrop('rejected', checked)
									}}
								>
									Rejected
								</DropdownMenuCheckboxItem>

								<Separator className="my-1" />

								<DropdownMenuCheckboxItem
									checked={(table.getColumn('Stale')?.getFilterValue() as string[] ?? []).includes('stale')}
									onCheckedChange={(checked) => {
										handleStale('stale', checked)
									}}
								>
									Stale
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={(table.getColumn('Stale')?.getFilterValue() as string[] ?? []).includes('fresh')}
									onCheckedChange={(checked) => {
										handleStale('fresh', checked)
									}}
								>
									Fresh
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" disabled={loading}>
									Columns
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter(
										(column) => column.getCanHide()
									)
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										)
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{loading ? <TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							Loading...
						</TableCell>
					</TableRow> :
						table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
				</TableBody>
			</Table>
		</div>
	)
}