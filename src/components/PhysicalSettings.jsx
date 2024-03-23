import {
  useRef,
  useEffect
} from 'react';
import {
  Composite
} from 'matter-js';
import {
  createObject
} from 'utils/matterjs/objects/CreateObjects';
import {
  StageStartX,
  StageEndX
} from 'utils/GameSetting';

export const PhysicalSettings = ({
  engine,
  selectObjectRef,
  selectObjectX,
  setSelectObjectX,
  selectObjectY,
  setSelectObjectY,
  selectObjectType,
  setSelectObjectType
}) => {
  const widthRef = useRef();
  const heightRef = useRef();
  const xRef = useRef();
  const yRef = useRef();
  const radiusRef = useRef();
  const sidesRef = useRef();
  const angleRef = useRef();
  const reGenerateObjectRef = useRef();
  const isOnStage = (x) => {
    return x >= StageStartX && x <= StageEndX;
  }
  const DEFAULT_X = 0;
  const DEFAULT_Y = 0;
  const DEFAULT_ANGLE = 0;
  const DEFAULT_RECTANGLE_WIDTH = 10;
  const DEFAULT_RECTANGLE_HEIGHT = 10;
  const DEFAULT_CIRCLE_RADIUS = 10;
  const DEFAULT_TRIANGLE_HEIGHT = 10;
  const DEFAULT_POLYGON_SIDES = 4;
  const DEFAULT_POLYGON_RADIUS = 10;
  const WIDTH_ZERO = 0;
  const HEIGHT_ZERO = 0;
  const SELECT_OBJECT_OUTLINE_WIDTH = 5;
  const EDIT_SCALE = 2/3;
  const MULTIPLY_SCALE = 2;

  useEffect(() => {
    if (!engine) return;
    
    setXY();
    setSizeSettings();

  }, [engine, selectObjectX, selectObjectY, selectObjectType]);

  // X座標とY座標を設定
  const setXY = () => {
    if (!selectObjectRef.current) {
      xRef.current.value = DEFAULT_X;
      yRef.current.value = DEFAULT_Y;
      return;
    }

    // x座標はステージの開始点を0として設定
    xRef.current.value = selectObjectX ? selectObjectX - StageStartX : DEFAULT_X;
    yRef.current.value = selectObjectY ? selectObjectY : DEFAULT_Y;
  }

  // サイズ関連の項目を設定
  const setSizeSettings = () => {
    // オブジェクトが選択されていない、またはステージ上にない場合はサイズと角度を0にする
    if (!selectObjectType || !selectObjectRef.current || !isOnStage(selectObjectX)) {
      widthRef.current.value = WIDTH_ZERO;
      heightRef.current.value = HEIGHT_ZERO;
      angleRef.current.value = DEFAULT_ANGLE;
      return;
    }

    // 長方形の場合
    if (selectObjectType === 'Rectangle') {
      const object = selectObjectRef.current.getParent();
      widthRef.current.value = object.object.width;
      heightRef.current.value = object.object.height;
      angleRef.current.value = object.object.angle ? object.object.angle : DEFAULT_ANGLE;
      return;
    }

    // 円の場合
    if (selectObjectType === 'Circle') {
      const object = selectObjectRef.current.getParent();
      radiusRef.current.value = object.object.radius;
      return;
    }

    // 三角形の場合
    if (selectObjectType === 'Triangle') {
      const object = selectObjectRef.current.getParent();
      heightRef.current.value = object.object.height;
      angleRef.current.value = object.object.angle ? object.object.angle : DEFAULT_ANGLE;
      return;
    }

    // 多角形の場合
    if (selectObjectType === 'Polygon') {
      const object = selectObjectRef.current.getParent();
      sidesRef.current.value = object.object.sides;
      radiusRef.current.value = object.object.radius;
      angleRef.current.value = object.object.angle ? object.object.angle : DEFAULT_ANGLE;
      return;
    }
  }

  // オブジェクトタイプに応じてオブジェクトを再生成
  const reGenerateObject = () => {
    // オブジェクト未選択もしくはステージ上にない場合は処理をしない
    if (!selectObjectRef.current || !isOnStage(selectObjectX)) return;

    if (selectObjectType === 'Rectangle') reGenerateRectangle();

    if (selectObjectType === 'Circle') reGenerateCircle();

    if (selectObjectType === 'Triangle') reGenerateTriangle();

    if (selectObjectType === 'Polygon') reGeneratePolygon();

    Composite.remove(engine.world, selectObjectRef.current);
    Composite.add(engine.world, reGenerateObjectRef.current);
    selectObjectRef.current = reGenerateObjectRef.current;
    reGenerateObjectRef.current = null;
    setSelectObjectX(selectObjectRef.current.position.x);
    setSelectObjectY(selectObjectRef.current.position.y);
    setSelectObjectType(selectObjectRef.current.bodiesType);
    selectObjectRef.current.render.lineWidth = SELECT_OBJECT_OUTLINE_WIDTH;
    selectObjectRef.current.render.strokeStyle = "red";
    const parent = selectObjectRef.current.getParent();
    parent.multiplyScale(EDIT_SCALE);
  }

  // 長方形を生成
  const reGenerateRectangle = () => {
    const width = widthRef.current.value ? Number(widthRef.current.value) : DEFAULT_RECTANGLE_WIDTH;
    const height = heightRef.current.value ? Number(heightRef.current.value) : DEFAULT_RECTANGLE_HEIGHT;
    const x = (xRef.current.value ? Number(xRef.current.value) : DEFAULT_X) + StageStartX;
    const y = yRef.current.value ? Number(yRef.current.value) : DEFAULT_Y;
    const angle = angleRef.current.value ? parseFloat(angleRef.current.value) : DEFAULT_ANGLE;
    const object = selectObjectRef.current.getParent().object;
    const label = object.label;
    const bodiesType = object.bodiesType;
    const objectType = object.objectType;

    reGenerateObjectRef.current = createObject({
      x: x,
      y: y,
      width: width,
      height: height,
      option: {
        isStatic: true,
        label: label,
        bodiesType: bodiesType,
        objectType: objectType,
        width: width,
        height: height,
        angle: angle
      },
      bodiesType: bodiesType
    }, objectType).getObject();
  }

  // 円を生成
  const reGenerateCircle = () => {
    const radius = radiusRef.current.value ? Number(radiusRef.current.value) : DEFAULT_CIRCLE_RADIUS;
    const x = (xRef.current.value ? Number(xRef.current.value) : DEFAULT_X) + StageStartX;
    const y = yRef.current.value ? Number(yRef.current.value) : DEFAULT_Y;
    const object = selectObjectRef.current.getParent().object;
    const label = object.label;
    const bodiesType = object.bodiesType;
    const objectType = object.objectType;

    reGenerateObjectRef.current = createObject({
      x: x,
      y: y,
      radius: radius,
      option: {
        isStatic: true,
        label: label,
        bodiesType: bodiesType,
        objectType: objectType,
        radius: radius
      },
      bodiesType: bodiesType
    }, objectType).getObject();
  }

  // 三角形を生成
  const reGenerateTriangle = () => {
    const height = heightRef.current.value ? Number(heightRef.current.value) : DEFAULT_TRIANGLE_HEIGHT;
    const x = (xRef.current.value ? Number(xRef.current.value) : DEFAULT_X) + StageStartX;
    const y = yRef.current.value ? Number(yRef.current.value) : DEFAULT_Y;
    const angle = angleRef.current.value ? parseFloat(angleRef.current.value) : DEFAULT_ANGLE;
    const object = selectObjectRef.current.getParent().object;
    const label = object.label;
    const bodiesType = object.bodiesType;
    const objectType = object.objectType;

    reGenerateObjectRef.current = createObject({
      x: x,
      y: y,
      height: height,
      option: {
        isStatic: true,
        label: label,
        bodiesType: bodiesType,
        objectType: objectType,
        height: height,
        angle: angle
      },
      bodiesType: bodiesType
    }, objectType).getObject();
  }

  // 多角形を生成
  const reGeneratePolygon = () => {
    const sides = sidesRef.current.value ? Number(sidesRef.current.value) : DEFAULT_POLYGON_SIDES;
    const radius = radiusRef.current.value ? Number(radiusRef.current.value) : DEFAULT_POLYGON_RADIUS;
    const x = (xRef.current.value ? Number(xRef.current.value) : DEFAULT_X) + StageStartX;
    const y = yRef.current.value ? Number(yRef.current.value) : DEFAULT_Y;
    const angle = angleRef.current.value ? parseFloat(angleRef.current.value) : DEFAULT_ANGLE;
    const object = selectObjectRef.current.getParent().object;
    const label = object.label;
    const bodiesType = object.bodiesType;
    const objectType = object.objectType;

    reGenerateObjectRef.current = createObject({
      x: x,
      y: y,
      sides: sides,
      radius: radius,
      option: {
        isStatic: true,
        label: label,
        bodiesType: bodiesType,
        objectType: objectType,
        sides: sides,
        radius: radius,
        angle: angle
      },
      bodiesType: bodiesType
    }, objectType).getObject();
  }

  return (
    <div className="h-full flex flex-col border-b-2 border-r-2 border-l-2 border-black">
      <div className="w-full h-1/2 flex">
        {(selectObjectType === null || selectObjectType === 'Rectangle' || !isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>幅</label>
            <input type="number" ref={widthRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === null || selectObjectType === 'Rectangle' || !isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>高さ</label>
            <input type="number" ref={heightRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === null || selectObjectType === 'Rectangle' || !isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角度</label>
            <input type="number" step="0.1" ref={angleRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Circle' && isOnStage(selectObjectX)) && (
          <div className="w-3/6 h-full flex flex-col items-center">
            <label>大きさ</label>
            <input type="number" ref={radiusRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Triangle' && isOnStage(selectObjectX)) && (
          <div className="w-2/6 h-full flex flex-col items-center">
            <label>大きさ</label>
            <input type="number" ref={heightRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Triangle' && isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角度</label>
            <input type="number" step="0.1" ref={angleRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Polygon' && isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角の数</label>
            <input type="number" ref={sidesRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Polygon' && isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>大きさ</label>
            <input type="number" ref={radiusRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        {(selectObjectType === 'Polygon' && isOnStage(selectObjectX)) && (
          <div className="w-1/6 h-full flex flex-col items-center">
            <label>角度</label>
            <input type="number" step="0.1" ref={angleRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
          </div>
        )}
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>X座標</label>
          <input type="number" ref={xRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
        </div>
        <div className="w-1/6 h-full flex flex-col items-center">
          <label>Y座標</label>
          <input type="number" ref={yRef} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center" />
        </div>
        <div className="w-1/6 h-full flex items-center justify-center">
          <button
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={reGenerateObject}
          >反映</button>
        </div>
      </div>
      <div className="w-full h-1/2 flex">
        <div className="w-1/6 h-full">f</div>
        <div className="w-1/6 h-full">g</div>
        <div className="w-1/6 h-full">h</div>
        <div className="w-1/6 h-full">i</div>
        <div className="w-1/6 h-full">i</div>
        <div className="w-1/6 h-full flex items-center justify-center">
          <button type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">リセット</button>
        </div>
      </div>
    </div>
  );
}