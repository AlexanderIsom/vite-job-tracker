import { fetchAllJobs } from '@/lib/actions/jobActions';
import { createFileRoute } from '@tanstack/react-router';
import { columns } from './-components/columns';
import { DataTable } from './-components/data-table';

export const Route = createFileRoute('/')({
  loader: () => fetchAllJobs(),
  component: HomeComponent,
})

function HomeComponent() {
  const data = Route.useLoaderData()

  if (!data) {
    return <div>No jobs found</div>
  }

  return <DataTable columns={columns} data={data} />
}
