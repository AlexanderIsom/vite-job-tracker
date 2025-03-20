'use client';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { JobSchemaWithTags } from "../../shared/db/jobSchema";
import { TagsCombobox } from "./tag-select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { createStackTag, deleteStackTag, fetchStackTags } from "@/lib/actions/stackActions";
import { createIndustryTag, deleteIndustryTag, fetchIndustryTags } from "@/lib/actions/industryActions";

interface JobFormProps {
	initialData?: z.infer<typeof JobSchemaWithTags>;
	onSubmit: (data: z.infer<typeof JobSchemaWithTags>) => Promise<void>;
	onDelete?: () => Promise<void>;
	isSubmitting: boolean;
	isDeleting?: boolean;
	isEditing?: boolean;
}

export default function JobForm({ initialData, onSubmit, onDelete, isSubmitting, isDeleting = false, isEditing = false }: JobFormProps) {
	const form = useForm<z.infer<typeof JobSchemaWithTags>>({
		resolver: zodResolver(JobSchemaWithTags),
		defaultValues: initialData || {
			id: 0,
			company_name: "",
			role_title: "",
			salary_range: "",
			remote: "unknown",
			industryTags: [],
			stackTags: [],
			notes: "",
			status: "applied",
		},
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-2">
				<FormField
					control={form.control}
					name="company_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role_title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col md:flex-row gap-2 w-full">
					<FormField
						control={form.control}
						name="salary_range"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Salary Range</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isEditing && <FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger className="w-full md:w-[180px]">
											<SelectValue placeholder="Select a status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Status</SelectLabel>
												<SelectItem value="applied">Applied</SelectItem>
												<SelectItem value="interviewing">Interviewing</SelectItem>
												<SelectItem value="offer">Offer</SelectItem>
												<SelectItem value="rejected">Rejected</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>}
					<FormField
						control={form.control}
						name="remote"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Remote</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger className="w-full md:w-[180px]">
											<SelectValue placeholder="unknown" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="unknown">Unknown</SelectItem>
											<SelectItem value="remote">Remote</SelectItem>
											<SelectItem value="hybrid">Hybrid</SelectItem>
											<SelectItem value="in-person">In-Person</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="industryTags"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Industry</FormLabel>
							<FormControl>
								<TagsCombobox text='industry' value={field.value} onChange={field.onChange} getTags={fetchIndustryTags} createTag={createIndustryTag} deleteTag={deleteIndustryTag} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="stackTags"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Stack</FormLabel>
							<FormControl>
								<TagsCombobox text='stack' value={field.value} onChange={field.onChange} getTags={fetchStackTags} createTag={createStackTag} deleteTag={deleteStackTag} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-2">
					<Button type="submit" disabled={isSubmitting || isDeleting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							{isEditing && <Button disabled={isSubmitting || isDeleting} variant="destructive">{isDeleting ? 'Deleting...' : 'Delete'}</Button>}
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete this
									job and remove the data.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={onDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</form>
		</Form>


	)
}