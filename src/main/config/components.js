import React from "react";

export const Section = (props) => (
  <div className="md:grid md:grid-cols-3 md:gap-6">{props.children}</div>
);

export const Left = (props) => (
  <div className="md:col-span-1 dark-mode:text-white">
    <div className="px-4 sm:px-0">{props.children}</div>
  </div>
);

export const Right = (props) => (
  <div className="px-4 py-5 mt-5 text-gray-800 shadow md:mt-0 md:col-span-2 sm:rounded-md sm:overflow-hidden bg-gray-50 dark-mode:bg-gray-100 sm:p-6 col-span-6 sm:col-span-3 space-y-6">
    {props.children}
  </div>
);
