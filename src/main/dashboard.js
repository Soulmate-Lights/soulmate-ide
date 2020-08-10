import { Link } from "react-router-dom";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";

const Dashboard = () => {
  const { userDetails } = UserContainer.useContainer();

  return (
    <div className="flex-grow flex flex-col w-full">
      <div className="relative bg-purple-0 overflow-hidden flex-grow p-6 items-center flex flex-col justify-center">
        <nav className="absolute top-0 pt-5 px-5 flex items-center justify-between justify-center flex-row w-full p-2">
          <Logo className="h-8 w-auto sm:h-10" />

          {!userDetails && (
            <span className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-purple-600 bg-white hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
              >
                Log in
              </a>
            </span>
          )}
        </nav>
        <main className="mx-auto max-w-screen-xl px-4">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-purple-900 sm:text-5xl sm:leading-none md:text-6xl">
              Soulmate
              <br className="xl:hidden" />
              <span className="text-purple-600">LED firmware</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-purple-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Making LED art easy and fun. Let's get started.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/tutorial"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Tutorial
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/gallery"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-purple-600 bg-white hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Gallery
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
