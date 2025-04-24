

import { Route,Routes } from "react-router-dom"
import SigninForm from "./_auth/forms/SigninForm"
import { Home } from "./_root/pages"
import SignupForm from "./_auth/forms/Signupform"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/sonner"
function App() {
  

  return (
<main className="flex h-screen">
<Routes>
  {/* public Routes */}
  <Route element={<AuthLayout/>}>
  <Route path="/sign-in" element={<SigninForm/>}/>
  <Route path="/sign-up" element={<SignupForm/>}/>
  </Route>






   {/* private routes */}
   <Route element={<RootLayout/>}>
<Route index element={<Home/>}/>
</Route>  
{/* index because it will be root */}




</Routes>
  








 
<Toaster />
</main>
  )
}

export default App
      