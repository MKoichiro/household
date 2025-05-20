import { RouterProvider } from 'react-router-dom'
import './configs/chartConfig'
import router from './router/routes'

const App = () => <RouterProvider router={router} />

export default App
