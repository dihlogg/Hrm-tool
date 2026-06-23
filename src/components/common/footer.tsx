"use client";
import { Layout } from "antd";

const FooterComponent = () => (
  <Layout.Footer className="p-4 text-center text-gray-500 bg-gray-50 md:p-4">
    <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:px-4">
      <div className="text-sm">
        <span className="font-semibold text-orange-500">v1.0.0</span> © 2025 NextJS Tailwind
      </div>
      <div className="flex space-x-4 text-sm">
        <a href="#" className="text-gray-500 hover:text-orange-500">Issues</a>
        <a href="#" className="text-gray-500 hover:text-orange-500">Sponsor</a>
        <a href="#" className="text-gray-500 hover:text-orange-500">Starred</a>
      </div>
    </div>
  </Layout.Footer>
);

export default FooterComponent;