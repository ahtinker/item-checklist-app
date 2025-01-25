'use client';
import styles from "./page.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavBar = () => {
    const pathname = usePathname(); // Get the current URL path

    const hiddenRoutes = ["/", "/items", "/places"]; 
  
    const existsNavbar = hiddenRoutes.includes(pathname);
  
    if (!existsNavbar) {
      return null; // Do not render the navbar
    }
    return (
    
    <div className="is-clipped">
        <nav className="sn navbar is-fixed-bottom px-3 pb-6 is-transparent tabs is-toggle is-toggle-rounded is-fullwidth" role="navigation" aria-label="main navigation" style={{background: "transparent"}}>
            <div className="container">
                <ul>
                    <li className={pathname == "/" ? "is-active" : ""}>
                        <Link className={`pt-6 px-5 ${pathname == "/" ? "" : "blur"}`} href="/">
                            <span className="icon mb-6 pb-3" style={{position: "absolute"}}>
                                <i className="fas fa-list is-size-4"></i>
                            </span>
                            Listat
                        </Link>

                    </li>
                    <li className={pathname == "/items" ? "is-active" : ""}>
                        <Link className={`pt-6 ${pathname == "/items" ? "" : "blur"}`} href="/items">
                            <span className="icon mb-6 pb-3" style={{position: "absolute"}}>
                                <i className="far fa-folder is-size-4"></i>
                            </span>
                            Tavarat
                        </Link>
                    </li>
                    <li className={pathname == "/places" ? "is-active" : ""}>
                        <Link className={`pt-6 ${pathname == "/places" ? "" : "blur"}`} href="/places">
                            <span className="icon mb-6 pb-3" style={{position: "absolute"}}>
                                <i className="fas fa-location-dot is-size-4"></i>
                            </span>
                            Paikat
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    )
}
export default NavBar