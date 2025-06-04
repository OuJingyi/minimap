import { useEffect, useRef, useState } from "react";
import MiniMap from "../components/MiniMap";

const Index = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const markersRef = useRef([]);
  const [points, setPoints] = useState([]);

  // 加载 GeoJSON 数据并添加标记
  const loadGeoJSONData = async () => {
    try {
      const response = await fetch('/geojson_converted.geojson');
      const data = await response.json();
      
      // 获取所有点
      const allPoints = data.features.filter(feature => feature.geometry.type === 'Point');
      
      // 随机选择 200 个点
      const selectedPoints = allPoints.sort(() => 0.5 - Math.random()).slice(0, 200);
      
      // 保存点位数据
      setPoints(selectedPoints);
      
      // 清除现有标记
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // 添加新标记
      selectedPoints.forEach(point => {
        const circle = new window.AMap.CircleMarker({
          center: point.geometry.coordinates,
          radius: 10,
          fillColor: '#1890ff',
          fillOpacity: 0.8,
          strokeColor: '#fff',
          strokeWeight: 2,
          strokeOpacity: 1,
          zIndex: 10,
          bubble: true,
          map: mapInstanceRef.current
        });
        markersRef.current.push(circle);
      });
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  };

  useEffect(() => {
    if (window.AMap && mapRef.current) {
      const map = new window.AMap.Map(mapRef.current, {
        zoom: 11,
        center: [116.397428, 39.90923],
        mapStyle: "amap://styles/whitesmoke",
      });

      map.on('complete', () => {
        mapInstanceRef.current = map;
        setMapReady(true);
        // 地图加载完成后加载 GeoJSON 数据
        loadGeoJSONData();
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }
      };
    }
  }, []);

  const handleReset = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoomAndCenter(11, [116.397428, 39.90923]);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const zoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(zoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const zoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(zoom - 1);
    }
  };

  return (
    <div className="w-screen h-screen relative bg-gray-100 overflow-hidden">
      {/* 地图全屏容器 */}
      <div
        ref={mapRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1 }}
      />
      {/* 自定义工具栏 */}
      <div className="fixed top-[20px] right-[20px] bg-white rounded-md shadow-md flex flex-col z-10">
        <button
          onClick={handleZoomIn}
          className="w-[32px] h-[32px] flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100"
        >
          <img src="/加号_新建_小 (1).svg" width="20" height="20" alt="放大" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-[32px] h-[32px] flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
        >
          <img src="/减号_减少_小 (2).svg" width="20" height="20" alt="缩小" />
        </button>
      </div>
      {/* 复位按钮 */}
      <button
        onClick={handleReset}
        className="fixed top-[100px] right-[20px] bg-white rounded-md shadow-md w-[32px] h-[32px] flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 z-10"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M5.5,36.5L5.5,11.5C5.5,9.84315,6.08579,8.42893,7.25736,7.25736C8.42893,6.08579,9.84315,5.5,11.5,5.5L36.5,5.5C38.1569,5.5,39.5711,6.08579,40.7426,7.25736C41.9142,8.42893,42.5,9.84315,42.5,11.5L42.5,36.5C42.5,38.1569,41.9142,39.5711,40.7426,40.7426C39.5711,41.9142,38.1569,42.5,36.5,42.5L11.5,42.5C9.84314,42.5,8.42893,41.9142,7.25736,40.7426C6.08579,39.5711,5.5,38.1569,5.5,36.5ZM8.5,36.5C8.5,37.3284,8.79289,38.0355,9.37868,38.6213C9.96447,39.2071,10.67157,39.5,11.5,39.5L36.5,39.5C37.3284,39.5,38.0355,39.2071,38.6213,38.6213C39.2071,38.0355,39.5,37.3284,39.5,36.5L39.5,11.5C39.5,10.67157,39.2071,9.96447,38.6213,9.37868C38.0355,8.79289,37.3284,8.5,36.5,8.5L11.5,8.5C10.67157,8.5,9.96447,8.79289,9.37868,9.37868C8.79289,9.96447,8.5,10.67157,8.5,11.5L8.5,36.5ZM17,16.25L17,31.75C17,32.5784,16.328400000000002,33.25,15.5,33.25C14.67157,33.25,14,32.5784,14,31.75L14,16.25C14,15.42157,14.67157,14.75,15.5,14.75C16.328400000000002,14.75,17,15.42157,17,16.25ZM34,16.25L34,31.75C34,32.5784,33.3284,33.25,32.5,33.25C31.6716,33.25,31,32.5784,31,31.75L31,16.25C31,15.42157,31.6716,14.75,32.5,14.75C33.3284,14.75,34,15.42157,34,16.25ZM24,17.5C25.1046,17.5,26,18.395400000000002,26,19.5C26,20.604599999999998,25.1046,21.5,24,21.5C22.8954,21.5,22,20.604599999999998,22,19.5C22,18.395400000000002,22.8954,17.5,24,17.5ZM24,26.5C25.1046,26.5,26,27.3954,26,28.5C26,29.6046,25.1046,30.5,24,30.5C22.8954,30.5,22,29.6046,22,28.5C22,27.3954,22.8954,26.5,24,26.5Z" 
            fill="#656A72"
          />
        </svg>
      </button>
      {/* 右下角浮窗 */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-1 w-[180px] h-[180px] z-10">
        <div className="w-full h-full relative">
          {mapReady && <MiniMap mainMap={mapInstanceRef.current} points={points} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
