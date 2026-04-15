// src/utils/mathPhysics.ts

export const mechanicalMath = {
  calculatePCD: (diameter: number, numHoles: number, startAngle: number, origin: { x: number, y: number }) => {
    const radius = diameter / 2;
    const angleStep = 360 / numHoles;
    
    return Array.from({ length: numHoles }, (_, i) => {
      const currentAngle = (startAngle + i * angleStep) % 360;
      const radian = (currentAngle * Math.PI) / 180;
      
      // Tọa độ Tuyệt đối (so với tâm vòng tròn - dùng để vẽ)
      const absX = radius * Math.cos(radian);
      const absY = radius * Math.sin(radian);

      // Tọa độ Tương đối (so với Gốc được chọn - dùng cho bảng G-Code)
      // Công thức: Tọa độ mới = Tọa độ tuyệt đối - Tọa độ của điểm Gốc
      return {
        angle: currentAngle,
        x: absX,
        y: absY,
        relativeX: absX - origin.x,
        relativeY: absY - origin.y,
      };
    });
  },

  /**
   * Tính tốc độ vòng quay (RPM)
   */
  calculateRPM: (vc: number, diameter: number): number => {
    if (diameter === 0) return 0;
    return Math.round((vc * 1000) / (Math.PI * diameter));
  }
};