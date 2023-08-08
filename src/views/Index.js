import React from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import patternImage from "assets/img/pattern_react.png";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
          src={patternImage}
          alt=""
        />
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-4xl text-blueGray-600">
                Cabinet Medical d'Endocrinologie, Diabetologie et Nutrition
              </h2>
              <br/>
              <h3 className="font-semibold text-xl text-blueGray-600">
                Chez Dr Moulay Hassan El Alaoui
              </h3>
              <div className="mt-12">
                <Link
                  to="/auth/login"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Se connecter
                </Link> 
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
