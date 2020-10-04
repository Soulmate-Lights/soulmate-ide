import React from "react";
import { AiFillApple, AiFillWindows } from "react-icons/ai";

import examples from "~/welcome/examples";

import Example from "./example";
import hand from "./hand.jpg";
import logo from "./logo.png";
import theboyz from "./theboyz.jpg";

function isMacintosh() {
  return navigator.platform.indexOf("Mac") > -1;
}

function isWindows() {
  return navigator.platform.indexOf("Win") > -1;
}

export default function MarketingPage() {
  const [index, setIndex] = useState(0);
  return (
    <div className="full-width">
      <div className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-screen-xl">
          <div className="relative z-10 bg-white pb- sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-48">
            <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
              <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <a aria-label="Home" href="#">
                      <img
                        alt="Logo"
                        className="w-auto h-8 sm:h-10"
                        src={logo}
                      />
                    </a>
                    <div className="flex items-center -mr-2 md:hidden">
                      <button
                        aria-haspopup="true"
                        aria-label="Main menu"
                        className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                        id="main-menu"
                        type="button"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M4 6h16M4 12h16M4 18h16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="hidden md:block md:ml-10 md:pr-4">
                  <a
                    className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="#"
                  >
                    Product
                  </a>
                  <a
                    className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="#"
                  >
                    Features
                  </a>
                  <a
                    className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="#"
                  >
                    Marketplace
                  </a>
                  <a
                    className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                    href="#"
                  >
                    Company
                  </a>
                  <a
                    className="ml-8 font-medium text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                    href="#"
                  >
                    Log in
                  </a>
                </div> */}
              </nav>
            </div>
            {/*
  Mobile menu, show/hide based on menu open state.

  Entering: "duration-150 ease-out"
    From: "opacity-0 scale-95"
    To: "opacity-100 scale-100"
  Leaving: "duration-100 ease-in"
    From: "opacity-100 scale-100"
    To: "opacity-0 scale-95"
*/}
            <div className="absolute inset-x-0 top-0 p-2 transition transform origin-top-right md:hidden">
              <div className="rounded-lg shadow-md">
                <div
                  aria-labelledby="main-menu"
                  aria-orientation="vertical"
                  className="overflow-hidden bg-white rounded-lg shadow-xs"
                  role="menu"
                >
                  <div className="flex items-center justify-between px-5 pt-4">
                    <div>
                      <img alt className="w-auto h-8" src={logo} />
                    </div>
                    <div className="-mr-2">
                      <button
                        aria-label="Close menu"
                        className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                        type="button"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="px-2 pt-2 pb-3">
                    <a
                      className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                      href="#"
                      role="menuitem"
                    >
                      Product
                    </a>
                    <a
                      className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                      href="#"
                      role="menuitem"
                    >
                      Features
                    </a>
                    <a
                      className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                      href="#"
                      role="menuitem"
                    >
                      Marketplace
                    </a>
                    <a
                      className="block px-3 py-2 mt-1 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                      href="#"
                      role="menuitem"
                    >
                      Company
                    </a>
                  </div>
                  <div>
                    <a
                      className="block w-full px-5 py-3 font-medium text-center text-indigo-600 bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out"
                      href="#"
                      role="menuitem"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <main className="px-4 mx-auto mt-10 max-w-screen-xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-10 sm:text-5xl sm:leading-none md:text-6xl">
                  Soulmate
                  <br />
                  <span className="text-4xl text-indigo-600">
                    A FastLED ESP32 ecosystem
                  </span>
                </h2>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Soulmate is the easiest way to work with LEDs. Whether you’re
                  building an LED panel, lighting your room with an LED strip,
                  or just writing C++, try Soulmate free today.
                </p>

                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Made by a bunch of dudes in California.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            alt
            className="object-cover w-full h-56 sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={theboyz}
          />
        </div>
      </div>

      <div className="overflow-hidden bg-white">
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="absolute top-0 bottom-0 hidden w-screen lg:block bg-gray-50 right-3/4" />

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="relative mb-8 lg:mb-0 lg:row-start-1 lg:col-start-1">
              <div className="relative mx-auto text-base max-w-prose lg:max-w-none">
                <figure>
                  <div className="relative pb-7/12 lg:pb-0">
                    {/* <img
                      alt
                      className="absolute inset-0 object-cover object-center w-full h-full rounded-lg shadow-lg lg:static lg:h-auto"

                      src="https://images.unsplash.com/photo-1546913199-55e06682967e?ixlib=rb-1.2.1&auto=format&fit=crop&crop=focalpoint&fp-x=.735&fp-y=.55&w=1184&h=1376&q=80"
                    /> */}
                    <img
                      alt
                      className="absolute inset-0 object-cover object-center w-full h-full rounded-lg shadow-lg lg:static lg:h-auto"
                      height={1376}
                      src={hand}
                      // width={1184}
                    />
                  </div>
                </figure>
              </div>
            </div>
            <div>
              <div className="mx-auto mb-4 text-base max-w-prose lg:max-w-none">
                <p className="text-base font-semibold tracking-wide text-indigo-600 uppercase leading-6">
                  How it works
                </p>
                <h1 className="mt-2 mb-4 text-3xl font-extrabold tracking-tight text-gray-900 leading-8 sm:text-4xl sm:leading-10">
                  Soulmate. LEDS reimagined.
                </h1>
              </div>
              <div className="mx-auto text-base max-w-prose lg:max-w-none">
                <p className="mb-5 text-lg text-gray-500 leading-7">
                  Soulmate is a new system for building LED projects. Just fire
                  up the Soulmate IDE, connect your ESP32, and get started.
                </p>
              </div>
              <div className="mx-auto text-gray-500 prose lg:max-w-none lg:row-start-1 lg:col-start-2">
                <p>
                  Flashing with the Soulmate firmware makes everything easy, so
                  you can just write cool patterns.
                </p>
                <ul>
                  <li className="text-left">
                    Bluetooth LE connection - no pairing!
                  </li>
                  <li className="text-left">
                    WiFi connection - over-the-air updates
                  </li>
                  <li className="text-left">
                    Compiles in the cloud - fast, secure, and super-easy
                  </li>
                </ul>
                <p>
                  Building your LEDs with Soulmate means you can use the
                  Soulmate mobile app to control your art.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-200">
        <div className="w-10/12 px-4 py-16 pb-6 mx-auto max-w-screen-xl sm:py-24 sm:px-6 lg:px-8">
          <div className="relative z-10 flex flex-row mb-8 md:mb-2 md:px-6">
            <div>
              <div className="text-base max-w-prose lg:max-w-none">
                <p className="font-semibold tracking-wide text-indigo-600 uppercase leading-6">
                  Demo time
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 leading-8 sm:text-4xl sm:leading-10">
                  The Soulmate IDE
                </h1>
              </div>

              <div className="mx-auto mt-3 text-gray-500 prose lg:max-w-none lg:row-start-1 lg:col-start-2">
                <p>
                  Try writing your own FastLED pattern here. Press CMD-S to
                  save.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center ml-auto">
              <nav className="relative z-0 inline-flex shadow-sm">
                <a
                  aria-label="Previous"
                  className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-pointer select-none rounded-l-md leading-5 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                  onClick={() => index > 0 && setIndex(index - 1)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      fillRule="evenodd"
                    />
                  </svg>
                  Previous
                </a>
                <a
                  aria-label="Next"
                  className="inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-pointer select-none rounded-r-md leading-5 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                  onClick={() =>
                    setIndex(index + 1 >= examples.length ? 0 : index + 1)
                  }
                >
                  Next
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
          <Example className="my-8" code={examples[index]} key={index} />
        </div>
      </div>

      {/*
  Tailwind UI components require Tailwind CSS v1.8 and the @tailwindcss/ui plugin.
  Read the documentation to get started: https://tailwindui.com/documentation
*/}
      <div className="bg-gray-50">
        <div className="px-4 py-12 mx-auto max-w-screen-xl sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-9 sm:text-4xl sm:leading-10">
            Ready to dive in?
            <br />
            <span className="text-indigo-600">
              Open the Soulmate IDE to get started.
            </span>
          </h2>
          <div className="flex mt-8 lg:flex-shrink-0 lg:mt-0 space-x-4">
            <div className="inline-flex shadow rounded-md">
              <a
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent leading-6 rounded-md hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                href="https://editor.soulmatelights.com"
              >
                Open the web editor
              </a>
            </div>
            <div className="shadow rounded-md">
              <a
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-indigo-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                href={
                  isMacintosh()
                    ? "https://editor.soulmatelights.com/download/mac"
                    : "https://editor.soulmatelights.com/download/windows"
                }
              >
                {isMacintosh() ? (
                  <AiFillApple className="mr-2" />
                ) : (
                  <AiFillWindows className="mr-2" />
                )}
                Download the desktop app
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-10/12 px-4 py-8 mx-auto max-w-screen-xl sm:py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 leading-9">
          Frequently asked questions
        </h2>
        <div className="px-12 mt-12">
          <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-2 col-gap-8 sm:row-gap-12 lg:grid-cols-3">
            <div className="px-4 mb-6 space-y-2">
              <dt className="text-lg font-medium text-gray-900 leading-6">
                What do I need to get started?
              </dt>
              <dd className="text-base text-gray-500 leading-6">
                To write LED patterns, all you need is the{" "}
                <a href="https://editor.soulmatelights.com/">Soulmate IDE.</a>{" "}
                Once you’ve got some patterns, just hook up your ESP32. We like
                the{" "}
                <a href="https://m5stack.com/products/atom-lite-esp32-development-kit">
                  M5 Atom Lite
                </a>{" "}
                - but any ESP32 will work.
              </dd>
            </div>
            <div className="px-4 mb-6 space-y-2">
              <dt className="text-lg font-medium text-gray-900 leading-6">
                What language does Soulmate use?
              </dt>
              <dd className="text-base text-gray-500 leading-6">
                Soulmate patterns are made in C++, using the amazing{" "}
                <a href="http://github.com/fastled/fastled">FastLED library</a>.
                But don’t worry - we’ve made a{" "}
                <a href="https://editor.soulmatelights.com/tutorial">
                  tutorial
                </a>{" "}
                to help you get started.
              </dd>
            </div>
            <div className="px-4 mb-6 space-y-2">
              <dt className="text-lg font-medium text-gray-900 leading-6">
                How many LEDs can I control?
              </dt>
              <dd className="text-base text-gray-500 leading-6">
                Good question! We’ve tested up to 1200 LEDs from a single ESP32.
              </dd>
            </div>
            <div className="px-4 mb-6 space-y-2">
              <dt className="text-lg font-medium text-gray-900 leading-6">
                What does it cost?
              </dt>
              <dd className="text-base text-gray-500 leading-6">
                Soulmate firmware is free and open-source, and we plan to keep
                it that way.
              </dd>
            </div>
            <div className="px-4 mb-6 space-y-2">
              <dt className="text-lg font-medium text-gray-900 leading-6">
                Where can I buy a Soulmate?
              </dt>
              <dd className="text-base text-gray-500 leading-6">
                Thanks for asking! You can buy a Soulmate from{" "}
                <a href="https://shop.soulmatelights.com/">
                  the Soulmate Store
                </a>{" "}
                - buying a Soulmate helps keep the compiler servers running.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="bg-white">
        <div className="px-4 py-12 mx-auto max-w-screen-xl sm:px-6 lg:py-16 lg:px-8">
          <div className="pt-8 mt-12 border-t border-gray-200">
            <p className="text-base text-gray-400 leading-6 xl:text-center">
              © 2020 Soulmate Lights, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
