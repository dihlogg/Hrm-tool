import { Layout } from "antd";

const HeaderComponent = () => (
  <Layout.Header
    style={{ backgroundColor: "#FB860D", color: "white", height: "64px" }}
    className="px-4 flex justify-between items-center shadow-md"
  >
    <div className="text-xl font-semibold flex items-center">
      Hrm Tools
    </div>
    <div className="rounded-full w-8 h-8 bg-white text-black flex items-center justify-center font-bold">
      L
    </div>
  </Layout.Header>
);

export default HeaderComponent;