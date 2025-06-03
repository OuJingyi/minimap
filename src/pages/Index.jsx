import { useState } from "react";

const Index = () => {
  const [isFloatingWindowVisible] = useState(true);

  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">欢迎页</h1>
        <p className="text-xl text-gray-600 text-center mb-8">开始构建你的神奇应用!</p>
      </div>

      {/* 右下角浮窗 */}
      {isFloatingWindowVisible && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 w-[180px] h-[180px]">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">浮窗标题</h4>
          </div>
          <p className="text-sm text-gray-600">
            这是一个固定的浮窗容器，位于右下角。
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
