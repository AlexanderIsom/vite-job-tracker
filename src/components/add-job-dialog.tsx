'use client'
import { useState } from "react";
import { z } from "zod";
import { addJob } from "@/lib/actions/jobActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import JobForm from "./job-form";
import { toast } from "sonner"
import { JobSchema } from "shared/db/jobSchema";


export default function AddJobDialog({ loading = false }: { loading?: boolean }) {
	const [open, setOpen] = useState(false);
	const [submissionPending, setSubmissionPending] = useState(false);

	async function onSubmit(data: z.infer<typeof JobSchema>) {
		setSubmissionPending(true);

		const { error } = await addJob(data)
		if (error) {
			toast.error(error)
		} else {
			toast.success("Job added")
			setOpen(false)
		}
		setSubmissionPending(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button disabled={loading}>Add job</Button>
			</DialogTrigger>
			<DialogContent onPointerDownOutside={(e) => { e.preventDefault() }}>
				<DialogHeader>
					<DialogTitle>Add applied job</DialogTitle>
				</DialogHeader>
				<JobForm onSubmit={onSubmit} isSubmitting={submissionPending} />
			</DialogContent>
		</Dialog>
	)

}