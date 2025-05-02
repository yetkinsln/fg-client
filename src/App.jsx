import MainScreen from "./components/main/mainScreen";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AddPlayer from "./components/player/addPlayer";
import MyPlayers from "./components/player/myPlayers";
import Login from "./pages/login";
import Register from "./pages/register";
import AdminDashboard from "./pages/Administrator/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuctionPage from "./components/Auction/AuctionPage";
import DiscoverPage from "./components/Discover/discoverPage";
import Forum from "./components/Forum/Forum";
import TopicDetail from "./components/Forum/TopicDetail";
import AdminLogin from "./pages/Administrator/AdminLogin";
import AdminRoute from "./pages/Administrator/AdminRoute";
import UsersPanel from "./pages/Administrator/AdminPanel";
import TopicsPanel from "./pages/Administrator/TopicsPanel";
import PostsPanel from "./pages/Administrator/PostsPanel";
import LogPanel from "./pages/Administrator/LogPanel";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute component={MainScreen} />} />
        <Route
          path="/add-player"
          element={<PrivateRoute component={AddPlayer} />}
        />
        <Route
          path="/my-players"
          element={<PrivateRoute component={MyPlayers} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Korumalı rota */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/users" element={<AdminRoute><UsersPanel /></AdminRoute>} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
         <Route
          path="/admin/topics"
          element={
            <AdminRoute>
              <TopicsPanel />
            </AdminRoute>
          }
        />
         <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <PostsPanel/>
            </AdminRoute>
          }
        />
           <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <LogPanel/>
            </AdminRoute>
          }
        />
        <Route
          path="/auction"
          element={<PrivateRoute component={AuctionPage} />}
        />
        <Route
          path="/discover"
          element={<PrivateRoute component={DiscoverPage} />}
        />
        <Route
          path="/auction/:id"
          element={<PrivateRoute component={AuctionPage} />}
        />
        <Route path="/topics" element={<PrivateRoute component={Forum} />} />
        <Route
          path="/topics/:topicId"
          element={<PrivateRoute component={TopicDetail} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
