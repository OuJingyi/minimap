import { useEffect, useRef } from 'react';

const MiniMap = ({ mainMap, points }) => {
  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const pointMarkersRef = useRef([]);

  useEffect(() => {
    if (!window.AMap || !mainMap || !miniMapRef.current) return;

    // 等待主地图完全初始化
    const initMiniMap = () => {
      try {
        // 创建小地图实例
        const miniMap = new window.AMap.Map(miniMapRef.current, {
          zoom: 10, // 固定缩放级别
          center: [116.397428, 39.90923], // 北京市中心
          mapStyle: "amap://styles/whitesmoke",
          viewMode: '2D',
          dragEnable: false, // 禁用拖动
          zoomEnable: false, // 禁用缩放
          doubleClickZoom: false, // 禁用双击缩放
          keyboardEnable: false,
          jogEnable: false,
          scrollWheel: false, // 禁用滚轮缩放
          touchZoom: false, // 禁用触摸缩放
          showIndoorMap: false,
          showBuildingBlock: false,
          showLabel: false,
          showTraffic: false,
          showRoad: false,
          showPOI: false,
          showDistrict: false
        });

        miniMapInstanceRef.current = miniMap;

        // 创建标记
        const marker = new window.AMap.Marker({
          position: mainMap.getCenter(),
          offset: new window.AMap.Pixel(-8, -8),
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(16, 16),
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHN0cm9rZT0iIzE5NzZEMiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
            imageSize: new window.AMap.Size(16, 16)
          })
        });
        miniMap.add(marker);
        markerRef.current = marker;

        // 只监听主地图的移动事件
        mainMap.on('moveend', () => {
          const center = mainMap.getCenter();
          miniMap.setCenter(center);
        });

        // 监听主地图的鼠标移动事件
        const handleMouseMove = (e) => {
          if (markerRef.current) {
            markerRef.current.setPosition(e.lnglat);
          }
        };

        mainMap.on('mousemove', handleMouseMove);

        // 监听小地图的点击事件
        miniMap.on('click', (e) => {
          mainMap.setCenter(e.lnglat);
        });

        return () => {
          mainMap.off('mousemove', handleMouseMove);
        };
      } catch (error) {
        console.error('初始化小地图失败:', error);
      }
    };

    // 确保主地图已完全初始化
    if (mainMap.getCenter) {
      initMiniMap();
    } else {
      mainMap.on('complete', initMiniMap);
    }

    return () => {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.destroy();
      }
    };
  }, [mainMap]);

  // 添加点位标记
  useEffect(() => {
    if (!miniMapInstanceRef.current || !points.length) return;

    // 清除现有标记
    pointMarkersRef.current.forEach(marker => marker.setMap(null));
    pointMarkersRef.current = [];

    // 添加新标记
    points.forEach(point => {
      const circle = new window.AMap.CircleMarker({
        center: point.geometry.coordinates,
        radius: 2,
        fillColor: '#1890ff',
        fillOpacity: 0.8,
        strokeColor: '#fff',
        strokeWeight: 1,
        strokeOpacity: 1,
        zIndex: 10,
        bubble: true,
        map: miniMapInstanceRef.current
      });
      pointMarkersRef.current.push(circle);
    });

    // 调整小地图视野以显示所有点位
    if (pointMarkersRef.current.length > 0) {
      miniMapInstanceRef.current.setFitView(pointMarkersRef.current, {
        padding: [20, 20, 20, 20] // 设置内边距，确保所有点都能显示
      });
    }
  }, [points]);

  return (
    <div 
      ref={miniMapRef} 
      className="w-full h-full rounded-md overflow-hidden"
      style={{ minHeight: '120px' }}
    />
  );
};

export default MiniMap; 