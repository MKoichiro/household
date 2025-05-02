import { RouterProvider } from 'react-router-dom'
import './configs/chartConfig'
import router from './router/routes'

const App = () => {
  // const element = useRoutes(routes)
  // return element
  return <RouterProvider router={router} />
}

export default App
