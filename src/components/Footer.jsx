import React from "react";
import { Link } from "react-router-dom";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <div className=" w-full">
        <div className="border-t-2 border-black/13 mx-4"></div>
        <div className="flex flex-row items-center justify-evenly py-2 text-black/35 text-sm">
          <p>Copyright © 2025 JTrax</p>
          <div>
            <Link
              to={"https://github.com/Alex-de-code/job-app-tracker"}
              target="_blank"
              className=""
            >
              <BsGithub size={22} className=" hover:text-black/50" />
            </Link>
          </div>
          <div>
            <Link>
              <p className="hover:text-black/50">About</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
