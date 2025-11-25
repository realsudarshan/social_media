

import { Route, Routes } from "react-router-dom"
import SigninForm from "./_auth/forms/SigninForm"
import { Home } from "./_root/pages"
import SignupForm from "./_auth/forms/Signupform"
import VerifyEmail from "./_auth/forms/VerifyEmail"
import ForgotPassword from "./_auth/forms/ForgotPassword"
import ResetPassword from "./_auth/forms/ResetPassword"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/sonner"
import Explore from "./_root/pages/Explore"
import Saved from "./_root/pages/Saved"
import AllUsers from "./_root/pages/AllUsers"
import CreatePost from "./_root/pages/CreatePost"
import EditPost from "./_root/pages/EditPost"
import PostDetails from "./_root/pages/PostDetails"
import Profile from "./_root/pages/Profile"
import UpdateProfile from "./_root/pages/UpdateProfile"
function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Verification route - accessible to both authenticated and unauthenticated users */}
        <Route path="/verify" element={<VerifyEmail />} />






        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:id' element={<EditPost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/profile/:id/*' element={<Profile />} />
          <Route path='/update-profile/:id' element={<UpdateProfile />} />

        </Route>
        {/* index because it will be root */}




      </Routes>










      <Toaster />
    </main>
  )
}

export default App
