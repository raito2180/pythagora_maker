// オブジェクトパレットに表示するオブジェクトの情報を定義
export const PaletteObjects = [
  {
    x: 1011,
    y: 80,
    radius: 30,
    option: {
      isStatic: true,
      label: "Palette01",
      bodiesType: "Circle",
      objectType: "Ball",
      radius: 30
    },
    bodiesType: "Circle"
  },
  {
    x: 1161,
    y: 80,
    width: 300,
    height: 30,
    option: {
      isStatic: true,
      label: "Palette02",
      bodiesType: "Rectangle",
      objectType: "Stage",
      width: 300,
      height: 30,
      angle: 0.5
    },
    bodiesType: "Rectangle"
  },
  {
    x: 1011,
    y: 180,
    height: 80,
    option: {
      isStatic: true,
      label: "Palette03",
      bodiesType: "Triangle",
      objectType: "Stage",
      height: 80
    },
    bodiesType: "Triangle"
  },
  {
    x: 1161,
    y: 180,
    sides: 5,
    radius: 30,
    option: {
      isStatic: true,
      label: "Palette04",
      bodiesType: "Polygon",
      objectType: "Stage",
      sides: 5,
      radius: 30
    },
    bodiesType: "Polygon"
  }
];