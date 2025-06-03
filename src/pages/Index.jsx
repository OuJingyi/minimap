import { useState } from "react";

const Index = () => {
  const [isFloatingWindowVisible, setIsFloatingWindowVisible] = useState(true);

  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">欢迎页</h1>
        <p className="text-xl text-gray-600 text-center mb-8">开始构建你的神奇应用!</p>
      </div>

      {/* 底部容器 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              <h3 className="font-semibold text-lg">底部信息</h3>
              <p className="text-sm">这是一个固定在底部的容器</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              联系我们
            </button>
          </div>
        </div>
      </div>

      {/* 右下角浮窗 */}
      {isFloatingWindowVisible && (
        <div className="fixed bottom-24 right-4 bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">浮窗标题</h4>
            <button
              onClick={() => setIsFloatingWindowVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600">
            这是一个可关闭的浮窗容器，位于右下角。
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
