import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ background: "#222", padding: "10px" }}>
            <Link to="/hub" style={{ color: "white", marginRight: "15px" }}>
                Hub
            </Link>

            <Link to="/portal" style={{ color: "white" }}>
                Portale
            </Link>
        </nav>
    );
};

export default Navbar;
