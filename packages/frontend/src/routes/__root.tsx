import { ModeToggle } from '@/components/mode-toggle'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'


export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className='p-2 flex justify-between items-center'>
        <div className="flex gap-2 text-lg">
          Jobs
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
