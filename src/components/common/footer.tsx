"use client";
import { Layout } from "antd";

const FooterComponent = () => (
  <Layout.Footer className="text-center text-gray-500 bg-gray-50" style={{ height: "60px" }}>
    <div className="flex items-center justify-between h-full">
      <div>
        <span className="font-semibold text-orange-500">v1.0.0</span> © 2025 NextJS Tailwind
      </div>
      <div className="flex space-x-4">
        <a href="#" className="text-gray-500 hover:text-orange-500">Issues</a>
        <a href="#" className="text-gray-500 hover:text-orange-500">Sponsor</a>
        <a href="#" className="text-gray-500 hover:text-orange-500">Starred</a>
      </div>
    </div>
  </Layout.Footer>
);

export default FooterComponent;