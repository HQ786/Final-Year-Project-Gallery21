"use client";
import { Menu, Person, Search, ShoppingCart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import "@styles/Navbar.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const mockUser = {
    profileImagePath: "/assets/nft5.png",
    cart: [],
    _id: "64ddae3cfb3126fcd3a3b5e9",
  };

  const searchWork = async () => {
    if (query) {
      router.push(`/${query}`);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton disabled={query === ""}>
          <Search sx={{ color: "red" }} onClick={searchWork} />
        </IconButton>
      </div>
      <div className="navbar_right">
        <button
          className="navbar_right_account"
          onClick={() => setDropDownMenu(!dropDownMenu)}
        >
          <Menu sx={{ color: "grey" }} />
          <img
            src={mockUser.profileImagePath}
            alt="profile"
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        </button>
        {dropDownMenu && (
          <div className="navbar_right_accountmenu">
            <a onClick={() => router.push("/stripe-marketplace")}>Home</a>
            <Link href="/cart">Cart</Link>
            <Link href="/create-work">Create Your Work</Link>
            <a onClick={() => router.push("/dashboard")}>Go to Dashboard</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
