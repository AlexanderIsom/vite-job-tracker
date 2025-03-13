'use client'

import { JobColumnWithTags } from "@/routes/-components/columns";
import { deleteJob, updateJob } from "@/lib/actions/jobActions";
import { JobSchemaWithId } from "@/lib/db/schemas/jobSchema";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import JobForm from "./job-form";

export default function EditJob({ job }: { job: JobColumnWithTags }) {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	const onSubmit = async (data: z.infer<typeof JobSchemaWithId>) => {
		setIsSubmitting(true);

		const { error } = await updateJob(data);
		if (error) {
			toast.error(error)
		} else {
			toast.success("Job updated")
			setIsSubmitting(false);
		}
	}

	const onDelete = async () => {
		setIsDeleting(true);
		await deleteJob(job.id);
		setIsDeleting(false);
	}

	return <JobForm isEditing={true} initialData={job} onSubmit={onSubmit} isSubmitting={isSubmitting} isDeleting={isDeleting} onDelete={onDelete} />
}