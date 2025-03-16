import EditJob from '@/components/edit-job'
import { fetchJobById } from '@/lib/actions/jobActions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/$jobId')({
  component: RouteComponent,
  loader: async ({ params }) => fetchJobById(params.jobId)
})

function RouteComponent() {
  const job = Route.useLoaderData()

  if (!job) {
    return <div>No job found</div>
  }

  return <div className="p-8 flex flex-col gap-4 justify-center">
    <div className="font-black text-2xl w-full text-center">EDIT JOB</div>
    <EditJob job={job} />
  </div>
}
