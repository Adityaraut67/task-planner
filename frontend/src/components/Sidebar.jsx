import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Icon = ({ name, className = "" }) => (
  <span className={`ms-icon material-symbols-outlined ${className}`}>{name}</span>
);

export default function Sidebar({ NAV_ITEMS = [], avatarImage, user }) {
const navigate=useNavigate();
const {logout} =useAuth();

  const handleLogout=()=>{
    logout();
    navigate("/login");
    
  }
    return (
        <>
<aside className="pl-sidebar">
        <div className="pl-brand">
          <h1>TaskPilot AI</h1>
          <p>Premium Workspace</p>
        </div>

        <ul className="pl-nav">
          {NAV_ITEMS.map(({ icon, label, path, active }) => (
            <li key={label}>
              <Link to={path} className={`pl-nav-item ${active ? "active" : ""}`}>
                <Icon name={icon} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

       <div className="ad-sidebar-bottom">
          
          <div className="ad-user-profile">
            <div className="ad-avatar">
              {user.username[0].toUpperCase()}
            </div>
            <div className="ad-user-info">
              <p>{user.username}</p>
              <p>{user.role}</p>
            </div>
            <button className="ad-logout-btn" onClick={handleLogout} title="Log Out">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </aside>
      
      </>

    )
}