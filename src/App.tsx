import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import { UserBlogs } from './pages/UserBlogs'
import { EditBlog } from './pages/EditBlog'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/publish" element={<Publish />} />
          <Route path="/blogs/user/:userId" element={<UserBlogs />} />
          <Route path="/blogs/edit/:id" element={<EditBlog />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App