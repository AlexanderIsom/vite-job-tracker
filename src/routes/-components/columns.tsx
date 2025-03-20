"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { JobSchemaWithStaleStatus, JobSchemaWithTags } from "shared/db/jobSchema"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Link } from "@tanstack/react-router"

export type JobColumnWithTags = z.infer<typeof JobSchemaWithTags>;
export type JobColumn = z.infer<typeof JobSchemaWithStaleStatus>;

export const columns: ColumnDef<JobColumn>[] = [
	{
		accessorKey: "company_name",
		id: "Company",
		header: "Company",
		enableHiding: false,
	},
	{
		accessorKey: "role_title",
		id: "Role",
		header: "Role",
		enableHiding: false,
	},
	{
		accessorKey: "salary_range",
		id: "Salary",
		header: "Salary",
	},
	{
		accessorKey: "status",
		id: "Status",
		header: "Status",
		filterFn: "arrIncludesSome",
		cell: ({ row }) => {
			const job = row.original
			const statusFrag = job.status === 'applied' ? null : <Badge>{job.status}</Badge>
			const staleFrag = job.stale === 'stale' ? <Badge variant='destructive'>Stale</Badge> : null
			return <div className="flex gap-2">{statusFrag} {staleFrag} </div>
		},
	},
	{
		accessorKey: "stale",
		id: "Stale",
		filterFn: "arrIncludesSome",
		enableHiding: false,
	},
	{
		accessorKey: "date_applied",
		id: "Last updated",
		header: "Last updated",
		cell: ({ row }) => {
			const job = row.original
			return <span>{new Date(job.date_applied).toLocaleDateString()}</span>
		}
	},
	{
		accessorKey: "View",
		id: "actions",
		cell: ({ row }) => {
			const job = row.original
			return <Link to="/edit/$jobId" params={{ jobId: job.id.toString() }}><Button className="hover:bg-primary hover:text-white" variant="ghost">View</Button></Link>
		},
		enableHiding: false,
	}
]
